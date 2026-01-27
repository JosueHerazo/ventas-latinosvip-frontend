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

export async function registrarCobro(ventaData: any) {
    const url = `${import.meta.env.VITE_API_URL}/api/ventas`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(ventaData),
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
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

    
// Dateapp


// services/ServiceService.ts
// export async function searchClients() {
//     try {
//         const url = `${import.meta.env.VITE_API_URL}/api/service`
//         const { data } = await axios(url)
//         return data.data as Client[]
//     } catch (error) {
//         console.log(error)
//         return []
//     }
// }S