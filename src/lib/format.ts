export function formatPrice(paise: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency, maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100);
}
