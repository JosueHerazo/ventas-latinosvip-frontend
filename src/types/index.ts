import {object, string, number, any, nullable, array, type InferOutput,  } from "valibot"

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
// types.ts
export const ServiceSchema = object({
    id: number(),
    service: string(),
    price: any(), // Cambiamos a any porque a veces Sequelize envía strings en FLOAT
    barber: string(),
    client: string(), 
    phone: any(),  // El BIGINT de la DB suele llegar como string al JSON
    createdAt: string(),
    clientId: nullable(any()), // Permitimos null o cualquier valor
    clientData: nullable(any()) // Permitimos null o cualquier valor
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
    phone: number(),
})
// schema de citas
export const DateSchema = object({
    id: number(),
    service: string(),
    price: number(),
    barber: string(),
    dateList: nullable(any()),
    clientId: nullable(any()), // Permitimos null o cualquier valor
    client: nullable(any()), // Permitimos null o cualquier valor
    createdAt: string(),
})


export const DatesSchema = array(DateSchema)
export const ServicesSchema = array(ServiceSchema)


// export const  BarbersSummaryType = array(BarberSchema)


export type Client = InferOutput<typeof ClientSchema>
export type Service = InferOutput<typeof ServiceSchema>
export type DateList = InferOutput<typeof DateSchema>
