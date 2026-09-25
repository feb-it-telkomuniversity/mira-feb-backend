async function getLecturersList(req, res) {
    try {
        const search = req.query.search || "";
        
        // Fetch from SIGAP API
        const response = await fetch("https://sigap.telkomuniversity.ac.id/api/dosen?limit=500", {
            headers: {
                "Authorization": "Bearer sigap_sec_key_9f8d7c6b5a4e3d2c1b0a"
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const jsonResponse = await response.json();
        let apiData = jsonResponse.data || [];

        // Map data to match frontend expectations
        let mappedData = apiData.map(item => {
            let education = "Lainnya";
            const front = item.gelar_depan ? item.gelar_depan.toLowerCase() : "";
            const back = item.gelar_belakang ? item.gelar_belakang.toLowerCase() : "";
            
            if (front.includes("dr.") || front.includes("prof.") || back.includes("ph.d") || back.includes("phd")) {
                education = "S3";
            } else if (back.includes("m.") || back.includes("mt") || back.includes("msi")) {
                education = "S2";
            } else if (back.includes("s.")) {
                education = "S1";
            }

            return {
                nip: item.nip,
                frontTitle: item.gelar_depan,
                name: item.nama,
                backTitle: item.gelar_belakang,
                prodi: item.program_studi,
                lecturerCode: item.kode_dosen,
                education: education,
                email: item.email,
                nuptk: "" // not available from API
            };
        });

        // Filter by search if provided
        if (search) {
            const s = search.toLowerCase();
            mappedData = mappedData.filter(d => 
                (d.name && d.name.toLowerCase().includes(s)) ||
                (d.nip && d.nip.includes(s)) ||
                (d.lecturerCode && d.lecturerCode.toLowerCase().includes(s))
            );
        }

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil data dosen dari API SIGAP",
            data: mappedData
        });
    } catch (error) {
        console.error("Error fetching lecturers from API:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
}

export { getLecturersList }