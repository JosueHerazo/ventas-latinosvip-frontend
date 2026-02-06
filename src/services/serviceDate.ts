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
export async function updateDate(id: number) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/date/${id}`;
        await axios.patch(url);
    } catch (error) {
        console.error("Error al actualizar estado:", error);
    }
}

export async function registrarCobro(ventaData: DateList) {
    try {
        const urlVenta = `${import.meta.env.VITE_API_URL}/api/service`;
        await axios.post(urlVenta, {
            barber: ventaData.barber,
            service: ventaData.service,
            client: ventaData.client,
            phone: Number(ventaData.phone),
            price: Number(ventaData.price)
        });
        await updateDate(ventaData.id);
        return { success: true };
    } catch (error) {
        throw error;
    }
}