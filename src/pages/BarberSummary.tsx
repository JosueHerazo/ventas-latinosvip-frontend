import { useLoaderData, Link, } from "react-router-dom";
import { getServices } from "../services/ServiceService";
import type { Service } from "../types";
import { formatCurrency } from "../utils";
import { motion } from "framer-motion";


export async function loader() {
  const services = await getServices();
  return services;
}

export default function BarberSummary() {
  const services = useLoaderData() as Service[];
    // const { barber } = useParams();
  // Agrupar por barbero y luego por fecha
  const grouped = services.reduce<Record<string, Record<string, number>>>((acc, cur) => {
    // Usamos una fecha simplificada para agrupar mejor
    const date = new Date(cur.createdAt).toLocaleDateString();
    if (!acc[cur.barber]) acc[cur.barber] = {};
    if (!acc[cur.barber][date]) acc[cur.barber][date] = 0;
    acc[cur.barber][date] += cur.price;
    return acc;
  }, {});
  
  


  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-amber-600">Resumen de Ventas</h2>
        <Link to="/" className="text-white bg-zinc-700 p-2 rounded hover:bg-zinc-600">
            Volver a Inicio
        </Link>
      </div>
{Object.entries(grouped).map(([barber, dates]) => (
    <motion.div

        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        key={barber} 
        className="mb-8 bg-zinc-900 rounded-[2rem] p-6 border border-zinc-800 shadow-xl overflow-hidden relative"
    >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <h1 className="text-7xl font-black italic uppercase tracking-tighter">{barber[0]}</h1>
        </div>
        
        <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">Master Barber</p>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">{barber}</h3>
            </div>
            <Link 
              to={`/admin/historial/${encodeURIComponent(barber)}`}
                className="bg-white text-black text-[10px] font-black py-2 px-5 rounded-full uppercase hover:bg-amber-500 transition-colors"
            >
                Ver Historial Completo  
            </Link>
        </div>

        <div className="bg-black/40 rounded-2xl overflow-hidden border border-zinc-800">
            {Object.entries(dates).map(([date, total]) => (
                <div key={date} className="flex justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors">
                    <span className="text-zinc-400 font-bold">{date}</span>
                    <span className="text-green-400 font-black">{formatCurrency(total)}</span>
                </div>
            ))}
        </div>
    </motion.div>
))}
    </div>
  );
}