export function formatCurrency(amount: number){
    return new Intl.NumberFormat("es-ES",{
        style: "currency",
        currency: "EUR"
    }).format(amount)
}
export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(date))
}