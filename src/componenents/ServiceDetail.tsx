import {  type ActionFunctionArgs, redirect } from "react-router-dom"

import type { Service } from "../types"
import {formatCurrency, formatDate} from "../utils"
import { deleteService } from "../services/ServiceService"

type ServiceDetailsPro = {
    service: Service
}

export async function action({params} : ActionFunctionArgs){
if(params.id !== undefined){
   await  deleteService(+params.id)

}
return redirect("/")
}
export default function ServiceDetails({ service }: ServiceDetailsPro) {
  return (
    <>
      {/* 1. ID */}
      <td className="p-5 text-zinc-500 text-[10px] font-bold">
        #{service.id}
      </td>

      {/* 2. Servicio */}
      <td className="p-5 font-black text-white uppercase text-sm">
        {service.service}
      </td>

      {/* 3. Precio */}
      <td className="p-5 text-center font-black text-amber-500">
        {formatCurrency(service.price)}
      </td>

      {/* 4. Barbero */}
      <td className="p-5 text-center">
        <span className="bg-zinc-900 text-zinc-300 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-zinc-800">
          {service.barber}
        </span>
      </td>

      {/* 5. Cliente / Tel. (Los datos que traemos de la cita) */}
      <td className="p-5">
        <p className="text-white font-bold text-sm uppercase leading-none">
          {service.client || "Cliente General"}
        </p>
        <p className="text-zinc-500 text-[10px] mt-1 font-medium">
          {service.phone || "---"}
        </p>
      </td>

      {/* 6. Fecha */}
      <td className="p-5 text-zinc-500 text-[10px] font-bold italic">
        {new Date().toLocaleDateString()}
      </td>

      {/* 7. Acciones */}
      <td className="p-5 text-center">
        <button 
          className="text-zinc-600 hover:text-red-500 transition-colors"
          title="Eliminar registro"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </>
  )
}

