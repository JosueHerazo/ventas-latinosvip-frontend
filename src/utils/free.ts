import type { Service } from "../types";


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