import { getStaffsListQuery } from "../model/staff-model.js";

async function getStaffsList(req, res) {
    try {
        const search = req.query.search || "";
        const result = await getStaffsListQuery(search);

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil data TPA",
            data: result.data,
        });

    } catch (error) {
        console.error("Error fetching staffs:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
}

export { getStaffsList };