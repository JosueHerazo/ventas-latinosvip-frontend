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

export function formatFullDate(dateStr: string | Date | null | undefined) {
    if (!dateStr) return "Sin fecha";

    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) return "Fecha inválida";

    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long', // "viernes"
        day: '2-digit',  // "12"
        month: 'long',   // "diciembre"
        // year: 'numeric', // Opcional: quítalo si no quieres el año
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}