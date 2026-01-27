import {  Form, type ActionFunctionArgs, redirect, useActionData, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { addProduct } from "../services/ServiceService"
import { useEffect, useState } from "react";
import ErrorMessaje from "../componenents/ErrorMessaje";
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    if (Object.values(data).includes("")) return "Todos los campos son obligatorios"
    await addProduct(data)
    return redirect("/")
}
// ... (mismos imports)

export default function NewService() {
    const error = useActionData() as string;
    const [searchParams] = useSearchParams();
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState(""); // <--- AHORA SÍ SE USA

    useEffect(() => {
        setClientName(searchParams.get("client") || "");
        setClientPhone(searchParams.get("phone") || "");
    }, [searchParams]);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 max-w-lg mx-auto bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl"
        >
            <h2 className="text-3xl font-black text-amber-500 mb-2 uppercase tracking-tighter italic">Registrar <span className="text-white">Pago</span></h2>
                        {error && <ErrorMessaje>{error}</ErrorMessaje>}

            
            <Form method="POST" className="flex flex-col gap-6 mt-6">
                {/* Selector de Barbero con Foto (Mismo código anterior) */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Campos de Servicio y Precio */}
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-amber-500 text-[10px] font-black uppercase ml-1" htmlFor="client">Cliente</label>
                        <input id="client" name="client" type="text" className="w-full font-bold text-white rounded-xl p-3 bg-zinc-900 border border-zinc-800 focus:border-amber-500 outline-none" defaultValue={clientName} placeholder="Nombre VIP" />
                    </div>

                    {/* USANDO EL TELÉFONO AQUÍ */}
                    <div className="space-y-1">
                        <label className="text-amber-500 text-[10px] font-black uppercase ml-1" htmlFor="phone">Teléfono de Contacto</label>
                        <input id="phone" name="phone" type="text" className="w-full font-bold text-white rounded-xl p-3 bg-zinc-900 border border-zinc-800 focus:border-amber-500 outline-none" defaultValue={clientPhone} placeholder="Ej: 600000000" />
                    </div>
                </div>

                <motion.input 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="mt-4 bg-amber-500 p-4 text-black font-black text-sm cursor-pointer rounded-xl hover:bg-white uppercase tracking-widest transition-colors shadow-lg shadow-amber-500/20" 
                    value="Cerrar Venta ✓" 
                />
            </Form>
            {/* ... link de volver */}
        </motion.div>
    )
}