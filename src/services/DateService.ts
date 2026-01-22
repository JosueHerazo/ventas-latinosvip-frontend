// services/CitasService.ts
import axios from "axios";
import { safeParse } from "valibot";
import { DatesSchema } from "../types";

export async function getDatesPending() {
    try {
        // Usamos la misma URL del servidor que usaste para registrar
        const url = `${import.meta.env.VITE_API_URL}/api/service`;
        const { data } = await axios.get(url);
        const result = safeParse(DatesSchema, data.data)
        if(result.success){
            return result.output
        }else{
            throw new Error("Hubo un error al cargar la lista de citas...");
            
        }      
    } catch (error) {
        console.log(error);
        return [];
    }
}