import {object, string, number, array, type InferOutput,  } from "valibot"

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
    client: string(), 
    phone: number(), // A veces el número llega como string o number
    createdAt: string()
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
    date: number(), 
})


export const DatesSchema = array(DateSchema)
export const ServicesSchema = array(ServiceSchema)


// export const  BarbersSummaryType = array(BarberSchema)


export type Client = InferOutput<typeof ClientSchema>
export type Service = InferOutput<typeof ServiceSchema>
export type DateList = InferOutput<typeof DateSchema>
