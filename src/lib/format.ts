export const eur = (n: number | string | null | undefined) => {
  const v = typeof n === "string" ? parseFloat(n) : (n ?? 0);
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(v || 0);
};

export const nlDate = (d: string | Date | null | undefined) => {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

export const quarterOf = (d: Date) => Math.floor(d.getMonth() / 3) + 1;
