import { createRtmMeetingQuery, getAllRtmQuery, getRtmByIdQuery } from "../model/rtm-model.js";

async function getAllRtm(req, res) {
    try {
        const data = await getAllRtmQuery();

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil daftar kegiatan rapat",
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data rapat",
            error: error.message
        })
    }
}

async function getRtmById(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID rapat wajib disertakan"
            })
        }

        const data = await getRtmByIdQuery(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Data dokumen rapat tidak ditemukan"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail rapat",
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil detail rapat",
            error: error.message
        })
    }
}

async function createRtmMeeting(req, res) {
    try {
        const {
            // Section 1 & 2: Input Rapat
            sotk, pic, meetingDate, name, participants, materials,
            // Section 3: Header Risalah
            documentDate, location, agenda,
            // Section 4: Signatures
            preparedByName, preparedByPosition,
            reviewedByName, reviewedByPosition,
            approvedByName, approvedByPosition,
            signatureLocation, signatureDate,
            // Section 5: Tabel Pembahasan (Array of Objects)
            discussions
        } = req.body

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Nama RTM wajib diisi"
            });
        }

        const payload = {
            sotk: sotk || null,
            pic: pic || null,
            meetingDate: meetingDate ? new Date(meetingDate) : null,
            name,
            participants: participants || null,
            materials: Array.isArray(materials) ? materials : [],

            documentDate: documentDate ? new Date(documentDate) : null,
            location: location || null,
            agenda: agenda || null,

            preparedByName: preparedByName || null,
            preparedByPosition: preparedByPosition || null,
            reviewedByName: reviewedByName || null,
            reviewedByPosition: reviewedByPosition || null,
            approvedByName: approvedByName || null,
            approvedByPosition: approvedByPosition || null,
            signatureLocation: signatureLocation || null,
            signatureDate: signatureDate ? new Date(signatureDate) : null,
        }
        if (Array.isArray(discussions) && discussions.length > 0) {
            payload.discussions = {
                create: discussions.map(item => ({
                    topic: item.topic || null,
                    problem: item.problem || null,
                    actionPlan: item.actionPlan || null,
                    outcome: item.outcome || null,
                    pic: item.pic || null,
                    target: item.target || null,
                    status: item.status || null
                }))
            };
        }
        const newRtm = await createRtmMeetingQuery(payload)

        return res.status(201).json({
            success: true,
            message: "Risalah Rapat Tinjauan Manajemen berhasil disimpan dengan utuh",
            data: newRtm
        })

    } catch (error) {
        console.error("Error creating RTM Meeting:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal menyimpan kegiatan rapat",
            error: error.message
        })
    }
}

export {
    getAllRtm,
    getRtmById,
    createRtmMeeting,
}