import {object, string, number, array, type InferOutput,  } from "valibot"


export const DraftServiceSchema = object({
    service: string(),
    price: number(),
    barber: string(),
    client: string(),
    phone: number(),
    // createdAt: string()
})

export const ServiceSchema = object({
    id: number(),
    service: string(),
    price: number(),
    barber: string(),
    client: string(),
    phone: number(),
    createdAt: string()
    
})

export const BarberSchema  = object({
  service: string(),
  price: number(),
  barber: string(),
  createdAt: string()
})
export const ClientSchema = object({
    id: number(),
    name: string(),
    phone: number(),
})



export const ServicesSchema = array(ServiceSchema)
export const  BarbersSummaryType = array(BarberSchema)


export type Client = InferOutput<typeof ClientSchema>
export type Service = InferOutput<typeof ServiceSchema>
