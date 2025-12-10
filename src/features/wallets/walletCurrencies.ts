export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "UAH",
  "CHY",
  "CHF",
] as const;

export type Currency = (typeof CURRENCIES)[number];
