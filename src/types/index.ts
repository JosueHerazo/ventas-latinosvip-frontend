import {object, string, number, any, nullable, array, type InferOutput, boolean,  } from "valibot"

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
// types.ts
export const ServiceSchema = object({
    id: number(),
    service: string(),
    price: any(),
    barber: string(),
    client: string(), 
    phone: any(),
    createdAt: any(), // Cambiado de string() a any() porque Sequelize envía objetos de fecha
    isPaid: nullable(any()), // Acepta null
    isArchived: nullable(boolean()), 
    updatedAt: any(),
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
    createdAt: any(), // Cambiado de string() a any() porque Sequelize envía objetos de fecha
    isPaid: nullable(any()), // Acepta null
    isArchived: nullable(boolean()), 
    updatedAt: any()
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
export type DateList = InferOutput<typeof DateSchema>
export type Service = InferOutput<typeof ServiceSchema>
