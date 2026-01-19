import { useLoaderData, Link, redirect, type LoaderFunctionArgs } from "react-router-dom"
import { useState, useMemo } from "react"
import { getServices } from "../services/ServiceService"
import { type Service } from "../types"

export async function loader({params} : LoaderFunctionArgs) {
    console.log(params.id);
    if(params.id !== undefined){
        const service = await getServices()
        if(!service){
            return redirect("/")
            
        }
        return service || []
    }
    
}

export default function SearchClients() {
    const service = useLoaderData() as Service[]
    const [query, setQuery] = useState("")

    // Filtramos los servicios basados en la búsqueda
    const filteredResults = useMemo(() => {
        if (!query || !Array.isArray(service)) return []
        return service.filter(s => 
            s.client.toLowerCase().includes(query.toLowerCase()) || 
            s.phone.toString().includes(query)
            
        )
    }, [query, service])

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
                            filteredResults.map(s => (
                                <tr key={s.id} className="hover:bg-zinc-800 text-white">
                                    <td className="p-4 font-bold">{s.client}</td>
                                    <td className="p-4">{s.phone}</td>
                                    <td className="p-4 text-sm text-gray-400">{s.service} ({s.createdAt})</td>
                                    <td className="p-4">
                                        <Link 
                                            to={`/nuevo/servicio?client=${s.client}&phone=${s.phone}`}
                                            className="text-amber-500 hover:underline font-bold"
                                        >
                                            Nuevo Servicio
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-gray-500">
                                    {query ? "No se encontraron clientes" : "Escribe algo para empezar a buscar..."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}