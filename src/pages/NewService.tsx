import { Form, type ActionFunctionArgs, redirect, useActionData, useSearchParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { addProduct } from "../services/ServiceService"
import ErrorMessaje from "../componenents/ErrorMessaje";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    
    // Validación de campos vacíos
    if (Object.values(data).includes("")) {
        return "Todos los campos son obligatorios"
    }

    // TRANSFORMACIÓN: Convertir a números para que Valibot y Sequelize no den error
   

    // Aquí addProduct usará parse(DraftServiceSchema, serviceData)
    await addProduct(data)
    return redirect("/")
}

export default function NewService() {
    const error = useActionData() as string;
    const [searchParams] = useSearchParams();
    
    // Obtenemos datos de la URL si vienen de una cita previa
    const defaultClient = searchParams.get("client") || "";
    const defaultPhone = searchParams.get("phone") || "";
    const defaultService = searchParams.get("service") || "";

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 max-w-lg mx-auto bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl"
        >
            <h2 className="text-3xl font-black text-amber-500 mb-2 uppercase italic">
                Pagar <span className="text-white">Servicio</span>
            </h2>
            
            {error && <ErrorMessaje>{error}</ErrorMessaje>}

            <Form method="POST" className="flex flex-col gap-5 mt-6">
                
                {/* BARBERO */}
                <div className="space-y-1">
                    <label className="text-amber-500 text-[10px] font-black uppercase ml-1">Barbero</label>
                    <select name="barber" className="w-full font-bold text-white rounded-xl p-3 bg-zinc-900 border border-zinc-800 outline-none focus:border-amber-500">
                        <option value="">Selecciona Barbero...</option>
                        <option value="Josue">Josue</option>
                        <option value="Vato">Vato</option>
                    </select>
                </div>

                {/* SERVICIO Y PRECIO */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-amber-500 text-[10px] font-black uppercase ml-1">Servicio</label>
                        <input 
                            name="service" 
                            type="text" 
                            defaultValue={defaultService}
                            placeholder="Ej: Corte Degradado" 
                            className="w-full font-bold text-white rounded-xl p-3 bg-zinc-900 border border-zinc-800" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-amber-500 text-[10px] font-black uppercase ml-1">Precio ($)</label>
                        <input 
                            name="price" 
                            type="number" 
                            step="0.01"
                            placeholder="20.00" 
                            className="w-full font-bold text-white rounded-xl p-3 bg-zinc-900 border border-zinc-800" 
                        />
                    </div>
                </div>

                {/* DATOS DEL CLIENTE */}
                <div className="space-y-4 bg-zinc-900/40 p-5 rounded-3xl border border-zinc-800/50">
                    <div className="space-y-1">
                        <label className="text-amber-500 text-[10px] font-black uppercase ml-1">Nombre Cliente</label>
                        <input 
                            name="client" 
                            type="text" 
                            key={defaultClient}
                            defaultValue={defaultClient}
                            className="w-full font-bold text-white rounded-xl p-3 bg-zinc-800 border border-zinc-700" 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-amber-500 text-[10px] font-black uppercase ml-1">Teléfono</label>
                        <input 
                            name="phone" 
                            type="number" 
                            key={defaultPhone}
                            defaultValue={defaultPhone}
                            className="w-full font-bold text-white rounded-xl p-3 bg-zinc-800 border border-zinc-700" 
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="mt-4 bg-amber-600 hover:bg-amber-500 p-4 text-black font-black rounded-xl uppercase transition-all shadow-lg shadow-amber-900/20"
                >
                    Confirmar y Registrar Pago ✓
                </button>

                <Link to="/" className="text-center text-zinc-500 text-xs font-bold hover:text-white uppercase mt-2">
                    Volver al inicio
                </Link>
            </Form>
        </motion.div>
    )
}