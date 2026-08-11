export const calculateKM = (data) => {
    const {
        responsibility,
        weight,      // Bobot (AD)
        target,      // Target (AE)
        realization, // Realisasi (AF)
        min,         // Min (AI)
        max          // Max (AH)
    } = data;

    let achievement = 0;

    const cleanTarget = String(target).replace(',', '.');
    const targetNum = parseFloat(cleanTarget);
    const realNum = parseFloat(realization);

    const minimizeMetrics = [
        "operating ratio fakultas",
        "do dan undur diri (turn over) mahasiswa angkatan habis masa studi"
    ];

    const isPenurunanKM = responsibility && responsibility.toLowerCase().includes("penurunan kontrak manajemen");
    const maxNumForCheck = max !== undefined && max !== null ? parseFloat(max) : 120;
    const isSmallerBetter = responsibility && minimizeMetrics.some(metric =>
        responsibility.toLowerCase().trim().includes(metric)
    );

    if (isNaN(targetNum) || targetNum === 0 || realNum === null || isNaN(realNum)) {
        achievement = 0;
    } else {
        if (isPenurunanKM && realNum >= targetNum) {
            achievement = maxNumForCheck;
        } else if (isSmallerBetter) {
            // Indikator yang masuk daftar tetap dibalik
            achievement = (targetNum / realNum) * 100;
        } else {
            // Operating Ratio & Cash Collection Telkom University sekarang lari ke sini
            achievement = (realNum / targetNum) * 100;
        }
    }

    // --- 2. Hitung PERS REAL (Capped Achievement) ---
    let persReal = achievement;
    const minNum = min !== undefined && min !== null ? parseFloat(min) : 80;
    const maxNum = max !== undefined && max !== null ? parseFloat(max) : 120;

    if (isNaN(targetNum) || targetNum === 0 || realNum === null || isNaN(realNum)) {
        persReal = 0;
    } else {
        if (achievement <= minNum) {
            persReal = minNum;
        } else if (achievement >= maxNum) {
            persReal = maxNum;
        } else {
            persReal = achievement;
        }
    }

    // --- 3. Hitung NILAI (Score) ---
    const weightNum = parseFloat(weight) || 0;
    const score = (weightNum * persReal) / 100;

    return {
        achievement: parseFloat(achievement.toFixed(2)),
        persReal: parseFloat(persReal.toFixed(2)),
        value: parseFloat(score.toFixed(2))
    };
};