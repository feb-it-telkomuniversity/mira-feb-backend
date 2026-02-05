import { Prisma } from "@prisma/client";

export const calculateKM = (data) => {
  const { 
      weight,      // Bobot (AD)
      target,      // Target (AE) - Bisa String "RKA"
      realization, // Realisasi (AF)
      min,         // Min (AI)
      max          // Max (AH)
  } = data;

  let achievement = 0;
  
  const cleanTarget = String(target).replace(',', '.');
  const targetNum = parseFloat(cleanTarget);
  const realNum = parseFloat(realization);

  if (isNaN(targetNum) || targetNum === 0 || realNum === null || isNaN(realNum)) {
      achievement = 0;
  } else {
      achievement = (realNum / targetNum) * 100;
  }

  // --- 2. Hitung PERS REAL (Capped Achievement/AJ) ---
  // Rumus: =IF(AG<=Min; Min; IF(AG>=Max; Max; AG))
  let persReal = achievement;
  const minNum = min !== undefined && min !== null ? parseFloat(min) : 80
  const maxNum = max !== undefined && max !== null ? parseFloat(max) : 120

  if (achievement <= minNum) {
      persReal = minNum; // Ambil batas bawah
  } else if (achievement >= maxNum) {
      persReal = maxNum; // Ambil batas atas
  } else {
      persReal = achievement; // Ambil nilai asli
  }

  // --- 3. Hitung NILAI (Score/AK) ---
  // Rumus: =(Bobot * PersReal) / 100
  const weightNum = parseFloat(weight) || 0;
  const score = (weightNum * persReal) / 100;

  // Return Object untuk disimpan ke Database
  return {
      achievement: parseFloat(achievement.toFixed(2)),           // Kolom AG
      persReal: parseFloat(persReal.toFixed(2)),    // Kolom AJ (Pers Real)
      value: parseFloat(score.toFixed(2))                        // Kolom AK (Nilai)
  };
};