import { type ActionFunctionArgs, redirect, Form, useNavigate, Link } from "react-router-dom"
import type { Service } from "../types"
import { formatCurrency } from "../utils"
import { deleteService } from "../services/ServiceService"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

type ServiceDetailsPro = {
    service: Service
}

export async function action({ params }: ActionFunctionArgs) {
    if (params.id !== undefined) {
        await deleteService(+params.id)
    }
    return redirect("/")
}

export default function ServiceDetails({ service }: ServiceDetailsPro) {
    const navigate = useNavigate();

    return (
        <>
            <td className="p-5 text-zinc-500 text-[10px] font-bold">#{service.id}</td>
            <td className="p-5 font-black text-white uppercase text-sm">{service.service}</td>
            <td className="p-5 text-center font-black text-amber-500">{formatCurrency(service.price)}</td>
            <td className="p-5 text-center">
                <span className="bg-zinc-900 text-zinc-300 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-zinc-800">
                    <Link to={`/barberos/${service.barber}`}    >
                    {service.barber}
                    Detalle Semanal
                    </Link>
                </span>
            </td>
            <td className="p-5">
                <Link to={`/clientes/${service.client}`} className="hover:text-amber-500">
        <p className="text-white font-bold text-sm">{service.client}</p>
                 </Link>
                  <p className="text-zinc-500 text-[10px] mt-1 font-medium">{service.phone || "---"}</p>
            </td>
            <td className="p-5 text-zinc-500 text-[10px] font-bold italic">{new Date().toLocaleDateString()}</td>

            {/* 7. Acciones Corregidas */}
            <td className="p-5 text-center">
                <div className="flex justify-center gap-3">
                    {/* BOTÓN EDITAR */}
                    <button
                        onClick={() => navigate(`/servicios/${service.id}/editar`)}
                        className="text-zinc-600 hover:text-amber-500 transition-colors"
                        title="Editar registro"
                    >
                        <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                    </button>

                    {/* FORMULARIO PARA ELIMINAR */}
                    <Form
                        method="POST"
                        action={`servicios/${service.id}/eliminar`}
                        onSubmit={(e) => {
                            if (!confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <button
                            type="submit"
                            className="text-zinc-600 hover:text-red-500 transition-colors"
                            title="Eliminar registro"
                        >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </button>
                    </Form>
                </div>
            </td>
        </>
    )
}