from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from scipy.spatial.distance import cosine
from dotenv import load_dotenv
import pymysql
import json
import os
import tensorflow as tf
import numpy as np

# Load konfigurasi dari .env
load_dotenv()

app = FastAPI(title="Fluensy AI Microservice")

# =====================================================================
# CORS MIDDLEWARE (Biar Next.js / Laravel ga diblokir Browser)
# =====================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Nanti kalau sudah production ganti dengan domain Fluensy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================================
# 1. INISIALISASI AI 1: THE MATCHMAKER (Pencari KOL)
# =====================================================================
print("[FLUENSY AI] Membangunkan Otak Matchmaker (MiniLM)...")
model_matchmaker = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

# =====================================================================
# 2. INISIALISASI AI 2: THE PRICER (Penentu Harga)
# =====================================================================
print("[FLUENSY AI] Membangunkan Otak Pricer (TensorFlow)...")


@tf.keras.utils.register_keras_serializable()
class FluensyAttentionLayer(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super(FluensyAttentionLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        self.w = self.add_weight(
            shape=(input_shape[-1],), initializer="random_normal", trainable=True
        )

    def call(self, inputs):
        return inputs * tf.nn.sigmoid(self.w)


try:
    model_pricer = tf.keras.models.load_model("fluensy_pricer_v3.keras")
except Exception as e:
    print(f"Peringatan: Model Pricer gagal dimuat. Error: {e}")

print("[FLUENSY AI] Semua Mesin FastAPI Menyala!\n")


# =====================================================================
# KONEKSI DATABASE AIVEN (Baca dari .env)
# =====================================================================
def get_db_connection():
    ssl_ca = os.getenv("DB_SSL_CA")
    # Aiven butuh konfigurasi SSL ini
    ssl_config = {"ca": ssl_ca} if ssl_ca else None

    return pymysql.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        ssl=ssl_config,
        cursorclass=pymysql.cursors.DictCursor,
    )


# =====================================================================
# SCHEMA VALIDASI REQUEST (Pydantic)
# =====================================================================
class SearchQuery(BaseModel):
    query: str
    limit: int = 10


class RatecardQuery(BaseModel):
    followers: float = 0.0
    engagement_rate: float = 0.0
    average_views: float = 0.0
    niche_lengkap: str = "Umum"


# =====================================================================
# ROUTE 1: SMART MATCHING (Milik Portal Brand)
# =====================================================================
@app.post("/api/search-influencer")
async def search_influencer(data: SearchQuery):
    if not data.query:
        raise HTTPException(status_code=400, detail="Kriteria kosong")

    query_vector = model_matchmaker.encode(data.query).tolist()
    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    i.id as influencer_id, 
                    i.full_name, 
                    i.embedding_vector, 
                    sa.username, 
                    sa.followers, 
                    (
                        SELECT c.name 
                        FROM influencer_niche in_rel
                        JOIN niches n ON in_rel.niche_id = n.id
                        JOIN categories c ON n.category_id = c.id
                        WHERE in_rel.influencer_id = i.id
                        LIMIT 1
                    ) as kategori_utama,
                    (
                        SELECT GROUP_CONCAT(n.name SEPARATOR '; ')
                        FROM influencer_niche in_rel
                        JOIN niches n ON in_rel.niche_id = n.id
                        WHERE in_rel.influencer_id = i.id
                    ) as niche_spesifik
                FROM influencers i
                JOIN social_accounts sa ON i.id = sa.influencer_id
                WHERE i.embedding_vector IS NOT NULL AND sa.platform = 'instagram'
            """)
            influencers = cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        connection.close()

    results = []
    for kol in influencers:
        try:
            kol_vector = json.loads(kol["embedding_vector"])
            similarity = 1 - cosine(query_vector, kol_vector)
            match_score = round(similarity * 100, 1)

            if match_score > 20:
                results.append(
                    {
                        "influencer_id": kol["influencer_id"],
                        "username": kol["username"],
                        "followers": kol["followers"],
                        "kategori": kol["kategori_utama"],
                        "niche": kol["niche_spesifik"],
                        "match_score": match_score,
                    }
                )
        except:
            continue

    results_sorted = sorted(results, key=lambda x: x["match_score"], reverse=True)[
        : data.limit
    ]
    return {"status": "success", "data": results_sorted}


# =====================================================================
# ROUTE 2: GENERATE RATE CARD (Milik Portal Influencer)
# =====================================================================
@app.post("/api/generate-ratecard")
async def generate_ratecard(data: RatecardQuery):
    views = data.average_views
    if views == 0 and data.followers > 0:
        views = data.followers * 0.15

    # WORKAROUND SCALER (Karena kita tidak me-load file .pkl)
    scaled_followers = min(data.followers / 50000000.0, 1.0)
    scaled_er = min(data.engagement_rate / 15.0, 1.0)
    scaled_views = min(views / 10000000.0, 1.0)

    X_num = np.array([[scaled_followers, scaled_er, scaled_views]])
    X_text = tf.constant([data.niche_lengkap], dtype=tf.string)

    pred_scaled = model_pricer.predict(
        {"input_text": X_text, "input_numeric": X_num}, verbose=0
    )

    # INVERSE TRANSFORM WORKAROUND
    base_rate_raw = float(pred_scaled[0][0]) * 3000000000.0
    base_rate = max(100000, int(base_rate_raw))

    # =========================================================
    # THE MULTIPLIER ENGINE (Hitungan Backend)
    # =========================================================

    # 1. INSTAGRAM MULTIPLIERS
    ig_reels = base_rate
    ig_story = int(base_rate * 0.25)
    ig_post = int(base_rate * 0.70)
    ig_pp = int(base_rate * 0.15)

    ig_addon_owning = int(base_rate * 0.50)
    ig_addon_boost = int(base_rate * 0.30)
    ig_addon_link = int(base_rate * 0.40)

    # 2. TIKTOK MULTIPLIERS
    tiktok_base = int(base_rate * 1.20)
    tt_story = int(base_rate * 0.30)
    tt_post = int(base_rate * 0.80)
    tt_pp = int(tiktok_base * 0.20)

    tt_addon_owning = int(tiktok_base * 0.50)
    tt_addon_boost = int(tiktok_base * 0.30)
    tt_addon_link = int(tiktok_base * 0.50)

    print(
        f"[RATE CARD AI] Generate untuk {data.followers} Folls | Niche: {data.niche_lengkap[:20]}... -> Base Rp {base_rate:,}"
    )

    # JSON RESPONSE YANG SUPER LENGKAP
    return {
        "status": "success",
        "raw_input": {
            "followers": data.followers,
            "engagement_rate": data.engagement_rate,
            "average_views": views,
            "niche_input": data.niche_lengkap,
        },
        "rate_card": {
            "instagram": {
                "reels": ig_reels,
                "story": ig_story,
                "feed_post": ig_post,
                "paid_promotion": ig_pp,
                "addons": {
                    "owning_rights": ig_addon_owning,
                    "boosting_ads": ig_addon_boost,
                    "link_in_bio": ig_addon_link,
                },
            },
            "tiktok": {
                "video": tiktok_base,
                "story": tt_story,
                "feed_post": tt_post,
                "paid_promotion": tt_pp,
                "addons": {
                    "owning_rights": tt_addon_owning,
                    "boosting_ads": tt_addon_boost,
                    "link_in_bio": tt_addon_link,
                },
            },
        },
    }
