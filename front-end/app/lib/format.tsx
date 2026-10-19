export function formatUnits6(raw: string): string {
  const n = BigInt(raw);
  const whole = n / 1_000_000n;
  const frac = (n % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, "");
  return frac
    ? `${whole.toLocaleString("en-US")}.${frac}`
    : whole.toLocaleString("en-US");
}

export function trimDecimals(value: string): string {
  return value.includes(".") ? value.replace(/\.?0+$/, "") : value;
}

export function rawToInput(raw: string): string {
  return formatUnits6(raw).replace(/,/g, "");
}
