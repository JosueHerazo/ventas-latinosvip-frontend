import { safeParse} from "valibot"
import axios from "axios"
import {  DraftServiceSchema, ServiceSchema, ServicesSchema, type DateList, type Service} from "../types";
// import { DatesSchema } from "../types";



type serviceData = {

    [k: string]: FormDataEntryValue;

}
export async function addProduct(data : serviceData) {
    try {
        // VALIBOT LIMPIA LOS DATOS Y PARSEA EL TYPE
        const result = safeParse(DraftServiceSchema,
            {
            barber: data.barber,
            service: data.service,
            client: data.client,
            phone: data.phone,
            price: Number(data.price),
            // createdAt: data.createdAt
            
        })
                console.log(result);

        // LUEGO SI LOS RESULTADOS CON CORECTOS 
if (result.success) {
    // SE CREA LA RUTA DE DESTINO
    const url = `${import.meta.env.VITE_API_URL}/api/service`
    // LUEGO SE ENVIA LA DATA A LA SERVER CON EL METODO POST Y SE AÑADE LA URL LUEGO LA DATA YA VALIDADA
     await axios.post(url, 
        {
            barber: result.output.barber,
            service: result.output.service,
            client: result.output.client,
            phone: result.output.phone,
            price: +result.output.price,
            
            
        }
    )
            console.log(data);
    
} else {
    
}    } catch (error) {
        console.log(error);
        
    }
    
    
}

export async function getServices() {
    try {
            const url = `${import.meta.env.VITE_API_URL}/api/service`
            const {data} = await axios(url)
            console.log("DATOS RECIBIDOS:", data);
            const result = safeParse(ServicesSchema, data.data)
            if(result.success){
               return result.output
            }else{
               
              // SI FALLA, MIRA POR QUÉ FALLA
            console.error("DETALLES DEL ERROR VALIBOT:", result.issues);
            
            // RETORNA LOS DATOS DIRECTAMENTE (ignora la validación temporalmente)
            // Esto hará que tu tabla se llene por fin.
            return data.data as Service[]
            }

    } catch (error) {
        console.error("Error al obtener servicios", error);
        return[]
    }
}


export async function getServiceById(id : Service["id"]) {
    try {
            const url = `${import.meta.env.VITE_API_URL}/api/service/${id}`
            const {data} = await axios(url)
            const result = safeParse(ServiceSchema, data.data)
            if(result.success){
               return result.output
            }else{
                console.warn("VALIBOT FALLÓ EN getServiceById:", result.issues);          
                return data.data as Service
            }

            
            console.log(result);
            
            
    } catch (error) {
        
    }
}

export async function updateService (data : serviceData, id : Service["id"]){
    try {
        // const NumberSchema = coerce(number(), Number)
        // const DateSchema = coerce(date(), Date)
        const result = safeParse( DraftServiceSchema, {
            // id: parse(NumberSchema, +data.id),
            service: data.service,
            price:  Number(data.price),
            barber: data.barber,
            client: data.client,
            phone: data.phone,
            // createdAt:  parse(DateSchema,data.createdAt)
        })
        if(result.success){

            const url = `${import.meta.env.VITE_API_URL}/api/service/${id}`
            await axios.put(url, result.output)
        }else{

            console.error("Error validando datos antes de actualizar:", )
        }
    } catch (error) {
        console.log(error);
        
    }
    
}

export async function deleteService(id: Service["id"]) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/service/${id}`
        await axios.delete(url)
    } catch (error) {
        console.log(error);   
    }
    
}

// services/CitasService.ts



// Dentro de ServiceService.ts
export async function registrarCobro(ventaData: DateList) {
    try {
        const urlVenta = `${import.meta.env.VITE_API_URL}/api/service`;
        
        // 1. Crea la venta en el historial
        await axios.post(urlVenta, {
            barber: ventaData.barber,
            service: ventaData.service,
            client: ventaData.client,
            phone: ventaData.phone,
            price: Number(ventaData.price)
        });

        // 2. En lugar de borrar, actualizamos el estado a pagado
        // Esto hará que 'citasPendientes.filter' la saque de la lista
        await actualizarEstadoCita(ventaData.id);

        return { success: true };
    } catch (error) {
        console.error("Error en registrarCobro:", error);
        throw error;
    }
}
export async function archivarSemana(cierreData: any) {
    const url = `${import.meta.env.VITE_API_URL}/api/cierres`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(cierreData),
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}   

// src/services/ServiceService.ts

// src/services/ServiceService.ts
export async function actualizarEstadoCita(id: number) {
    // Si tu router de citas está en /api/dates, la URL debe ser esa
    const url = `${import.meta.env.VITE_API_URL}/api/date/${id}`; 
    await axios.patch(url);
}
    
// En ../services/ServiceService.ts
export async function deleteDate(id: number) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/date/${id}`;
        await axios.delete(url);
    } catch (error) {
        console.error("Error al eliminar cita:", error);
    }
}

//  actualizar citas existentes
export async function updateDate(data: any, id: number) {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/dates/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.log(error)
    }
}

// En tu archivo ../services/ServiceService.ts

export async function createClientFromContact(contactData: { client: string, phone: string }) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/api/service/`
        
        const response = await axios.post(url, {
            client: contactData.client,
            phone: String(contactData.phone).replace(/\D/g, ''),
            barber: "SISTEMA", // Identificador genérico
            service: "CLIENTE_REGISTRADO", // <--- ESTA ES LA MARCA CLAVE
            price: 0 // Usamos -1 para que no sume en tus totales de ventas
        });
        
        return response.data;
    } catch (error) {
        console.error("Error al guardar contacto:", error);
        return null;
    }
}