import { Link, Form, type ActionFunctionArgs, redirect, useLoaderData, useActionData } from "react-router-dom"
import ErrorMessaje from "../componenents/ErrorMessaje"
import { addProduct } from "../services/ServiceService"
import { useState, useEffect } from "react"
import { getServices } from "../services/ServiceService"
import type {  Service } from "../types"


export async function loader() {
    
  const services = await getServices()
  return services || []
}

export async function action({request} : ActionFunctionArgs){
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

    let error = ""
    if(Object.values(data).includes("")){
        error = "Todos los campos son obligatorios"
    }
    if(error.length){
        return error
    }

   
   
    await addProduct(data)
    
    
    return redirect("/")
}

export default function NewService() {

const services = useLoaderData() as Service[]
const error = useActionData() as string

     const servicios = [
    "Corte",
    "Corte de Niño",
    "Barba",
    "Cejas",
    "Mechas",
    "Tinte",
    "Trenzas",
    "Mask Carbon",
    "Limpieza Facial",
    "Diseño",
    "Lavado de Cabello",
    "Otros",
  ];
  const barberos = ["Josue", "Vato"];
 
  // 1. Estados para la búsqueda y selección
    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState<Service[]>([])
    const [selectedClient, setSelectedClient] = useState({ 
        id: 0,
        client: "",
        phone: 0,
        service: "",
        barber: "",
        createdAt: "",
        price: 0,

     })

    // 2. Efecto para buscar clientes mientras escribes
   // --- FILTRO DE BÚSQUEDA CORREGIDO ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Verificamos que services exista y sea un array antes de filtrar
      if (searchTerm.trim().length >= 1 && Array.isArray(services)) {
        const filtered = services.filter(s => 
          s.client?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          s.phone?.toString().includes(searchTerm)
        )
        setResults(filtered)
      } else {
        setResults([])
      }
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, services])
    // 3. Función al hacer click en un cliente encontrado
    const handleSelectClient = (client: Service) => {
        setSelectedClient({ 
            client: client.client,
            phone: client.phone,
            id: client.id,
            service: client.service,
            price: client.price,
            barber: client.barber,
            createdAt: client.createdAt
        });
        setSearchTerm(""); 
        setResults([]);
    };
  
  return  (
        <>

            <div className="mt-10 max-w-md mx-auto">
                {/* --- BUSCADOR --- */}
                <div className="mb-4 relative">
                    <label className="text-amber-50 font-bold">Buscar Cliente Guardado:</label>
                    <input 
                        type="text"
                        className="mt-2 block w-full p-3 rounded-2xl bg-zinc-800 text-white border-2 border-amber-400"
                        placeholder="Escribe nombre o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    
                    {results.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white rounded-xl mt-1 shadow-2xl max-h-40 overflow-y-auto">
                            {results.map(c => (
                                <li 
                                    key={c.id}
                                    className="p-3 hover:bg-amber-100 cursor-pointer text-black border-b last:border-none"
                                    onClick={() => handleSelectClient(c)}
                                    >
                                    <p className="font-bold">{c.client}</p>
                                    <p className="text-sm text-gray-600">{c.phone}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <hr className="border-amber-900/30 my-6" />
                        {error && <ErrorMessaje>{error}</ErrorMessaje>}

                {/* --- FORMULARIO PRINCIPAL --- */}
                <Form method="POST" className="flex flex-col gap-4">
                    <div className="mb-4">
                        <label className="text-amber-50" htmlFor="service">Servicio</label>
                        <select id="service" name="service" className="mt-2 block w-full font-bold text-white rounded-2xl p-3 bg-amber-400">
                            <option value="">Selecciona un Servicio</option>
                            {servicios.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="text-amber-50" htmlFor="price">Precio:</label>
                        <input id="price" name="price" type="number" className="mt-2 font-bold text-white block w-full rounded-2xl p-3 bg-amber-400" placeholder="Ej. 15" />
                    </div>

                    <div className="mb-4">
                        <label className="text-amber-50" htmlFor="barber">Barbero</label>
                        <select id="barber" name="barber" className="mt-2 block w-full font-bold text-white rounded-2xl p-3 bg-amber-400">
                            <option value="">Selecciona Barbero</option>
                            {barberos.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    {/* INPUTS VINCULADOS AL ESTADO */}
                    <div className="mb-4">
                        <label className="text-amber-50" htmlFor="client">Cliente</label>
                        <input 
                            id="client"
                            name="client"
                            type="text"
                            className="mt-2 block w-full p-3 rounded-2xl font-bold text-white bg-amber-400"
                            value={selectedClient.client} // IMPORTANTE
                            onChange={(e) => setSelectedClient({...selectedClient, client: e.target.value})}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-amber-50" htmlFor="phone">Teléfono:</label>
                       <input
              id="phone"
              name="phone"
              type="number"
              className="mt-2 block w-full p-3 rounded-2xl font-bold text-white bg-amber-400"
              // Evitamos que muestre un 0 molesto si está vacío
              value={selectedClient.phone === 0 ? "" : selectedClient.phone}
              onChange={(e) => setSelectedClient({ ...selectedClient, phone: Number(e.target.value) })}
            />
                    </div>

                    <input type="submit" className="mt-5 bg-amber-400 p-2 text-white font-black text-lg cursor-pointer rounded-4xl hover:scale-105 transition-transform" value="Registrar Servicio" />
                </Form>

                <div className="mt-10">
                    <Link className="text-amber-400 font-bold hover:underline" to="/">
                        ← Volver a servicios vendidos
                    </Link>
                </div>
            </div>
        </>
    )
}