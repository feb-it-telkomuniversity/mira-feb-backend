import prisma from '../utils/prisma.js';

const instruksiLabels = {
    TindakLanjuti: 'Tindak Lanjuti & Laporkan',
    Pelajari: 'Pelajari & Beri Saran',
    Hadiri: 'Hadiri / Wakili',
    Simpan: 'Simpan / Arsipkan',
    DraftBalasan: 'Draft Balasan'
};

export const getRecentNotifications = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const [recentActivities, recentDispositions] = await Promise.all([
            prisma.activityMonitoring.findMany({
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            role: true,
                            avatarUrl: true,
                        },
                    },
                },
            }),
            prisma.disposisiSurat.findMany({
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    suratMasuk: {
                        select: {
                            id: true,
                            nomorSuratAsal: true,
                            instansiPengirim: true,
                            perihal: true,
                            linkPdf: true,
                            kerahasiaan: true,
                        },
                    },
                    pemberi: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                            avatarUrl: true,
                        },
                    },
                    penerimaUnit: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })
        ]);

        const mappedActivities = recentActivities.map((act) => {
            const hasConflict = act.status && act.status !== 'Normal';
            const creatorName = act.user?.name || 'Sistem';

            return {
                id: `act-${act.id}`,
                activityId: act.id,
                type: 'activity',
                title: act.title,
                message: `Agenda baru diinput oleh ${creatorName}`,
                creator: act.user || null,
                room: act.room,
                unit: act.unit,
                date: act.date,
                hasConflict: hasConflict,
                status: act.status,
                createdAt: act.createdAt,
                link: '/dashboard/monitoring-kegiatan',
            };
        });

        const mappedDispositions = recentDispositions.map((disp) => {
            const instruksiText = instruksiLabels[disp.instruksi] || disp.instruksi;
            const pemberiName = disp.pemberi?.name || 'Pimpinan';
            const unitName = disp.penerimaUnit?.name || 'Unit Kerja';

            return {
                id: `disp-${disp.id}`,
                disposisiId: disp.id,
                type: 'disposition',
                title: `Disposisi: ${disp.suratMasuk?.perihal || 'Surat Masuk'}`,
                message: `${pemberiName} menugaskan "${instruksiText}" kepada ${unitName}`,
                pemberi: disp.pemberi || null,
                unitName: unitName,
                deadline: disp.batasWaktu,
                kerahasiaan: disp.suratMasuk?.kerahasiaan || 'Normal',
                status: disp.status,
                createdAt: disp.createdAt,
                link: '/dashboard/surat-menyurat?tab=disposition',
            };
        });

        // Gabungkan dan urutkan berdasarkan tanggal dibuat terbaru
        const combined = [...mappedActivities, ...mappedDispositions]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);

        return res.status(200).json({
            success: true,
            data: combined,
            total: combined.length,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil notifikasi',
            data: [],
        });
    }
};
