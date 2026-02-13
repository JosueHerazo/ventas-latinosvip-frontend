import { safeParse } from "valibot"
import axios from "axios"
import { DatesSchema, type DateList } from "../types";



export async function getDatesList() {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/date`;
        const { data } = await axios.get(url);
        const result = safeParse(DatesSchema, data.data)
        return result.success ? result.output : (data.data as DateList[]);
    } catch (error) {
        console.error("Error al obtener citas:", error);
        return [];
    }
}

export async function deleteDate(id: number) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/date/${id}`;
        await axios.delete(url);
    } catch (error) {
        console.error("Error al eliminar cita:", error);
    }
}
export async function updateDate(id: number, data: any) { // <-- Agregamos 'data'
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/date/${id}`;
        // Usamos PUT porque estamos enviando el objeto completo para actualizar
        await axios.put(url, data); 
    } catch (error) {
        console.error("Error al actualizar la cita:", error);
    }
}

// En ../services/ServiceService.ts

export async function registrarCobro(ventaData: DateList) {
    try {
        // 1. CREAR LA VENTA: Enviamos a la tabla de historial de ventas
        const urlVenta = `${import.meta.env.VITE_API_URL}/api/service`;
        await axios.post(urlVenta, {
            barber: ventaData.barber,
            service: ventaData.service,
            client: ventaData.client,
            phone: String(ventaData.phone),
            price: Number(ventaData.price)
        });

        // 2. MARCAR CITA COMO PAGADA: Enviamos a la tabla de citas
        // Tu router tiene PATCH /:id para updateAvailability/updateAppointmentStatus
        const urlCita = `${import.meta.env.VITE_API_URL}/api/date/${ventaData.id}`;
        await axios.patch(urlCita); 

        return { success: true };
    } catch (error) {
        console.error("Error en registrarCobro:", error);
        throw error;
    }
}