import {object, string, number, any, nullable, array, type InferOutput, boolean, is,  } from "valibot"

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
// En tu archivo de types/schemas
export const ServiceSchema = object({
    id: number(),
    service: string(),
    price: any(),
    barber: string(),
    client: string(), 
    phone: any(),
    createdAt: string(),
    isPaid: boolean(), // <--- Añadimos este campo
    clientId: nullable(any()),
    clientData: nullable(any()),
    updatedAt: string(),
    isArchived: boolean(),  // <--- Añadir esto
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
    client: string(),   
    phone: number(),
    createdAt: any(), // IMPORTANTE: Sequelize siempre lo envía
    updatedAt: any(), // IMPORTANTE: Sequelize siempre lo envía
    clientId: nullable(any()),     
    dateList: string(),
    isPaid: boolean(),
    // isArchived: boolean(),  // <--- Añadir esto

})
// Añade esto a tu archivo de types junto a ServiceSchema
export const WeeklyClosingSchema = object({
    id: number(),
    barber: string(),
    totalGross: any(), // any por el FLOAT de Sequelize
    commission: any(),
    servicesCount: number(),
    archivedServiceIds: string(),
    createdAt: any()
})

export const WeeklyClosingsSchema = array(WeeklyClosingSchema)

export type WeeklyClosing = InferOutput<typeof WeeklyClosingSchema>

export const DatesSchema = array(DateSchema)
export const ServicesSchema = array(ServiceSchema)


// export const  BarbersSummaryType = array(BarberSchema)


export type Client = InferOutput<typeof ClientSchema>
export type Service = InferOutput<typeof ServiceSchema>
export type DateList = InferOutput<typeof DateSchema>
