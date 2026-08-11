const GATEWAY_BASE_URL = "https://gateway.telkomuniversity.ac.id";

// SECURITY: Token HARUS diatur via environment variable AACSB_GATEWAY_TOKEN di .env
// Jangan pernah hardcode token di source code.
const DEFAULT_GATEWAY_TOKEN = process.env.AACSB_GATEWAY_TOKEN;

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
        message: "Gagal autentikasi ke Gateway AACSB Telkom University. Periksa username/password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan token autentikasi Gateway AACSB",
      data,
    });
  } catch (error) {
    console.error("Error in issueAuth AACSB:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat menghubungi Gateway AACSB.",
      // SECURITY: Jangan expose error.message ke client di production
    });
  }
}

/**
 * GET /api/aacsb/dosen/profile?lecture_code=xxx
 * Get Lecturer Profile Data from Telkom University Gateway
 * Role: super_admin, admin, dekanat, wadek, kaur, kaprodi (canEditData)
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

    // SECURITY: Hanya izinkan karakter alfanumerik pada lecture_code untuk mencegah injection
    if (!/^[a-zA-Z0-9_-]{1,20}$/.test(lectureCode)) {
      return res.status(400).json({
        success: false,
        message: "Format lecture_code tidak valid. Hanya huruf dan angka diperbolehkan.",
      });
    }

    // SECURITY: Gunakan token dari env var saja — TIDAK dari request header yang bisa dimanipulasi client
    const bearerToken = DEFAULT_GATEWAY_TOKEN;
    if (!bearerToken) {
      return res.status(503).json({
        success: false,
        message: "AACSB Gateway token belum dikonfigurasi. Hubungi administrator sistem.",
      });
    }

    const endpointUrl = `${GATEWAY_BASE_URL}/b4eba405e82fdb9ef0d15f767fda2afe?lecture_code=${encodeURIComponent(lectureCode)}`;

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
      message: `Berhasil mengambil data profile dosen (${lectureCode})`,
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
 * Get Lecturer Tridarma Data from Telkom University Gateway
 * Role: super_admin, admin, dekanat, wadek, kaur, kaprodi (canEditData)
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

    // SECURITY: Hanya izinkan karakter alfanumerik pada lecture_code untuk mencegah injection
    if (!/^[a-zA-Z0-9_-]{1,20}$/.test(lectureCode)) {
      return res.status(400).json({
        success: false,
        message: "Format lecture_code tidak valid. Hanya huruf dan angka diperbolehkan.",
      });
    }

    // SECURITY: Gunakan token dari env var saja
    const bearerToken = DEFAULT_GATEWAY_TOKEN;
    if (!bearerToken) {
      return res.status(503).json({
        success: false,
        message: "AACSB Gateway token belum dikonfigurasi. Hubungi administrator sistem.",
      });
    }

    const endpointUrl = `${GATEWAY_BASE_URL}/f3a8003ca78d9a479ef9e1d9554ae8a5/?lecture_code=${encodeURIComponent(lectureCode)}`;

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
      message: `Berhasil mengambil data tridarma dosen (${lectureCode})`,
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
