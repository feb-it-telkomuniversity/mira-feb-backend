export const calculateKM = (data) => {
    const {
        responsibility,
        weight,      // Bobot (AD)
        target,      // Target (AE) - Bisa String "RKA"
        realization, // Realisasi (AF)
        min,         // Min (AI)
        max          // Max (AH)
    } = data;

    let achievement = 0;

    const cleanTarget = String(target).replace(',', '.');
    const targetNum = parseFloat(cleanTarget);
    const realNum = parseFloat(realization)

    const minimizeMetrics = [
        "operating ratio fakultas",
        "operating ratio & cash collection telkom university (common indikator)",
        "do dan undur diri (turn over) mahasiswa angkatan habis masa studi"
    ]

    const isSmallerBetter = responsibility && minimizeMetrics.some(metric =>
        responsibility.toLowerCase().trim().includes(metric)
    )

    if (isNaN(targetNum) || targetNum === 0 || realNum === null || isNaN(realNum)) {
        achievement = 0;
    } else {
        if (isSmallerBetter) {
            // RUMUS DIBALIK (Khusus 3 indikator di atas)
            achievement = (targetNum / realNum) * 100;
        } else {
            // RUMUS NORMAL (Realisasi / Target * 100)
            achievement = (realNum / targetNum) * 100;
        }
    }

    // --- 2. Hitung PERS REAL (Capped Achievement/AJ) ---
    // Rumus: =IF(AG<=Min; Min; IF(AG>=Max; Max; AG))
    let persReal = achievement;
    const minNum = min !== undefined && min !== null ? parseFloat(min) : 80;
    const maxNum = max !== undefined && max !== null ? parseFloat(max) : 120;

    if (achievement <= minNum) {
        persReal = minNum;
    } else if (achievement >= maxNum) {
        persReal = maxNum;
    } else {
        persReal = achievement;
    }
    // --- 3. Hitung NILAI (Score/AK) ---
    // Rumus: =(Bobot * PersReal) / 100
    const weightNum = parseFloat(weight) || 0;
    const score = (weightNum * persReal) / 100;

    return {
        achievement: parseFloat(achievement.toFixed(2)),
        persReal: parseFloat(persReal.toFixed(2)),
        value: parseFloat(score.toFixed(2))
    };
};