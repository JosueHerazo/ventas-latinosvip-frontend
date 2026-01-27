import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { DateList } from "../types";
import { getDatesList, registrarCobro, actualizarEstadoCita} from "../services/ServiceService";
import { formatCurrency } from "../utils";
import { faPrescription } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export async function loader() {
    return await getDatesList();
}

export default function DateClient() {
    const datelist = useLoaderData() as DateList[];
    const navigate = useNavigate();
    const revalidator = useRevalidator(); 
    faPrescription
   const liquidarVenta = async (cita: DateList) => {
        const idCarga = toast.loading("Liquidando cobro...");

        try {
            // 1. Crea la venta en el historial
            await registrarCobro(cita);
            
            // 2. Marca la cita como pagada para que desaparezca de "Pendientes"
            await actualizarEstadoCita(cita.id);
            
            toast.update(idCarga, { 
                render: `✅ Venta de ${cita.client} registrada`, 
                type: "success", 
                isLoading: false,
                autoClose: 2000 
            });

            // 3. ¡ESTA ES LA CLAVE! 
            // Esto le dice a React Router: "Los datos cambiaron, vuelve a pedirlos".
            // Al hacer esto, el Layout vuelve a contar las citas y el globo bajará.
            await revalidator.revalidate(); 

            // 4. Redirigimos al historial de ventas
            navigate("/"); 

        } catch (error) {
            toast.update(idCarga, { 
                render: "❌ Error al procesar el pago", 
                type: "error", 
                isLoading: false,
                autoClose: 3000 
            });
        }
    };
    const citasPendientes = datelist.filter(c => !c.isPaid);

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

            <div className="overflow-hidden shadow-2xl rounded-[2.5rem] border border-zinc-900 bg-zinc-950">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-900/50 border-b border-zinc-800">
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase">Servicio</th>
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase">Barbero</th>
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase text-center">Precio</th>
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase">Cliente</th>
                            <th className="p-5 text-amber-500 text-[10px] font-black uppercase text-right">Acción</th>
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
                                    <td className="p-5 text-right">
                                        <button 
                                            onClick={() => liquidarVenta(cita)}
                                            className="bg-amber-600 hover:bg-green-500 text-black hover:text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all shadow-lg active:scale-95"
                                        >
                                            Liquidar y Cobrar
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

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