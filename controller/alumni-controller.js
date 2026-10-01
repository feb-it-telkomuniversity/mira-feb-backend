export const getAlumniList = async (req, res) => {
    try {
        const { page = 1, limit = 20, prodi } = req.query;

        // Build query string
        let queryString = `?page=${page}&limit=${limit}`;
        if (prodi) {
            queryString += `&prodi=${encodeURIComponent(prodi)}`;
        }

        const response = await fetch(`https://sigap.telkomuniversity.ac.id/api/alumni${queryString}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'sigap_sec_key_9f8d7c6b5a4e3d2c1b0a',
                'Authorization': 'Bearer sigap_sec_key_9f8d7c6b5a4e3d2c1b0a'
            }
        });

        if (!response.ok) {
            throw new Error(`SIGAP API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching alumni data from SIGAP:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch alumni data from SIGAP",
            error: error.message
        });
    }
};
