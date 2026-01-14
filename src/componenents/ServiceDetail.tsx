import { useNavigate, Form, type ActionFunctionArgs, redirect, Link } from "react-router-dom"

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

export default function ServiceDetails({service} : ServiceDetailsPro) {
    const navigate = useNavigate()
  return (
    <tr className="border-b text-white  ">
            <td className="p-3 text-lg text-white font-bold">
                {service.id}
            </td>
            <td className="p-3 text-lg text-white font-bold">
                {service.service}
            </td>
            <td className="p-3 text-lg text-white font-bold">
                { formatCurrency(service.price)}

            </td>
            <td className="p-3 text-lg text-white font-bold">
                <Link 
                to={`/barberos/${service.barber}`}>
                    {service.barber}
                </Link>
    
            </td>
            <td className="p-3 text-lg text-white font-bold">
                {service.client}
    
            </td>
            <td className="p-3 text-lg text-white font-bold ">
                {service.phone}
            
            </td>
            
            <td className="p-3 text-lg text-white font-bold ">
                {formatDate(service.createdAt)}
            
            </td>
            <td className="p-3 text-lg text-white font-bold ">
                <div className="flex gap 2 items-center">
                    <button className="mt-5  bg-amber-600 p-2 text-white w-full font-bold text-lg cursor-pointer rounded" onClick={ () => navigate(`/servicios/${service.id}/editar`, 
                        
                    )}>
                        Editar
                    </button>
                    <Form 
                    className=""
                    method="POST"
                    action={`/servicios/${service.id}/eliminar`}
                    onSubmit={(e) => {
                        if(!confirm("Eliminar?")){
                            e.preventDefault()
                        }
                    }}
                    >
                        <input type="submit" 
                        value="Eliminar"
                        className="mt-5  bg-red-600 p-2 text-white w-full font-bold text-lg cursor-pointer rounded"
                        />
                    </Form>
                </div>
        </td>
    </tr> 
  )
}

