import { Prisma } from "@prisma/client";

export function calculateKM({
  weight,
  target,
  realization,
  min,
  max,
}) {
  if (!target || !realization) {
    return {
      achievement: null,
      persReal: null,
      value: null,
    };
  }

  const achievement =
    Number(realization) === 0
      ? 0
      : (Number(realization) / Number(target)) * 100;

  let persReal = achievement;

  if (min !== null && achievement < min) persReal = min;
  if (max !== null && achievement > max) persReal = max;

  const value =
    weight && persReal
      ? (Number(weight) * Number(persReal)) / 100
      : null;

  return {
    achievement: new Prisma.Decimal(achievement.toFixed(2)),
    persReal: Math.round(persReal),
    value: value ? new Prisma.Decimal(value.toFixed(2)) : null,
  };
}
