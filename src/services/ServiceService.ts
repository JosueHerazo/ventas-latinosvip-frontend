import { safeParse} from "valibot"
import axios from "axios"
import { DatesSchema, DraftServiceSchema, ServiceSchema, ServicesSchema, type DateList, type Service} from "../types";
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
            phone: Number(data.phone),
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
            phone: +result.output.phone,
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
                throw new Error("Hubo un error...")
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
            phone: Number(data.phone),
            // createdAt:  parse(DateSchema,data.createdAt)


        })
        if(result){

            const url = `${import.meta.env.VITE_API_URL}/api/service/${id}`
            await axios.put(url, result.output)
        }
    } catch (error) {
        
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


export async function getDatesList() {
    try {
        // Usamos la misma URL del servidor que usaste para registrar
        const url = `${import.meta.env.VITE_API_URL}/api/date`;
        console.log("Enviando a:", url); 
        const { data } = await axios.get(url);
        console.log(data, "lista de  cetas recibidas");
        console.log(data.data[0].dateList, "fecha de la cita");
        const result = safeParse(DatesSchema, data.data)
        
        if(result.success){
            return result.output
        }else{ 
            // ESTO TE DIRÁ EXACTAMENTE QUÉ CAMPO FALTA O ESTÁ MAL
           // Si falla la validación, imprimimos por qué, pero DEVOLVEMOS LOS DATOS
            console.error("Fallo de validación Valibot, pero cargando datos igual");
            return data.data as DateList[];            
        }      
    } catch (error) {
        console.log(error);
        return [];
    }
}

// Dentro de ServiceService.ts
export async function registrarCobro(ventaData: DateList) {
    try {
        // 1. URL para crear la Venta (donde ya te funciona el POST)
        const urlVenta = `${import.meta.env.VITE_API_URL}/api/service`;
        
        // 2. Registramos el servicio en el historial de ventas
        await axios.post(urlVenta, {
            barber: ventaData.barber,
            service: ventaData.service,
            client: ventaData.client,
            phone: Number(ventaData.phone), // Forzamos número para evitar fallos de Valibot
            price: Number(ventaData.price)
        });

        // 3. URL para eliminar la cita de la lista de pendientes
        // Usamos el ID de la cita que recibimos
        const urlCita = `${import.meta.env.VITE_API_URL}/api/date/${ventaData.id}`;
        
        // 4. Borramos la cita original
        await axios.delete(urlCita);

        return { success: true };
    } catch (error) {
        console.error("Error en registrarCobro:", error);
        throw error; // Re-lanzamos el error para que el componente lo detecte
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
    const url = `${import.meta.env.VITE_API_URL}/api/dates/${id}`; 
    await axios.patch(url);
}
    
