import streamlit as st
import pandas as pd
import plotly.express as px
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats import mannwhitneyu

st.set_page_config(page_title="Influencer Analytics", layout="wide")

st.markdown("""
    <style>
    .main { background-color: #f8f9fa; }
    </style>
    """, unsafe_allow_html=True)

# Fungsi Load Data
@st.cache_data
def load_data():
    df = pd.read_csv("kol_data_final.csv")
    return df

try:
    df = load_data()
except:
    st.error("File 'kol_data_final.csv' tidak ditemukan. Pastikan Anda sudah mengunggahnya.")
    st.stop()


# Menambahkan Logo TikTok dan Instagram (Gambar Asli) Diletakkan di atas Title
logo_tiktok = "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
logo_ig = "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"

st.sidebar.markdown(
    f"""
    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 0px; margin-top: 10px;">
        <img src="{logo_tiktok}" width="80">
        <img src="{logo_ig}" width="80">
    </div>
    """,
    unsafe_allow_html=True
)

st.sidebar.title("🚀 Dashboard")
st.sidebar.markdown("Smart Influencer Matching Platform")

# Menambahkan menu "Validasi A/B Testing"
menu = st.sidebar.selectbox("Pilih Menu:", 
    ["Ringkasan Data", "Distribusi Kategori & Tier", "Analisis Harga (Rates)", "Validasi A/B Testing", "Katalog Influencer", "Kesimpulan"])


if menu == "Ringkasan Data":
    st.title("📊 Ringkasan Ekosistem Influencer")
    
    # ---------------------------------------------------------
    # INI ADALAH FUNGSI SIMPEL UNTUK MEMBUAT KOTAK WARNA-WARNI
    # ---------------------------------------------------------
    def buat_kartu(judul, nilai, warna_bg, warna_teks):
        st.markdown(f"""
        <div style="background-color: {warna_bg}; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="margin:0; font-size: 14px; color: {warna_teks}; font-weight: bold;">{judul}</p>
            <h2 style="margin:0; padding-top: 5px; color: {warna_teks}; font-size: 32px;">{nilai}</h2>
        </div>
        """, unsafe_allow_html=True)

    # Metrik Utama memanggil fungsi di atas
    m1, m2, m3, m4 = st.columns(4)
    
    with m1:
        buat_kartu("Total Influencer", len(df), "#E8F0FE", "#1967D2")  # Tema Biru
    with m2:
        buat_kartu("Total Kategori", df['kategori'].nunique(), "#E6F4EA", "#137333")  # Tema Hijau
    with m3:
        buat_kartu("Rata-rata Base Rate", f"Rp {df['base_rate'].mean():,.0f}", "#FEF7E0", "#B06000")  # Tema Oranye
    with m4:
        buat_kartu("Tier Terbanyak", df['tier'].mode()[0], "#F3E8FD", "#7627BB")  # Tema Ungu
    # ---------------------------------------------------------

    st.markdown("<br>", unsafe_allow_html=True) # Memberi jarak sebelum tabel
    st.subheader("Cuplikan Data Influencer")
    st.dataframe(df.head(20), use_container_width=True)

elif menu == "Distribusi Kategori & Tier":
    st.title("🏗️ Distribusi Influencer")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Jumlah KOL per Kategori")
        fig_kat = px.bar(df['kategori'].value_counts().reset_index(), 
                         x='count', y='kategori', orientation='h',
                         color='count', color_continuous_scale='Blues')
        st.plotly_chart(fig_kat, use_container_width=True)

    with col2:
        st.subheader("Proporsi Tier Influencer")
        # Urutan tier sesuai notebook final
        tier_order = ['Nano', 'Micro', 'Mid', 'Macro', 'Mega']
        fig_tier = px.pie(df, names='tier', hole=0.4, color_discrete_sequence=px.colors.qualitative.Pastel)
        st.plotly_chart(fig_tier, use_container_width=True)

    st.subheader("Peta Sebaran: Kategori vs Tier")
    pivot_data = pd.crosstab(df['kategori'], df['tier'])
    
    fig_heat = px.imshow(
        pivot_data, 
        text_auto=True, 
        aspect="auto",
        color_continuous_scale='YlOrRd',
        height=500    
    )
    
    # Memperbesar ukuran font agar angka lebih jelas terbaca
    fig_heat.update_layout(
        font=dict(size=14),
        margin=dict(l=0, r=0, t=20, b=0)
    )
    
    st.plotly_chart(fig_heat, use_container_width=True)

elif menu == "Analisis Harga (Rates)":
    st.title("💰 Analisis Biaya & Efisiensi")
    
    st.subheader("Median Base Rate per Kategori (Juta Rp)")
    avg_rate = df.groupby('kategori')['base_rate'].median().sort_values(ascending=True) / 1e6
    fig_price = px.bar(avg_rate.reset_index(), x='base_rate', y='kategori', orientation='h', color='base_rate')
    st.plotly_chart(fig_price, use_container_width=True)

    st.subheader("Korelasi Antar Jenis Rate")
    # Memastikan kolom rate tersedia sesuai data final
    corr_cols = ['base_rate','story_rate','post_rate','pp_rate','efficiency_score']
    corr = df[corr_cols].corr()
    
    fig_corr = px.imshow(
        corr, 
        text_auto=".2f", 
        aspect="700", # Memaksa grafik mengisi lebar layar
        color_continuous_scale='RdBu_r', 
        range_color=[-1,1],
        height=650     # Memperbesar ukuran vertikal grafik
    )
    
    # Memperbesar ukuran teks di dalam dan di sumbu grafik agar proporsional
    fig_corr.update_layout(
        font=dict(size=14),
        margin=dict(l=0, r=0, t=20, b=0)
    )
    
    st.plotly_chart(fig_corr, use_container_width=True)

# --- MENU BARU: A/B TESTING ---
elif menu == "Validasi A/B Testing":
    st.title("🔬 Validasi Statistik (A/B Testing)")
    st.markdown("""
    Menu ini memvalidasi apakah perbedaan harga antara kelompok **Micro** dan **Macro** benar-benar nyata 
    secara statistik menggunakan **Mann-Whitney U Test** (karena data tidak berdistribusi normal).
    """)
    
    # Menyiapkan data untuk testing
    group_micro = df[df['tier'] == 'Micro']['base_rate']
    group_macro = df[df['tier'] == 'Macro']['base_rate']
    
    # Eksekusi Uji Statistik
    stat, p_value = mannwhitneyu(group_micro, group_macro)
    
    res1, res2 = st.columns(2)
    with res1:
        st.metric("P-Value", f"{p_value:.4f}")
    with res2:
        status = "Signifikan" if p_value < 0.05 else "Tidak Signifikan"
        st.metric("Hasil Pengujian", status)

    if p_value < 0.05:
        st.success("✅ **Kesimpulan:** Terdapat perbedaan harga yang signifikan secara statistik antara Micro dan Macro. Strategi budget harus dibedakan untuk kedua tier ini.")
    else:
        st.warning("⚠️ **Kesimpulan:** Tidak ada perbedaan harga yang signifikan secara statistik antara kedua kelompok.")

    # Visualisasi distribusi untuk A/B testing
    fig_ab = px.histogram(df[df['tier'].isin(['Micro', 'Macro'])], 
                          x="base_rate", color="tier", barmode="overlay",
                          title="Perbandingan Distribusi Harga: Micro vs Macro")
    st.plotly_chart(fig_ab, use_container_width=True)

elif menu == "Katalog Influencer":
    st.title("🔍 Cari Influencer Berdasarkan ROI")
    
    # Filter
    f_kat = st.multiselect("Pilih Kategori", options=df['kategori'].unique(), default=df['kategori'].unique())
    f_tier = st.multiselect("Pilih Tier", options=df['tier'].unique(), default=df['tier'].unique())
    
    filtered_df = df[(df['kategori'].isin(f_kat)) & (df['tier'].isin(f_tier))]
    
    st.write(f"Ditemukan {len(filtered_df)} influencer. Diurutkan berdasarkan **Efficiency Score** tertinggi (Best ROI).")
    # Menampilkan efficiency_score agar user tahu mana yang paling efisien
    st.table(filtered_df[['nama_influencer', 'kategori', 'tier', 'base_rate', 'efficiency_score']].sort_values('efficiency_score', ascending=False).head(50))

elif menu == "Kesimpulan":
    st.title("💡 Kesimpulan Strategis")
    # Hasil dari A/B testing dan data final
    st.markdown(f"""
    Berdasarkan analisis data influencer terbaru:
    1. **Validasi Harga:** Melalui A/B testing, terbukti bahwa tier **Micro** dan **Macro** memiliki perbedaan struktur harga yang nyata, sehingga UMKM perlu memisahkan alokasi dana untuk kedua kategori ini.
    2. **Identifikasi ROI:** Dengan adanya **Efficiency Score**, UMKM kini bisa menemukan influencer yang memiliki harga di bawah rata-rata pasar namun tetap berada di tier yang diinginkan.
    3. **Rekomendasi Utama:** Untuk UMKM dengan budget terbatas, tier **Nano** dan **Micro** tetap memberikan efisiensi tertinggi karena memiliki *base rate* yang terjangkau dengan skor efisiensi yang kompetitif.
    
    **Saran Implementasi:**
    Prioritaskan influencer dengan *Efficiency Score* > 1.0 karena mereka menawarkan harga yang lebih bersahabat dibandingkan median harga pasar di tier yang sama.
    """)