import { useLoaderData, Link } from "react-router-dom"
import { useState, useMemo } from "react"
import { getServices } from "../services/ServiceService" // Cambiado a getServices
import { type Service } from "../types"

export async function loader() {
    const services = await getServices()
    return services || [] // Retornamos array vacío si no hay datos
}

export default function SearchClients() {
    // Forzamos el tipo a Array para evitar el error de 'undefined'
    const services = useLoaderData() as Service[]
    const [query, setQuery] = useState("")

    const filteredResults = useMemo(() => {
        // Validación de seguridad: si services no es un array, no filtramos
        if (!query || !Array.isArray(services)) return []
        
        return services.filter(service => 
            service.client?.toLowerCase().includes(query.toLowerCase()) || 
            service.phone?.toString().includes(query)
        )
    }, [query, services])

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h2 className="text-3xl font-black text-amber-600 mb-6">Buscador de Clientes</h2>
            
            <div className="mb-8">
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o teléfono..."
                    className="w-full p-4 rounded-xl bg-zinc-800 text-white border-2 border-amber-500 focus:outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-amber-600 text-white">
                        <tr>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Teléfono</th>
                            <th className="p-4">Último Servicio</th>
                            <th className="p-4">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {filteredResults.length > 0 ? (
                            filteredResults.map(service => (
                                <tr key={service.id} className="hover:bg-zinc-800 text-white">
                                    <td className="p-4 font-bold">{service.client}</td>
                                    <td className="p-4">{service.phone}</td>
                                    <td className="p-4 text-sm text-gray-400">{service.service}</td>
                                    <td className="p-4">
                                        <Link 
                                            to={`/nuevo/servicio?client=${encodeURIComponent(service.client)}&phone=${service.phone}`}
                                            className="bg-amber-500 text-black px-3 py-1 rounded-lg font-bold text-xs hover:bg-amber-400"
                                        >
                                            Seleccionar
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-gray-500">
                                    {query ? "No se encontraron coincidencias" : "Ingresa un nombre para buscar"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-5">
                <Link to="/" className="text-amber-500">← Volver</Link>
            </div>
        </div>
    )
}