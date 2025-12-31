import { getLecturersListQuery } from "../model/lecturer-model.js";

async function getLecturersList(req, res) {
    try {
        const search = req.query.search || "";
        const result = await getLecturersListQuery(search);

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil data dosen",
            data: result.data
        });
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
}

export { getLecturersList }