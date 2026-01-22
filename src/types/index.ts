import {object, string, number, optional, any, array, type InferOutput,  } from "valibot"

// draft de sales
export const DraftServiceSchema = object({
    service: string(),
    price: number(),
    barber: string(),
    client: string(),
    phone: number(),
    // createdAt: string()
})

// En types.ts
export const ServiceSchema = object({
    id: number(),
    service: string(),
    price: number(),
    barber: string(),
    client: optional(string()), 
    phone: optional(any()), // A veces el número llega como string o number
    date: optional(string()), 
    list: optional(any()),  // Cambia date() por any() para evitar el error de parseo
    createdAt: any()
})

export const BarberSchema  = object({
    service: string(),
    price: number(),
    barber: string(),
    createdAt: string()
})
export const ClientSchema = object({
    clientId: number(),
    name: string(),
    phone: string(),
})
// schema de citas
export const DateSchema = object({
    id: number(),
    service: string(),
    price: number(),
    barber: string(),
    list: optional(string()), 
    createdAt: any()
})


export const DatesSchema = array(DateSchema)
export const ServicesSchema = array(ServiceSchema)


// export const  BarbersSummaryType = array(BarberSchema)


export type Client = InferOutput<typeof ClientSchema>
export type Service = InferOutput<typeof ServiceSchema>
export type DateList = InferOutput<typeof DateSchema>
