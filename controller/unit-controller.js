import { createUnitQuery, getUnitsQuery, updateUnitQuery, deleteUnitQuery } from "../model/unit-model.js";

export const createUnit = async (req, res) => {
    try {
        const { name, category } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: "Name and category are required."
            });
        }

        const newUnit = await createUnitQuery({ name, category });

        return res.status(201).json({
            success: true,
            message: "Unit created successfully",
            data: newUnit
        });
    } catch (error) {
        console.error("Error creating unit:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getUnits = async (req, res) => {
    try {
        const { search, category } = req.query;

        const units = await getUnitsQuery(search, category);

        return res.status(200).json({
            success: true,
            message: "Units fetched successfully",
            data: units
        });
    } catch (error) {
        console.error("Error fetching units:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category } = req.body;

        if (!name && !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide name or category to update."
            });
        }

        const updatedUnit = await updateUnitQuery(id, { name, category });

        return res.status(200).json({
            success: true,
            message: "Unit updated successfully",
            data: updatedUnit
        });
    } catch (error) {
        if (error.message === "RecordNotFound") {
            return res.status(404).json({
                success: false,
                message: "Unit not found"
            });
        }
        console.error("Error updating unit:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;

        await deleteUnitQuery(id);

        return res.status(200).json({
            success: true,
            message: "Unit deleted successfully"
        });
    } catch (error) {
        if (error.message === "RecordNotFound") {
            return res.status(404).json({
                success: false,
                message: "Unit not found"
            });
        }
        if (error.message === "ForeignKeyConstraint") {
            return res.status(400).json({
                success: false,
                message: "Cannot delete unit because it is still assigned to users or contracts."
            });
        }
        console.error("Error deleting unit:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
