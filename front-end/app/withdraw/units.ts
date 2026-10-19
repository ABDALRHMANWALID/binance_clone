const DECIMALS = 18;

export function toUnits(value: string): bigint {
  let text = value.trim();

  if (!/^\d+(\.\d+)?$/.test(text)) text = Number(text).toFixed(DECIMALS);

  const [whole, fraction = ""] = text.split(".");
  return BigInt(whole + fraction.slice(0, DECIMALS).padEnd(DECIMALS, "0"));
}

export function fromUnits(units: bigint): string {
  const digits = units.toString().padStart(DECIMALS + 1, "0");
  const whole = digits.slice(0, -DECIMALS);
  const fraction = digits.slice(-DECIMALS).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

export function shortEth(value: string): string {
  const [whole, fraction = ""] = fromUnits(toUnits(value)).split(".");
  const cut = fraction.slice(0, 8).replace(/0+$/, "");
  return cut ? `${whole}.${cut}` : whole;
}

export const minUnits = (...values: bigint[]) =>
  values.reduce((a, b) => (b < a ? b : a));
