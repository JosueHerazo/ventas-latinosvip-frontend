import { useLoaderData, useRevalidator } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { DateList } from "../types";
import { getDatesList, registrarCobro, actualizarEstadoCita} from "../services/ServiceService";
import { formatCurrency } from "../utils";
import { faPrescription } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useState } from "react";

export async function loader() {
    return await getDatesList();
}

export default function DateClient() {
const datelist = (useLoaderData() as DateList[]) || [];
const citasPendientes = Array.isArray(datelist) ? datelist.filter(c => !c.isPaid) : [];    const revalidator = useRevalidator();
    const [template, setTemplate] = useState(   
  localStorage.getItem("wsp_template") || 
  "Hola {cliente}, te recordamos tu cita en LatinosVip para el {fecha} a las {hora}. ¡Te esperamos!"
);

const enviarRecordatorio = (cita: DateList) => {
    const fecha = new Date(cita.dateList).toLocaleDateString();
    const hora = new Date(cita.dateList).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const mensaje = template
        .replace("{cliente}", cita.client)
        .replace("{fecha}", fecha)
        .replace("{hora}", hora);

    // CORRECCIÓN AQUÍ: Convertimos a String antes del replace
    const telefono = String(cita.phone).replace(/\s+/g, ''); 
    
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
};
    
    faPrescription
   const liquidarVenta = async (cita: DateList) => {
    const idCarga = toast.loading("Liquidando cobro...");
    try {
        // 1. Registra en el historial de ventas
        await registrarCobro(cita);
        
        // 2. Cambia isPaid a true en la DB
        await actualizarEstadoCita(cita.id); 
        
        toast.update(idCarga, { render: "✅ Pagado", type: "success", isLoading: false, autoClose: 2000 });

        // 3. ¡IMPORTANTE! Refresca los datos de la ruta actual y del Layout
        await revalidator.revalidate(); 
        
    } catch (error) {
        toast.update(idCarga, { render: "❌ Error", type: "error", isLoading: false });
    }
};

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="container mx-auto p-4 md:p-6"
        >
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-black text-amber-500 uppercase italic tracking-tighter">
                        Cobros <span className="text-white">Pendientes</span>
                    </h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                        Citas recibidas por liquidar
                    </p>
                </div>
                <div className="bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-800">
                    <span className="text-zinc-400 text-[10px] font-black uppercase">Pendientes: </span>
                    <span className="text-amber-500 font-black">{citasPendientes.length}</span>
                </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[600px] shadow-2xl rounded-[2.5rem] border border-zinc-900 bg-zinc-950">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-900/50 border-b border-zinc-800">
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase">Servicio</th>
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase text-center">Precio                        
                            </th>
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase">Barbero</th>
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase">Cliente</th>
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase">Fecha</th>
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase text-right">Confirmar</th>
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase text-right">Pagar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                        <AnimatePresence>
                            {citasPendientes.map((cita) => (
                                <motion.tr 
                                    key={cita.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    className="hover:bg-white/[0.02] transition-colors group"
                                >
                                    <td className="p-5">
                                        <p className="font-black text-white uppercase text-sm">{cita.service}</p>
                                        <p className="text-zinc-500 text-[10px] font-bold italic">ID: #{cita.id}</p>
                                    </td>
                                    <td className="p-5">
                                        <span className="bg-zinc-900 text-zinc-300 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-zinc-800">
                                            {cita.barber}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center font-black text-amber-500">
                                        {formatCurrency(cita.price)}
                                    </td>
                                    <td className="p-5">
                                        <p className="text-white font-bold text-sm">{cita.client}</p>
                                        <p className="text-zinc-500 text-xs">{cita.phone}</p>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-white font-bold text-sm">{cita.dateList}</p>
                                        <p className="text-zinc-500 text-xs">{cita.createdAt}</p>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            {/* BOTÓN WHATSAPP */}
                                            <button 
                                                onClick={() => enviarRecordatorio(cita)}
                                                className="text-green-500 hover:text-green-400 p-2 rounded-lg bg-green-500/10 border border-green-500/20 transition-all"
                                                title="Enviar Recordatorio"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.826c1.554.921 3.193 1.408 4.874 1.408 5.178 0 9.397-4.22 9.399-9.399.001-2.51-.978-4.87-2.757-6.648-1.779-1.778-4.139-2.758-6.649-2.758-5.18 0-9.401 4.221-9.403 9.4-.001 1.765.49 3.482 1.42 5.01l-.991 3.616 3.707-.973zm10.12-6.852c-.273-.137-1.616-.797-1.867-.889-.251-.09-.433-.136-.615.137-.182.273-.706.89-.865 1.072-.16.182-.319.205-.592.068-.273-.137-1.153-.425-2.196-1.355-.811-.723-1.358-1.617-1.517-1.891-.16-.273-.017-.421.119-.557.123-.122.273-.319.41-.478.137-.16.182-.273.273-.455.09-.182.046-.341-.023-.478-.069-.137-.615-1.481-.843-2.027-.221-.532-.443-.459-.615-.468-.159-.008-.341-.01-.523-.01s-.478.068-.729.341c-.251.273-.956.934-.956 2.278 0 1.344.979 2.641 1.115 2.824.137.182 1.928 2.944 4.672 4.129.653.282 1.163.451 1.56.578.655.209 1.25.18 1.72.11.524-.077 1.616-.661 1.844-1.298.228-.638.228-1.185.16-1.298-.069-.114-.251-.182-.524-.319z"/></svg>
                                            </button>
                                        </div>
                             </td>
                             <td>

                            {/* BOTÓN LIQUIDAR (tu botón original) */}
                            <button 
                                onClick={() => liquidarVenta(cita)}
                                className="..."
                            >
                                Pagar
                            </button>
                        </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                   {/* Al final de DateClient.tsx, antes del último </motion.div> */}
<div className="mt-10 p-6 bg-zinc-900/50 border border-zinc-800 rounded-[2rem]">
    <h3 className="text-white font-black text-xs uppercase mb-4">Ajustes de Recordatorio</h3>
    <textarea 
        className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-sm text-zinc-300 focus:border-amber-500 outline-none"
        rows={2}
        value={template}
        onChange={(e) => {
            setTemplate(e.target.value);
            localStorage.setItem("wsp_template", e.target.value);
        }}
    />
    <p className="text-[10px] text-zinc-500 mt-2">
        Etiquetas disponibles: <span className="text-amber-500">{`{cliente}, {fecha}, {hora}`}</span>
    </p>
</div>         
                {citasPendientes.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-5xl mb-4">✨</div>
                        <p className="text-zinc-500 uppercase font-black text-sm tracking-[0.2em]">
                            Todo en orden. No hay cobros pendientes.
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}