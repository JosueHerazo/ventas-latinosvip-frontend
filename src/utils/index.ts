import type { Service } from "../types";

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

export const getFidelityStats = (allServices: Service[], currentPhone: string) => {
  // Filtramos todos los servicios PAGADOS de este cliente
  const history = allServices.filter(s => 
    s.phone === currentPhone && 
    (s.isPaid === true || s.isPaid === 1) &&
    s.service !== "CLIENTE_REGISTRADO"
  );
  
  const count = history.length;
  return {
    count,
    isGiftNext: count > 0 && count % 10 === 0, // Si ya tiene 10, 20, 30... el que sigue es gratis
    progress: count % 10
  };
};

// Función lógica para calcular el beneficio
export const obtenerEstadoFidelidad = (services: Service[], clientPhone: string) => {
    // 1. Filtramos servicios pagados de este cliente (excluyendo registros de sistema)
    const serviciosCliente = services.filter(s => 
        s.phone === clientPhone && 
        (s.isPaid === true || s.isPaid === 1) &&
        s.service !== "CLIENTE_REGISTRADO"
    );

    const totalServicios = serviciosCliente.length;
    const serviciosParaRegalo = 10;
    
    // El servicio número 11 es el gratis
    const esGratis = totalServicios > 0 && totalServicios % serviciosParaRegalo === 0;
    const faltantes = serviciosParaRegalo - (totalServicios % serviciosParaRegalo);

    return {
        total: totalServicios,
        esGratis,
        faltantes: esGratis ? 0 : faltantes
    };
};