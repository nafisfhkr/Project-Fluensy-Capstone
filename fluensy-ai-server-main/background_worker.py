import pymysql
import json
import time
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from google import genai
from google.genai import types

load_dotenv()


# Konfigurasi Database dari .env
DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_SSL_CA = os.getenv("DB_SSL_CA")  #

print("Membangunkan AI Transformer (MiniLM-Multilingual)...")
model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
print("AI Vektor Siap!\n")

print("🔮 Membangunkan AI Peramal (Gemini)...")
API_KEY = os.environ.get("GEMINI_API_KEY")
ai_client = genai.Client(api_key=API_KEY)
print("AI Peramal Siap & Berjaga 24 Jam di Background!\n")


def get_db_connection():
    ssl_config = {"ca": DB_SSL_CA} if DB_SSL_CA else None

    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        ssl=ssl_config,
        cursorclass=pymysql.cursors.DictCursor,
    )


def ramal_demografi(
    influencer_name, bio, captions, existing_kategori, existing_niche, max_retries=3
):
    instruksi_kategori = ""
    json_kategori = ""

    if not existing_kategori or not existing_niche:
        instruksi_kategori = """
    3. TENTUKAN KATEGORI & NICHE UTAMANYA. Berdasarkan Bio dan Caption, WAJIB pilih 1 Kategori Utama dan 1 hingga 3 Niche Spesifik HANYA DARI DAFTAR DI BAWAH INI (Dilarang keras membuat kategori/niche sendiri! Pisahkan niche dengan titik koma ';'):
    
    DAFTAR KATEGORI & NICHE RESMI:
    - Beauty & Fashion: Skincare, Makeup & Cosmetics, Haircare, Modest Fashion (Hijab), Luxury Fashion, Streetwear, Thrifting & Sustainable, Body Positivity
    - Food & Beverage: Street Food Reviewer, Fine Dining & Cafe, Home Cooking & Recipes, Baking & Pastry, Coffee & Barista, Vegan & Healthy Food, Mukbang
    - Technology & Digital: Smartphone & Gadget, PC Building & Setup, Software & AI Tools, Programming & Web Dev, Home Automation
    - Finance & Business: Personal Finance, Stock Market & Crypto, Entrepreneurship, Affiliate Marketing, Property & Real Estate
    - Gaming & Esports: Mobile Gaming, PC & Console Gaming, Esports News, Retro Gaming
    - Education & Career: Self Development, Career Advice, Language Learning, Scholarship Info, Studygram
    - Lifestyle & Travel: Luxury Travel, Backpacking & Budget Travel, Glamping & Camping, Hidden Gems, Minimalist Living, Travel Vlogger, Daily Vlog
    - Family & Parenting: Parenting Tips, MPASI & Baby Food, Working Mom Lifestyle, Home & Decor, Family Vlog, Couple & Relationship
    - Health & Fitness: Gym & Bodybuilding, Yoga & Pilates, Running & Marathon, Mental Health Awareness, Nutritionist
    - Entertainment & Hobbies: Comedy & Parody, Movie & Series Reviewer, Anime & Manga, Photography & Videography, Bookstagram, K-Pop & Fandom, Pets & Animals, Automotive, Musisian, Actor, Celebrity Lifestyle, Prank & Challenge
    """
        json_kategori = ',\n      "kategori_utama": "Nama Kategori",\n      "niche_spesifik": "Niche 1; Niche 2"'
    else:
        print(
            f"Niche sudah diisi manual dari web ({existing_kategori}), skip klasifikasi AI."
        )

    prompt = f"""
    Kamu adalah ahli analitik media sosial Indonesia. 
    Analisis profil influencer ini:
    Nama/Username: {influencer_name}
    Bio: {bio}
    Beberapa Caption Terakhir: {captions}
    
    Tugasmu ada 2:
    BAGIAN A: TEBAK DEMOGRAFI AUDIENS (PENONTON)
    1. Tebak rentang usia audiens (min_age dan max_age).
    2. Prediksi persentase GENDER audiens (male_percentage dan female_percentage, total 100).
    3. Pilih maksimal 3 kota terbanyak domisili audiens.
    
    BAGIAN B: TEBAK DEMOGRAFI INFLUENCER (SANG KREATOR)
    1. Tebak umur asli influencer ini sekarang (1 angka integer, contoh: 24).
    2. Tebak kota tempat tinggal influencer ini sekarang (1 kota saja).
    {instruksi_kategori}
    
    Pilihan Kota: "jakarta barat", "jakarta pusat", "jakarta selatan", "jakarta timur", "jakarta utara", "bandung", "surabaya", "bekasi", "tangerang", "depok", "semarang", "palembang", "makassar", "tangerang selatan", "bogor", "batam", "pekanbaru", "bandar lampung", "padang", "malang", "denpasar", "samarinda", "tasikmalaya", "pontianak", "banjarmasin", "serang", "jambi", "cimahi", "surakarta", "manado", "kupang", "cilegon", "mataram", "jayapura", "bengkulu", "palu", "sukabumi", "banjarbaru", "tarakan", "tegal", "sorong", "binjai", "dumai", "kediri", "padangsidimpuan", "lhokseumawe", "singkawang", "lubuklinggau", "gunungsitoli", "bitung", "madiun", "ambon", "pangkalpinang", "pasuruan", "ternate", "banjar", "pematangsiantar", "salatiga", "blitar", "tebing tinggi", "tanjungbalai", "metro", "baubau", "parepare", "probolinggo", "pagar alam", "payakumbuh", "mojokerto", "bukittinggi", "palopo", "prabumulih", "langsa", "tomohon", "tidore kepulauan", "sibolga", "pariaman", "solok", "sawah lunto", "padang panjang", "sabang", "subulussalam", "sungai penuh", "tual", "bima", "gorontalo", "kotamobagu", "batu", "pekalongan", "magelang", "tanjungpinang", "cirebon", atau "seluruh indonesia".
    
    WAJIB BALAS HANYA DENGAN FORMAT JSON INI:
    {{
      "audience_min_age": 0, 
      "audience_max_age": 0, 
      "audience_male_percentage": 0, 
      "audience_female_percentage": 0, 
      "audience_location": ["kota_1", "kota_2"],
      "influencer_age": 0,
      "influencer_location": "kota_domisili"{json_kategori}
    }}
    """

    for attempt in range(max_retries):
        try:
            response = ai_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.3,
                    response_mime_type="application/json",
                ),
            )
            data = json.loads(response.text)
            if isinstance(data.get("audience_location"), list):
                data["audience_location"] = ", ".join(data["audience_location"])
            male_pct = data.get("audience_male_percentage", 50)
            female_pct = data.get("audience_female_percentage", 50)
            data["audience_gender"] = f"L: {male_pct}%, P: {female_pct}%"
            return data
        except Exception as e:
            print(f"API Error ({attempt + 1}/{max_retries}): {e}")
            time.sleep(15)
    return None


def process_new_influencers():
    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            sql_get = """
                SELECT i.id, i.full_name, sa.id as social_account_id, sa.username, sa.bio 
                FROM influencers i
                LEFT JOIN social_accounts sa ON i.id = sa.influencer_id AND sa.platform = 'instagram'
                WHERE i.is_analyzed = 0 OR i.embedding_vector IS NULL 
                LIMIT 3
            """
            cursor.execute(sql_get)
            influencers = cursor.fetchall()

            if influencers:
                for inf in influencers:
                    inf_id = inf["id"]
                    soc_acc_id = inf["social_account_id"]
                    username_target = (
                        inf["username"] if inf["username"] else f"ID-{inf_id}"
                    )
                    bio_target = inf["bio"] if inf["bio"] else ""

                    print(
                        f"\n[{time.strftime('%H:%M:%S')}] Target Baru: @{username_target}!"
                    )

                    cursor.execute(
                        """
                        SELECT c.name as category_name, n.name as niche_name 
                        FROM influencer_niche in_rel
                        JOIN niches n ON in_rel.niche_id = n.id
                        JOIN categories c ON n.category_id = c.id
                        WHERE in_rel.influencer_id = %s
                    """,
                        (inf_id,),
                    )
                    existing_relations = cursor.fetchall()

                    existing_kat = (
                        existing_relations[0]["category_name"]
                        if existing_relations
                        else None
                    )
                    existing_niche_list = (
                        [r["niche_name"] for r in existing_relations]
                        if existing_relations
                        else []
                    )
                    existing_niche_str = (
                        "; ".join(existing_niche_list) if existing_niche_list else None
                    )

                    # UBAHAN 2: Menggunakan social_account_id untuk mencari di tabel posts
                    posts = []
                    if soc_acc_id:
                        cursor.execute(
                            "SELECT caption FROM posts WHERE social_account_id = %s LIMIT 10",
                            (soc_acc_id,),
                        )
                        posts = cursor.fetchall()

                    teks_gabungan = bio_target + " "
                    kumpulan_caption = ""
                    for post in posts:
                        if post["caption"]:
                            kumpulan_caption += post["caption"] + " "
                            teks_gabungan += post["caption"] + " "

                    print("   -> Mengekstrak Vektor AI...")
                    teks_vektor = teks_gabungan[:2000]
                    vektor = model.encode(teks_vektor)
                    vektor_json = json.dumps(vektor.tolist())

                    print("   -> Meminta Gemini meramal demografi...")
                    ramalan = ramal_demografi(
                        username_target,
                        bio_target,
                        kumpulan_caption[:1000],
                        existing_kat,
                        existing_niche_str,
                    )

                    if ramalan is None:
                        print(f"API Gagal. Lanjut ke antrean...")
                        time.sleep(10)
                        continue

                    print(
                        f"Hasil Demografi: Umur Kreator {ramalan.get('influencer_age', 0)}, Audiens {ramalan.get('audience_gender', '')}"
                    )

                    sql_update = """
                        UPDATE influencers 
                        SET embedding_vector = %s, 
                            is_analyzed = 1,
                            audience_min_age = %s, 
                            audience_max_age = %s, 
                            audience_gender = %s, 
                            audience_location = %s,
                            influencer_age = %s,
                            influencer_location = %s
                        WHERE id = %s
                    """
                    cursor.execute(
                        sql_update,
                        (
                            vektor_json,
                            ramalan.get("audience_min_age", 18),
                            ramalan.get("audience_max_age", 35),
                            ramalan.get("audience_gender", "L: 50%, P: 50%"),
                            ramalan.get("audience_location", "seluruh indonesia"),
                            ramalan.get("influencer_age", 25),
                            ramalan.get("influencer_location", "jakarta selatan"),
                            inf_id,
                        ),
                    )

                    if not existing_relations and "niche_spesifik" in ramalan:
                        ai_niches = [
                            n.strip() for n in ramalan["niche_spesifik"].split(";")
                        ]
                        for ai_niche in ai_niches:
                            cursor.execute(
                                "SELECT id FROM niches WHERE name = %s LIMIT 1",
                                (ai_niche,),
                            )
                            niche_row = cursor.fetchone()
                            if niche_row:
                                n_id = niche_row["id"]
                                cursor.execute(
                                    """
                                    INSERT IGNORE INTO influencer_niche (influencer_id, niche_id, is_primary) 
                                    VALUES (%s, %s, %s)
                                """,
                                    (inf_id, n_id, 0),
                                )
                                print(
                                    f"Relasi Niche Baru Ditambahkan: {ai_niche}"
                                )

                    connection.commit()
                    print(
                        f"[{time.strftime('%H:%M:%S')}]  @{username_target} SUKSES di-upgrade AI & Masuk Database!"
                    )
                    time.sleep(5)

    except Exception as e:
        print(f"ERROR DATABASE: {e}")
    finally:
        if "connection" in locals() and connection.open:
            connection.close()


print("\n---PROGRAM DATA PIPELINE DIMULAI ---")
while True:
    process_new_influencers()
    time.sleep(15)
