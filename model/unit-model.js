import prisma from "../utils/prisma.js";

export const createUnitQuery = async (data) => {
    return await prisma.unit.create({
        data: {
            name: data.name,
            category: data.category,
        }
    });
};

export const getUnitsQuery = async (search = "", category = "") => {
    const filters = {};

    if (search) {
        filters.name = {
            contains: search,
            mode: "insensitive"
        };
    }

    if (category) {
        filters.category = category;
    }

    return await prisma.unit.findMany({
        where: filters,
        select: {
            id: true,
            name: true,
            category: true,
        },
        orderBy: {
            name: 'asc'
        }
    });
};

export const updateUnitQuery = async (id, data) => {
    const existingUnit = await prisma.unit.findUnique({
        where: { id: parseInt(id) }
    });

    if (!existingUnit) {
        throw new Error("RecordNotFound");
    }

    return await prisma.unit.update({
        where: { id: parseInt(id) },
        data: {
            name: data.name !== undefined ? data.name : existingUnit.name,
            category: data.category !== undefined ? data.category : existingUnit.category
        }
    });
};

export const deleteUnitQuery = async (id) => {
    const parsedId = parseInt(id);
    const existingUnit = await prisma.unit.findUnique({
        where: { id: parsedId },
        include: {
            _count: {
                select: { users: true, assignments: true }
            }
        }
    });

    if (!existingUnit) {
        throw new Error("RecordNotFound");
    }

    // Hindari error Prisma P2003 (Foreign Key Constraint) dengan validasi manual
    if (existingUnit._count.users > 0 || existingUnit._count.assignments > 0) {
        throw new Error("ForeignKeyConstraint");
    }

    return await prisma.unit.delete({
        where: { id: parsedId }
    });
};
