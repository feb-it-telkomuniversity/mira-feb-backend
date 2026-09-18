import prisma from "../utils/prisma.js";

const GATEWAY_BASE_URL = "https://gateway.telkomuniversity.ac.id";

// In-memory token storage agar token langsung aktif otomatis tanpa edit .env manual
let activeGatewayToken = process.env.AACSB_GATEWAY_TOKEN || "";

/**
 * POST /api/aacsb/auth
 * Issue Bearer Token from Gateway Telkom University
 * Role: super_admin, admin, dekanat, wadek, kaur, kaprodi (canEditData)
 */
export async function issueAuth(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi untuk autentikasi Gateway.",
      });
    }

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${GATEWAY_BASE_URL}/issueauth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message:
          "Gagal autentikasi ke Gateway AACSB Telkom University. Periksa username/password.",
      });
    }

    // Otomatis perbarui token aktif di memori server
    const newToken = data?.token || data?.access_token;
    if (newToken) {
      activeGatewayToken = newToken;
    }

    return res.status(200).json({
      success: true,
      message:
        "Berhasil mendapatkan & mengaktifkan token Gateway AACSB secara otomatis di server MIRA.",
      data,
    });
  } catch (error) {
    console.error("Error in issueAuth AACSB:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat menghubungi Gateway AACSB.",
    });
  }
}

/**
 * GET /api/aacsb/dosen/profile?lecture_code=xxx
 * Get Lecturer Profile Data from Local Database or Telkom University Gateway
 */
export async function getProfileDosen(req, res) {
  try {
    const lectureCode = req.query.lecture_code || req.query.lectureCode || "";

    if (!lectureCode) {
      return res.status(400).json({
        success: false,
        message: "Parameter lecture_code (kode dosen) wajib diisi.",
      });
    }

    const normalizedCode = lectureCode.trim().toUpperCase();

    // 1. Cek dulu di Database Lokal
    const dbProfile = await prisma.lectureProfile.findUnique({
      where: { lecturerCode: normalizedCode },
    });

    if (dbProfile) {
      return res.status(200).json({
        success: true,
        message: `Berhasil mengambil data profile dosen (${normalizedCode}) dari database`,
        data: {
          "nip / nidn": dbProfile.nipNidn,
          nama: dbProfile.nama,
          lecturercode: dbProfile.lecturerCode,
          homebase: dbProfile.homebase,
          "kelompok keahlian": dbProfile.kelompokKeahlian,
          employeestatus: dbProfile.employeeStatus,
          academicfuncposition: dbProfile.academicFuncPosition,
          lastacademictitle: dbProfile.lastAcademicTitle,
          institutionname: dbProfile.institutionName,
          tahun: dbProfile.tahun,
        },
      });
    }

    // 2. Fallback ke Gateway API
    const bearerToken = activeGatewayToken || process.env.AACSB_GATEWAY_TOKEN;
    if (!bearerToken) {
      return res.status(404).json({
        success: false,
        message: `Data profile dosen dengan kode '${normalizedCode}' tidak ditemukan di database.`,
      });
    }

    const endpointUrl = `${GATEWAY_BASE_URL}/b4eba405e82fdb9ef0d15f767fda2afe?lecture_code=${encodeURIComponent(normalizedCode)}`;

    const response = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: "application/json",
      },
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Gagal mengambil data profile dosen dari Gateway AACSB",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Berhasil mengambil data profile dosen (${normalizedCode})`,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching Profile Dosen AACSB:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data profile dosen.",
    });
  }
}

/**
 * GET /api/aacsb/dosen/tridarma?lecture_code=xxx
 * Get Lecturer Tridarma Data from Local Database or Telkom University Gateway
 */
export async function getTridarmaDosen(req, res) {
  try {
    const lectureCode = req.query.lecture_code || req.query.lectureCode || "";

    if (!lectureCode) {
      return res.status(400).json({
        success: false,
        message: "Parameter lecture_code (kode dosen) wajib diisi.",
      });
    }

    const normalizedCode = lectureCode.trim().toUpperCase();

    // 1. Cek dulu di Database Lokal
    const dbTridharma = await prisma.lectureTridharma.findUnique({
      where: { lecturerCode: normalizedCode },
    });

    if (dbTridharma) {
      return res.status(200).json({
        success: true,
        message: `Berhasil mengambil data tridarma dosen (${normalizedCode}) dari database`,
        data: {
          lecturercode: dbTridharma.lecturerCode,
          studyprogramtype: dbTridharma.studyProgramType,
          total_bimbingan: dbTridharma.totalBimbingan,
          list_mata_kuliah: dbTridharma.listMataKuliah || [],
        },
      });
    }

    // 2. Fallback ke Gateway API
    const bearerToken = activeGatewayToken || process.env.AACSB_GATEWAY_TOKEN;
    if (!bearerToken) {
      return res.status(404).json({
        success: false,
        message: `Data tridarma dosen dengan kode '${normalizedCode}' tidak ditemukan di database.`,
      });
    }

    const endpointUrl = `${GATEWAY_BASE_URL}/f3a8003ca78d9a479ef9e1d9554ae8a5/?lecture_code=${encodeURIComponent(normalizedCode)}`;

    const response = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: "application/json",
      },
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Gagal mengambil data tridarma dosen dari Gateway AACSB",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Berhasil mengambil data tridarma dosen (${normalizedCode})`,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching Tridarma Dosen AACSB:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data tridarma dosen.",
    });
  }
}
