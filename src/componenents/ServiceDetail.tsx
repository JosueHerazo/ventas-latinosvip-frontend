import { type ActionFunctionArgs, redirect, Form, useNavigate, Link } from "react-router-dom"
import  { type Service } from "../types"
import { formatCurrency } from "../utils"
import { deleteService } from "../services/ServiceService"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import { getFidelityStats } from "../utils";

// 1. CORRECCIÓN DE TIPOS: Añadimos allServices a la interfaz
type ServiceDetailsPro = {
    service: Service
    allServices: Service[] // <-- Agregado
}

export async function action({ params }: ActionFunctionArgs) {
    if (params.id !== undefined) {
        await deleteService(+params.id)
    }
    return redirect("/")
}

// 2. DESESTRUCTURACIÓN: Extraemos allServices de los props
export default function ServiceDetails({ service, allServices }: ServiceDetailsPro) {
    const navigate = useNavigate();
    
    // 3. CORRECCIÓN NULL: Si el teléfono es null, mandamos un string vacío "" 
    // para que getFidelityStats no falle
    const fidelity = getFidelityStats(allServices, service.phone || "");

    if (service.service === "CLIENTE_REGISTRADO"){
        return null; 
    }

    return (
        <>
            <td className="p-5 text-zinc-500 text-[10px] font-bold">{service.id}</td>
            <td className="p-5 font-black text-white uppercase text-sm">{service.service}</td>
            <td className="p-5 text-center font-black text-amber-500">{formatCurrency(service.price)}</td>
            <td className="p-5 text-center">
                <span className="bg-zinc-900 text-zinc-300 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-zinc-800">
                    <Link to={`/barberos/${service.barber}`}>
                        {service.barber}
                    </Link>
                </span>
            </td>
            
            {/* COLUMNA DE CLIENTE CON FIDELIDAD MEJORADA */}
            <td className="p-5">
                <div className="flex flex-col">
                    <Link to={`/buscar/clientes`} className="hover:text-amber-500">
                        <p className="text-white font-black text-xs uppercase tracking-tight">{service.client}</p>
                    </Link>
                    <p className="text-zinc-500 text-[9px] font-bold">{service.phone || "SIN TELÉFONO"}</p>
                    
                    {/* BARRA MINI DE FIDELIDAD */}
                    {service.phone && (
                        <div className="mt-2 w-24">
                            <div className="flex justify-between text-[7px] font-black mb-0.5 uppercase">
                                <span className="text-zinc-600">Fidelidad</span>
                                <span className={fidelity.isGiftNext ? "text-green-500" : "text-amber-500"}>
                                    {fidelity.progress}/10
                                </span>
                            </div>
                            <div className="flex gap-0.5 h-1">
                                {[...Array(10)].map((_, i) => (
                                    <div 
                                        key={i}
                                        className={`flex-1 rounded-full ${
                                            i < fidelity.progress ? (fidelity.isGiftNext ? 'bg-green-500 shadow-[0_0_5px_green]' : 'bg-amber-500') : 'bg-zinc-800'
                                        }`}
                                    />
                                ))}
                            </div>
                            {fidelity.isGiftNext && (
                                <span className="text-[6px] font-black text-green-500 uppercase animate-pulse mt-1 block">
                                    ¡Próximo Gratis! 🎁
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </td>

            <td className="p-5 text-zinc-500 text-[10px] font-bold italic">{service.createdAt}</td>

            <td className="p-5 text-center">
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => navigate(`/servicios/${service.id}/editar`)} 
                        className="text-zinc-600 hover:text-amber-500 transition-colors"
                        title="Editar registro"
                    >
                        <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                    </button>
                    
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