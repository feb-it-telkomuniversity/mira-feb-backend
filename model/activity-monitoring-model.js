import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function detectConflicts(payload) {
    const { room, officials, startTime, endTime, date } = payload;
    
    const start = new Date(startTime);
    const end = new Date(endTime);

    const timeFilter = {
        // Tanggal harus sama
        date: new Date(date), 
        // Logic Overlapping: (StartBaru < EndLama) && (EndBaru > StartLama)
        AND: [
            { startTime: { lt: end } },
            { endTime: { gt: start } }
        ],
        status: { not: 'Cancelled' }
    };

    // 1. Cek Konflik Ruangan
    const roomConflict = await prisma.activityMonitoring.findFirst({
        where: {
            ...timeFilter,
            room: room
        }
    });

    // 2. Cek Konflik Pejabat (Array vs Array)
    // "Cari kegiatan lain di jam yg sama, yang pejabatnya ada di list pejabat baru ini"
    let officialConflict = null;
    
    if (officials && officials.length > 0) {
        officialConflict = await prisma.activityMonitoring.findFirst({
            where: {
                ...timeFilter,
                officials: {
                    hasSome: officials 
                }
            }
        });
    }

    if (roomConflict && officialConflict) return 'DoubleConflict';
    if (roomConflict) return 'RoomConflict';
    if (officialConflict) return 'OfficialConflict';
    
    return 'Normal';
}

async function getActivityMonitoringListQuery(page = 1, limit = 10, search = "", filters = {}) {
    const skip = (page - 1) * limit;
    const andConditions = []
    
    // 1. Search (Title)
    if (search) {
        andConditions.push({
            title: { contains: search, mode: 'insensitive' }
        });
    }

    // 2. Filter Unit (Exact Match Enum)
    if (filters.unit) {
        andConditions.push({ unit: filters.unit });
    }

    // 3. Filter Status (Exact Match Enum)
    // if (filters.status) {
    //     andConditions.push({ status: filters.status });
    // }
    if (filters.status && Array.isArray(filters.status)) {
        andConditions.push({
            status: { in: filters.status } 
        })
    }

    // 4. Filter Tanggal (Opsional)
    if (filters.date) {
        // Asumsi filters.date format "YYYY-MM-DD"
        const searchDate = new Date(filters.date);
        andConditions.push({ date: searchDate });
    }

    const whereClause = andConditions.length > 0 ? { AND: andConditions } : {};

    const [data, totalCount] = await prisma.$transaction([
        prisma.activityMonitoring.findMany({
            where: whereClause,
            skip: skip,
            take: limit,
            orderBy: {
                date: 'desc',
            }
        }),
        prisma.activityMonitoring.count({ where: whereClause })
    ]);

    return {
        data,
        pagination: {
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            pageSize: limit
        }
    };
}

async function createActivityMonitoringQuery(payload) {
    
    const detectedStatus = await detectConflicts(payload)

    return await prisma.activityMonitoring.create({
        data: {
            title: payload.title,
            date: new Date(payload.date),
            startTime: new Date(payload.startTime),
            endTime: new Date(payload.endTime),
            participants: parseInt(payload.participants),
            
            unit: payload.unit,
            prodi: payload.prodi || null,
            room: payload.room,
            officials: payload.officials || [],
            
            status: detectedStatus
        }
    })
}

async function deleteActivityMonitoringQuery(activityId) {
    return await prisma.activityMonitoring.delete({
        where: {
            id: activityId
        }
    })
}

async function updateActivityMonitoringQuery(id, payload) {
    const { room, officials, startTime, endTime, date } = payload
    const start = new Date(startTime)
    const end = new Date(endTime)
    const targetDate = new Date(date)

    const timeFilter = {
        date: targetDate,
        AND: [
            { startTime: { lt: end } },
            { endTime: { gt: start } }
        ],
        status: { not: 'Cancelled' },
        id: { not: parseInt(id) } // Jangan bandingkan dengan diri sendiri
    }

    const roomConflict = await prisma.activityMonitoring.findFirst({
        where: { ...timeFilter, room: room }
    })

    let officialConflict = null
    if (officials && officials.length > 0) {
        officialConflict = await prisma.activityMonitoring.findFirst({
            where: {
                ...timeFilter,
                officials: { hasSome: officials }
            }
        })
    }

    // Tentukan Status Baru
    let newStatus = 'Normal'
    if (roomConflict && officialConflict) newStatus = 'DoubleConflict'
    else if (roomConflict) newStatus = 'RoomConflict'
    else if (officialConflict) newStatus = 'OfficialConflict'

    return await prisma.activityMonitoring.update({
        where: { id: parseInt(id) },
        data: {
            title: payload.title,
            date: targetDate,
            startTime: start,
            endTime: end,
            participants: parseInt(payload.participants),
            description: payload.description,
            unit: payload.unit,
            prodi: payload.prodi || null,
            room: payload.room,
            officials: payload.officials || [],
            status: newStatus
        }
    })
}

export { getActivityMonitoringListQuery, createActivityMonitoringQuery, deleteActivityMonitoringQuery, updateActivityMonitoringQuery }