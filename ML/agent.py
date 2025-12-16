import asyncio
import os 
import pickle 
import re 
import smtplib 
from email.message import EmailMessage 
from dotenv import load_dotenv 
from typing import List, Dict, Union, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from google.adk.agents import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService 
from google.genai import types 

app = FastAPI(
    title="Mining Prediction and Recommendation API",
    description="API dengan dua Gemini Agent terpisah: satu untuk Masterplan (Mining) dan satu untuk Shipping Plan dengan format output terstruktur yang ketat."
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
load_dotenv(dotenv_path=".env") 

if not os.getenv("GEMINI_API_KEY"):
    print("FATAL: GEMINI_API_KEY tidak ditemukan. Agen tidak dapat diinisialisasi.")


MODEL_FILE_MINING = 'model.pkl'
MODEL_FILE_SHIPPING = 'shipping.pkl'
loaded_mining_model = None
loaded_shipping_model = None

try:
    with open(MODEL_FILE_MINING, 'rb') as file:
        loaded_mining_model = pickle.load(file)
    print(f"SUCCESS: Model '{MODEL_FILE_MINING}' (Mining) berhasil dimuat.")
except FileNotFoundError:
    print(f"ERROR: File '{MODEL_FILE_MINING}' tidak ditemukan. Model prediksi mining tidak akan berfungsi.")
except Exception as e:
    print(f"ERROR saat memuat model mining: {e}.")

try:
    with open(MODEL_FILE_SHIPPING, 'rb') as file:
        loaded_shipping_model = pickle.load(file)
    print(f"SUCCESS: Model '{MODEL_FILE_SHIPPING}' (Shipping) berhasil dimuat.")
except FileNotFoundError:
    print(f"ERROR: File '{MODEL_FILE_SHIPPING}' tidak ditemukan. Model prediksi shipping tidak akan berfungsi.")
except Exception as e:
    print(f"ERROR saat memuat model shipping: {e}.")


SENDER_EMAIL = os.getenv("SENDER_EMAIL")
APP_PASSWORD = os.getenv("APP_PASSWORD")

AGENT_NAME_MINING = "mining_masterplan_agent"
AGENT_NAME_SHIPPING = "shipping_plan_agent"
APP_NAME = "agents" 
GEMINI_MODEL = "gemini-2.5-flash" 
session_service = InMemorySessionService() 

mining_agent: Optional[LlmAgent] = None
shipping_agent: Optional[LlmAgent] = None


def predict_mining_target(scenarios: List[List[Union[int, float]]]) -> str:
    """Tool yang dipanggil oleh Mining Agent untuk prediksi tonase harian."""
    if loaded_mining_model is None:
        return "ERROR: Model prediksi mining belum dimuat atau gagal dimuat."
    
    if not scenarios:
        return "ERROR: Input skenario kosong."

    try:
        predictions = loaded_mining_model.predict(scenarios)
        
        results = []
        for i, (input_data, target) in enumerate(zip(scenarios, predictions)):
            results.append({
                "id": i + 1,
                "trucks": input_data[0],
                "excavators": input_data[1],
                "operators": input_data[2],
                "weather": input_data[3],
                "predicted_tonnage": round(target, 2)
            })

        return f"PREDICTION_RESULTS_MINING: {results}"
        
    except Exception as e:
        return f"ERROR saat menjalankan prediksi mining: {e}. Pastikan dimensi input model (4 fitur) benar."


def predict_shipping_target(scenarios: List[List[Union[int, float]]]) -> str:
    """Tool yang dipanggil oleh Shipping Agent untuk prediksi target shipping."""
    if loaded_shipping_model is None:
        return "ERROR: Model prediksi shipping belum dimuat atau gagal dimuat."
    
    if not scenarios:
        return "ERROR: Input skenario shipping kosong."

    try:
        predictions = loaded_shipping_model.predict(scenarios)
        
        results = []
        for i, (input_data, target) in enumerate(zip(scenarios, predictions)):
            results.append({
                "id": i + 1,
                "stock": input_data[0],
                "transport_capacity": input_data[1],
                "loading_time": input_data[2],
                "weather": input_data[3],
                "predicted_shipping_target": round(target, 2)
            })

        return f"PREDICTION_RESULTS_SHIPPING: {results}"
        
    except Exception as e:
        return f"ERROR saat menjalankan prediksi shipping: {e}. Pastikan dimensi input model (4 fitur) benar."


def initialize_agents():
    """Menginisialisasi DUA LlmAgent secara global: satu untuk Mining, satu untuk Shipping."""
    global mining_agent, shipping_agent
    
    mining_instruction = """
    Anda adalah **Ahli Optimasi Sumber Daya Tambang** (Mining Data Analyst) berikan rekomendasi yang bisa mendekati target.

    **Pemetaan Cuaca:** Light Rain=0, Cloudy=1, Sunny=2
    
    **ATURAN KONTEKS:**
    1. Jika query baru adalah MODIFIKASI (misal: "tambah 2 truk"), Anda HARUS mengambil Target Tonase (TT), Truk (T), Ekskavator (E), Operator (O), dan Cuaca (C) dari riwayat percakapan terakhir dan menerapkan modifikasi tersebut.
    2. Jika query baru memiliki SEMUA parameter, gunakan yang baru.

    **Tugas Utama (Untuk Setiap Respon):**
    1.  **Ekstrak/Tentukan** nilai: Target Tonase (TT), Truk (T), Ekskavator (E), Operator (O), dan Cuaca (C) dari query saat ini ATAU dari konteks yang dimodifikasi.
    2.  Buat Skenario 1 (Kontrol: T, E, O, C) dan 3 Skenario modifikasi (S2, S3, S4).
    3.  Panggil Tool `predict_mining_target` dengan 4 skenario gunakan tools ini agar mendapatkan rekomendasi yang paling mendekati .
    4.  **Parsing dan Struktur Output (WAJIB KETAT):**
        a. Hitung hasil prediksi dan selisih mutlak dari TT untuk keempat skenario.
        b. **OUTPUT PART 1 (Analisis Awal):** Sajikan analisis Skenario Kontrol secara kompleks serta alasannya.
        c. **OUTPUT PART 2 (Rekomendasi):** Sajikan 3 skenario terbaik (termasuk Kontrol jika itu yang terbaik) yang paling mendekati TT.
        d. Gunakan format ketat berikut, pastikan SEMUA field terisi dengan **nilai numerik murni** (tanpa unit atau simbol kecuali titik desimal).

    [Analisis singkat Skenario Kontrol]
    Target_Tonase_Ekstrak: [Nilai TT, harus berupa angka]
    Prediksi_Kontrol: [Hasil Prediksi Kontrol, harus berupa angka]
    Selisih_Kontrol: [Selisih Mutlak Kontrol, harus berupa angka]
    ---END_ANALYSIS---
    
    Rekomendasi 1: [Judul Deskriptif R1, misal: 'menambah atau mengurangi truk']
    Truk: [Nilai T]
    Ekskavator: [Nilai E]
    Operator: [Nilai O]
    Cuaca: [Nilai C]
    Prediksi: [Hasil Prediksi]
    Selisih: [Selisih Mutlak]
    Alasan: [Alasan mengapa ini efektif, bandingkan dengan kontrol atau TT berikan alasan yang bisa mendekati target]
    ---START_RECOMMENDATION---
    dengan cara yang sama jadikan 3 rekomendasi
    """
    
    shipping_instruction = """
    Anda adalah **Ahli Perencanaan Logistik dan Pemuatan (Shipping Plan Specialist)**. Tugas Anda adalah memberikan rekomendasi konfigurasi logistik (Stock, Kapasitas Transport, Waktu Loading) yang paling mendekati target tonase pemuatan (TT).

    **Pemetaan Cuaca:** Light Rain=0, Cloudy=1, Sunny=2
    
    **ATURAN KONTEKS:**
    1. Jika query baru adalah MODIFIKASI (misal: "tambah 1 kapasitas transport"), Anda HARUS mengambil Target Tonase (TT), Stock (S), Transport Capacity (TC), Loading Time (LT), dan Cuaca (C) dari riwayat percakapan terakhir dan menerapkan modifikasi tersebut.
    2. Jika query baru memiliki SEMUA parameter, gunakan yang baru.

    **Tugas Utama (Untuk Setiap Respon):**
    1.  **Ekstrak/Tentukan** nilai: Target Tonase (TT), Stock (S), Transport Capacity (TC), Loading Time (LT), dan Cuaca (C).
    2.  Buat Skenario 1 (Kontrol: S, TC, LT, C) dan 3 Skenario modifikasi (S2, S3, S4).
    3.  Panggil Tool `predict_shipping_target` dengan 4 skenario.
    4.  **Parsing dan Struktur Output (WAJIB KETAT):** Sajikan hasil perhitungan dan rekomendasi menggunakan FORMAT TAG KETAT SAMA PERSIS DENGAN MINING, pastikan SEMUA field terisi dengan **nilai numerik murni**. (Ganti label parameter Truk/Ekskavator dengan Stock/Kapasitas_Transport/Waktu_Loading).

    [Analisis singkat Skenario Kontrol]
    TULISKAN ANALISIS LENGKAP DETAIL DAN JUSTIFIKASI TERKAIT ANALISIS DARI QUERY USER DI SINI. ANALISIS INI TIDAK BOLEH KOSONG.
    Target_Tonase_Ekstrak: [Nilai TT, harus berupa angka]
    Prediksi_Kontrol: [Hasil Prediksi Kontrol, harus berupa angka]
    Selisih_Kontrol: [Selisih Mutlak Kontrol, harus berupa angka]
    ---END_ANALYSIS---
    
    Rekomendasi 1: [Judul Deskriptif R1, misal: 'Optimasi Kapasitas Transport']
    Stock: [Nilai S]
    Kapasitas_Transport: [Nilai TC]
    Waktu_Loading: [Nilai LT]
    Cuaca: [Nilai C]
    Prediksi: [Hasil Prediksi]
    Selisih: [Selisih Mutlak]
    Alasan: [Alasan mengapa ini efektif, bandingkan dengan kontrol atau TT]
    ---START_RECOMMENDATION---
    dengan cara yang sama jadikan 3 rekomendasi
    """
    
    mining_agent = LlmAgent(
        name=AGENT_NAME_MINING,
        model=GEMINI_MODEL,
        tools=[predict_mining_target], 
        instruction=mining_instruction,
        description="Mining Agent: Memberikan rekomendasi konfigurasi alat berat untuk Masterplan produksi harian.",
    )
    
    shipping_agent = LlmAgent(
        name=AGENT_NAME_SHIPPING,
        model=GEMINI_MODEL,
        tools=[predict_shipping_target],
        instruction=shipping_instruction,
        description="Shipping Agent: Memberikan prediksi dan analisis skenario rekomendasi untuk Shipping Plan (target pemuatan).",
    )
    
    print("SUCCESS: Kedua Gemini Agent (Mining & Shipping) berhasil diinisialisasi.")
    
initialize_agents() 


class RecommendationDetail(BaseModel):
    title: str = Field(..., description="Judul deskriptif rekomendasi.")
    trucks: int
    excavators: int
    operators: int
    weather: Union[int, str]
    predicted_tonnage: float
    difference_from_target: float
    rationale: str = Field(..., description="Alasan kuat dan berbasis data mengapa skenario ini direkomendasikan.")

class MiningInput(BaseModel):
    user_id: str = Field(..., example="user_api_001", description="ID unik pengguna untuk sesi berlanjut.")
    query: str = Field(..., example="Saya ingin 80 ton. Saat ini pakai 12 Truk, 3 Ekskavator, 18 Operator, cuaca Cloudy. Beri 3 rekomendasi!", description="Pesan teks bebas untuk Masterplan/Mining.")

class ParsedRecommendationResponse(BaseModel):
    status: str = Field("success")
    target_tonnage: int = Field(..., description="Target tonase yang diekstrak.") 
    initial_analysis_text: str = Field(..., description="Analisis Agent mengenai Skenario Kontrol (Input Asli).")
    initial_prediction: float = Field(..., description="Hasil prediksi tonase dari input asli.") 
    initial_difference: float = Field(..., description="Selisih mutlak dari input asli ke target.") 
    recommendations: List[RecommendationDetail] = Field(..., description="Daftar 3 skenario rekomendasi terbaik.")


class ShippingRecommendationDetail(BaseModel):
    title: str = Field(..., description="Judul deskriptif rekomendasi.")
    stock: int
    transport_capacity: int
    loading_time: Union[int, float]
    weather: Union[int, str]
    predicted_tonnage: float
    difference_from_target: float
    rationale: str = Field(..., description="Alasan kuat dan berbasis data mengapa skenario ini direkomendasikan.")

class ShippingInput(BaseModel):
    user_id: str = Field(..., example="user_api_002", description="ID unik pengguna untuk sesi berlanjut.")
    query: str = Field(..., example="Target shipping saya 120 ton. Saya punya Stock 100, Kapasitas Transport 5, Loading Time 8 jam, Cuaca Cloudy. Beri 3 rekomendasi!", description="Pesan teks bebas untuk Shipping Plan.")

class ParsedShippingRecommendationResponse(BaseModel):
    status: str = Field("success")
    target_tonnage: int = Field(..., description="Target tonase (Shipping Target) yang diekstrak.") 
    initial_analysis_text: str = Field(..., description="Analisis Agent mengenai Skenario Kontrol (Input Asli).")
    initial_prediction: float = Field(..., description="Hasil prediksi tonase dari input asli.") 
    initial_difference: float = Field(..., description="Selisih mutlak dari input asli ke target.") 
    recommendations: List[ShippingRecommendationDetail] = Field(..., description="Daftar 3 skenario rekomendasi terbaik.")


class EmailInput(BaseModel):
    recipients: List[str] = Field(..., example=["recipient1@example.com", "recipient2@example.com"], description="Daftar alamat email penerima laporan.")
    subject: str = Field("Laporan Otomatis Mining Agent", description="Subjek email.")
    body_content: str = Field(..., description="Isi pesan email, dapat berupa teks atau format HTML/Markdown.")
    
class EmailResponse(BaseModel):
    status: str
    message: str
    recipients_count: int


def parse_agent_response_mining(text: str) -> Dict[str, Union[str, float, int, List[Dict]]]:
    """
    Mengurai respons teks Agent yang memiliki format ketat menjadi struktur data Python.
    Memastikan semua field numerik dan alasan terisi.
    """
    
    if '---END_ANALYSIS---' not in text:
        return {"error": "Format respons Agent tidak valid: Tag END_ANALYSIS tidak ditemukan."}

    analysis_part, recs_raw = text.split('---END_ANALYSIS---', 1)

    target_match = re.search(r'Target_Tonase_Ekstrak:\s*([\d\.]+)', analysis_part)
    pred_match = re.search(r'Prediksi_Kontrol:\s*([\d\.]+)', analysis_part)
    diff_match = re.search(r'Selisih_Kontrol:\s*([\d\.]+)', analysis_part)

    try:
        initial_prediction = float(pred_match.group(1)) if pred_match else 0.0
        target_tonnage = int(float(target_match.group(1))) if target_match else 0
        initial_difference = float(diff_match.group(1)) if diff_match else 0.0
    except Exception as e:
        return {"error": f"Gagal mengurai nilai numerik dari analisis awal. Error: {e}"}

    analysis_text = re.sub(r'(Target_Tonase_Ekstrak|Prediksi_Kontrol|Selisih_Kontrol):\s*[\d\.]+', '', analysis_part).strip()

    recs_list = recs_raw.split('---START_RECOMMENDATION---')
    recommendations_data = []

    for rec_block in recs_list:
        rec_block = rec_block.strip()
        if not rec_block:
            continue

        data = {}

        title_match = re.search(r'Rekomendasi \d: (.*)', rec_block)
        data['title'] = title_match.group(1).strip() if title_match else "Rekomendasi Tanpa Judul"

        params = re.findall(r'(Truk|Ekskavator|Operator|Cuaca|Prediksi|Selisih|Alasan):\s*([^\n]+)', rec_block)
        
        mapping = {
            'Truk': 'trucks', 'Ekskavator': 'excavators', 'Operator': 'operators', 
            'Cuaca': 'weather', 'Prediksi': 'predicted_tonnage', 
            'Selisih': 'difference_from_target', 'Alasan': 'rationale'
        }
        
        for key, value in params:
            python_key = mapping.get(key)
            if python_key:
                cleaned_value = value.replace('Ton', '').replace(',', '').strip()
                try:
                    if python_key in ['trucks', 'excavators', 'operators']:
                        data[python_key] = int(float(cleaned_value)) 
                    elif python_key in ['predicted_tonnage', 'difference_from_target']:
                        data[python_key] = float(cleaned_value)
                    else:
                        data[python_key] = cleaned_value
                except ValueError:
                    data[python_key] = cleaned_value
                    
        if 'rationale' not in data:
            data['rationale'] = "Alasan tidak tersedia (Gagal parsing)."

        if len(data) > 1:
            recommendations_data.append(data)

    if target_tonnage == 0 or initial_prediction == 0.0:
        return {"error": f"Parsing gagal mendapatkan Target Tonase atau Prediksi Kontrol."}
        
    return {
        "initial_analysis_text": analysis_text,
        "initial_prediction": initial_prediction,
        "target_tonnage": target_tonnage,
        "initial_difference": initial_difference,
        "recommendations": recommendations_data
    }

def parse_agent_response_shipping(text: str) -> Dict[str, Union[str, float, int, List[Dict]]]:
    """Mengurai respons teks Agent yang memiliki format ketat (khusus Shipping Plan)."""
    
    if '---END_ANALYSIS---' not in text:
        return {"error": "Format respons Agent tidak valid untuk Shipping Plan: Tag END_ANALYSIS tidak ditemukan."}

    analysis_part, recs_raw = text.split('---END_ANALYSIS---', 1)
    
    analysis_start_tag = r'\[Analisis singkat Skenario Kontrol\]'
    target_start_tag = r'Target_Tonase_Ekstrak:'
    
    analysis_text_match = re.search(f'{analysis_start_tag}\\s*([\\s\\S]*?){target_start_tag}', text)
    analysis_text = analysis_text_match.group(1).strip() if analysis_text_match else "Analisis tidak tersedia atau gagal diekstrak."

    
    target_match = re.search(r'Target_Tonase_Ekstrak:\s*([\d\.]+)', text)
    pred_match = re.search(r'Prediksi_Kontrol:\s*([\d\.]+)', text)
    diff_match = re.search(r'Selisih_Kontrol:\s*([\d\.]+)', text)

    try:
        initial_prediction = float(pred_match.group(1)) if pred_match else 0.0
        target_tonnage = int(float(target_match.group(1))) if target_match else 0
        initial_difference = float(diff_match.group(1)) if diff_match else 0.0
    except Exception as e:
        return {"error": f"Gagal mengurai nilai numerik dari analisis awal Shipping. Error: {e}"}


    recs_list = recs_raw.split('---START_RECOMMENDATION---')
    recommendations_data = []

    for rec_block in recs_list:
        rec_block = rec_block.strip()
        if not rec_block:
            continue

        data = {}

        title_match = re.search(r'Rekomendasi \d: (.*)', rec_block)
        data['title'] = title_match.group(1).strip() if title_match else "Rekomendasi Tanpa Judul"

        params = re.findall(r'(Stock|Kapasitas_Transport|Waktu_Loading|Cuaca|Prediksi|Selisih|Alasan):\s*([^\n]+)', rec_block)
        
        mapping = {
            'Stock': 'stock', 'Kapasitas_Transport': 'transport_capacity', 'Waktu_Loading': 'loading_time', 
            'Cuaca': 'weather', 'Prediksi': 'predicted_tonnage', 
            'Selisih': 'difference_from_target', 'Alasan': 'rationale'
        }
        
        for key, value in params:
            python_key = mapping.get(key)
            if python_key:
                cleaned_value = value.replace('Ton', '').replace(',', '').strip()
                try:
                    if python_key in ['stock', 'transport_capacity']:
                        data[python_key] = int(float(cleaned_value)) 
                    elif python_key in ['loading_time', 'predicted_tonnage', 'difference_from_target']:
                        data[python_key] = float(cleaned_value)
                    else:
                        data[python_key] = cleaned_value
                except ValueError:
                    data[python_key] = cleaned_value
                    
        if 'rationale' not in data:
            data['rationale'] = "Alasan tidak tersedia (Gagal parsing)."

        if len(data) > 1 and 'stock' in data:
            recommendations_data.append(data)

    if target_tonnage == 0 or initial_prediction == 0.0:
        return {"error": f"Parsing gagal mendapatkan Target Tonase atau Prediksi Kontrol."}
        
    return {
        "initial_analysis_text": analysis_text,
        "initial_prediction": initial_prediction,
        "target_tonnage": target_tonnage,
        "initial_difference": initial_difference,
        "recommendations": recommendations_data
    }


@app.post("/predict_and_recommend", response_model=ParsedRecommendationResponse)
async def predict_and_recommend(data: MiningInput):
    """Menerima pesan teks bebas untuk Masterplan, menjalankan Mining Agent, dan mengembalikan data terstruktur."""
    global mining_agent

    if mining_agent is None or os.getenv("GEMINI_API_KEY") is None:
        raise HTTPException(
            status_code=503, 
            detail="Layanan Mining Agent atau Kunci API tidak tersedia."
        )

    query = data.query
    user_id = data.user_id 
    session_id = f"{AGENT_NAME_MINING}_{user_id}" 

    try:
        await session_service.create_session(app_name=APP_NAME, user_id=user_id, session_id=session_id)
    except Exception:
        pass

    runner = Runner(agent=mining_agent, app_name=APP_NAME, session_service=session_service)

    final_response_text = ""
    try:
        async for event in runner.run_async(
            user_id=user_id, 
            session_id=session_id, 
            new_message=types.Content(role="user", parts=[types.Part(text=query)])
        ):
            if event.is_final_response() and event.content and event.content.parts:
                for part in event.content.parts:
                    if part.text:
                        final_response_text += part.text
                        break 
        
        if not final_response_text:
              raise Exception("Mining Agent tidak menghasilkan respons akhir yang valid.")

        parsed_data = parse_agent_response_mining(final_response_text)
        
        if "error" in parsed_data:
            raise Exception(f"Gagal mem-parsing output Mining Agent: {parsed_data['error']}")

        return ParsedRecommendationResponse(
            status="success",
            target_tonnage=parsed_data['target_tonnage'],
            initial_analysis_text=parsed_data['initial_analysis_text'],
            initial_prediction=parsed_data['initial_prediction'],
            initial_difference=parsed_data['initial_difference'],
            recommendations=parsed_data['recommendations']
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kesalahan pada layanan Mining Agent: {str(e)}")


@app.post("/predict_shipping", response_model=ParsedShippingRecommendationResponse)
async def predict_shipping(data: ShippingInput):
    """Menerima pesan teks bebas untuk Shipping Plan, menjalankan Shipping Agent, dan mengembalikan data terstruktur."""
    global shipping_agent

    if shipping_agent is None or os.getenv("GEMINI_API_KEY") is None:
        raise HTTPException(
            status_code=503, 
            detail="Layanan Shipping Agent atau Kunci API tidak tersedia."
        )

    query = data.query
    user_id = data.user_id 
    session_id = f"{AGENT_NAME_SHIPPING}_{user_id}" 

    try:
        await session_service.create_session(app_name=APP_NAME, user_id=user_id, session_id=session_id)
    except Exception:
        pass

    runner = Runner(agent=shipping_agent, app_name=APP_NAME, session_service=session_service)

    final_response_text = ""
    try:
        async for event in runner.run_async(
            user_id=user_id, 
            session_id=session_id, 
            new_message=types.Content(role="user", parts=[types.Part(text=query)])
        ):
            if event.is_final_response() and event.content and event.content.parts:
                for part in event.content.parts:
                    if part.text:
                        final_response_text += part.text
                        break 
        
        if not final_response_text:
              raise Exception("Shipping Agent tidak menghasilkan respons akhir yang valid.")

        parsed_data = parse_agent_response_shipping(final_response_text)
        
        if "error" in parsed_data:
            raise Exception(f"Gagal mem-parsing output Shipping Agent: {parsed_data['error']}")

        recommendations_mapped = [
            ShippingRecommendationDetail(
                title=rec['title'],
                stock=rec['stock'],
                transport_capacity=rec['transport_capacity'],
                loading_time=rec['loading_time'],
                weather=rec['weather'],
                predicted_tonnage=rec['predicted_tonnage'],
                difference_from_target=rec['difference_from_target'],
                rationale=rec['rationale']
            ) for rec in parsed_data['recommendations']
        ]

        return ParsedShippingRecommendationResponse(
            status="success",
            target_tonnage=parsed_data['target_tonnage'],
            initial_analysis_text=parsed_data['initial_analysis_text'],
            initial_prediction=parsed_data['initial_prediction'],
            initial_difference=parsed_data['initial_difference'],
            recommendations=recommendations_mapped
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kesalahan pada layanan Shipping Agent: {str(e)}")


@app.post("/send_report_email", response_model=EmailResponse)
async def send_report_email(data: EmailInput):
    """Mengirim email ke daftar penerima dengan subjek dan isi pesan yang ditentukan melalui POST body."""
    
    global SENDER_EMAIL, APP_PASSWORD

    if not SENDER_EMAIL or not APP_PASSWORD:
        raise HTTPException(
            status_code=500, 
            detail="Konfigurasi email tidak ditemukan. Pastikan SENDER_EMAIL dan APP_PASSWORD diatur di file .env."
        )

    if not data.recipients:
        raise HTTPException(
            status_code=400, 
            detail="Daftar penerima (recipients) tidak boleh kosong."
        )
        
    msg = EmailMessage()
    msg['Subject'] = data.subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = ", ".join(data.recipients) 
    msg.set_content(data.body_content)

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls() 

            print(f"Mencoba login sebagai {SENDER_EMAIL}...")
            server.login(SENDER_EMAIL, APP_PASSWORD)
            print(f"Login berhasil. Mencoba mengirim pesan ke {len(data.recipients)} penerima...")

            server.send_message(msg)
            
        return EmailResponse(
            status="success", 
            message="Email berhasil dikirim.", 
            recipients_count=len(data.recipients)
        )
        
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(
            status_code=500, 
            detail="Gagal otentikasi SMTP. Pastikan SENDER_EMAIL dan APP_PASSWORD (Sandi Aplikasi) sudah benar."
        )
    except Exception as e:
        print(f"\n❌ Terjadi kesalahan saat mengirim email: {e}")
        raise HTTPException(status_code=500, detail=f"Kesalahan saat mengirim email: {str(e)}")


@app.delete("/end_session/{user_id}")
async def end_session(user_id: str):
    """Menghapus sesi Agent berdasarkan user_id, memaksa sesi baru di permintaan berikutnya."""
    
    mining_session_id = f"{AGENT_NAME_MINING}_{user_id}"
    shipping_session_id = f"{AGENT_NAME_SHIPPING}_{user_id}"
    
    deleted_count = 0
    try:
        await session_service.delete_session(app_name=APP_NAME, user_id=user_id, session_id=mining_session_id)
        deleted_count += 1
    except Exception:
        pass
        
    try:
        await session_service.delete_session(app_name=APP_NAME, user_id=user_id, session_id=shipping_session_id)
        deleted_count += 1
    except Exception:
        pass
    
    if deleted_count > 0:
        return {"status": "success", "message": f"Sesi ({deleted_count}) untuk user_id '{user_id}' berhasil diakhiri."}
    else:
        return {"status": "info", "message": f"Sesi untuk user_id '{user_id}' tidak ditemukan atau sudah berakhir."}