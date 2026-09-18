import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Specialized model for structured JSON document extraction
const extractionModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1
    }
});

async function generateResponse(prompt) {
    try {
        const result = await model.generateContent(prompt)
        return result.response.text()
    } catch (error) {
        console.error("Error dari Gemini Service:", error)
        return "Maaf, sistem AI sedang mengalami gangguan."
    }
}

/**
 * Ekstraksi metadata naskah dinas / surat masuk resmi Indonesia
 * Mengembalikan objek JSON: { nomorSuratAsal, instansiPengirim, tanggalSurat, perihal, ringkasan, kerahasiaan }
 */
async function extractSuratMasukMetadata(fileBuffer, mimeType) {
    try {
        const base64Data = fileBuffer.toString("base64");

        const prompt = `Anda adalah asisten arsiparis profesional spesialis administrasi tata naskah dinas resmi di Indonesia.
Analisis dokumen surat yang terlampir ini dengan sangat teliti dan ekstrak informasinya ke dalam format JSON dengan skema berikut:

{
  "nomorSuratAsal": "string nomor surat resmi lengkap persis sesuai di naskah (contoh: B/628/IKMA.3/IND/IX/2026 atau 002.1/DPK/FEB/2026), jika tidak ditemukan tulis string kosong",
  "instansiPengirim": "string nama instansi/organisasi/lembaga pengirim surat berdasarkan kop surat atau tanda tangan pengirim (contoh: Kementerian Perindustrian RI atau LLDIKTI Wilayah IV)",
  "tanggalSurat": "string tanggal pembuatan surat yang tercantum di surat dalam format YYYY-MM-DD. Jika tanggal hanya mencantumkan bulan dan tahun atau format lokal seperti '15 September 2026', konversikan dengan benar ke format YYYY-MM-DD",
  "perihal": "string perihal atau hal atau subjek resmi surat",
  "ringkasan": "string ringkasan 1-3 kalimat padat dan jelas mengenai inti isi surat, tujuan, atau instruksi/undangan di dalamnya untuk memudahkan pembacaan disposisi",
  "kerahasiaan": "Normal | Confidential | Urgent | Restricted (Pilih 'Confidential' jika terdapat tanda Rahasia, 'Urgent' jika terdapat tanda Segera/Amat Segera/Penting, 'Restricted' jika Terbatas, atau default 'Normal')"
}

PENTING:
1. Format tanggalSurat WAJIB dalam format YYYY-MM-DD (contoh: 2026-09-15). Jika tanggal tidak terdeteksi, kosongkan ("").
2. Jika suatu informasi tidak dapat ditemukan, berikan nilai string kosong ("") atau nilai default yang paling masuk akal.
3. Hasilkan HANYA objek JSON valid sesuai skema di atas tanpa teks pembuka/penutup.`;

        const result = await extractionModel.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            },
            prompt
        ]);

        const rawJsonText = result.response.text();
        const parsed = JSON.parse(rawJsonText);
        return parsed;
    } catch (error) {
        console.error("Error saat ekstraksi surat masuk dengan Gemini:", error);
        throw error;
    }
}

export { generateResponse, extractSuratMasukMetadata }
