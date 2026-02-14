import { useLoaderData, Link } from "react-router-dom";
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

  // AGRUPACIÓN INTELIGENTE
  const grouped = services.reduce<Record<string, Record<string, number>>>((acc, cur) => {
    // 1. Filtramos registros que no son ventas reales (Sistema o Archivados)
    if (cur.service === "CLIENTE_REGISTRADO" || cur.isArchived) return acc;
    if (!cur.isPaid) return acc; // Opcional: solo ver lo pagado

    // 2. Normalizamos el nombre del barbero para evitar repetidos por espacios o minúsculas
    const barberName = cur.barber.trim().toUpperCase();
    
    // 3. Formateamos la fecha
    const date = new Date(cur.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    if (!acc[barberName]) acc[barberName] = {};
    if (!acc[barberName][date]) acc[barberName][date] = 0;
    
    // 4. Sumamos asegurando que el precio sea un número
    acc[barberName][date] += Number(cur.price || 0);
    
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-10">
        <div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                Resumen de <span className="text-amber-500">Ventas</span>
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Caja diaria por barbero</p>
        </div>
        <Link to="/" className="text-zinc-400 border border-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-800 transition-all text-xs font-bold uppercase">
            ← Inicio
        </Link>
      </div>

      {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-[3rem]">
              <p className="text-zinc-600 font-black uppercase italic">No hay ventas activas para liquidar</p>
          </div>
      ) : (
        Object.entries(grouped).map(([barber, dates]) => (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={barber} 
                className="mb-8 bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-800 shadow-2xl relative overflow-hidden"
            >
                {/* Letra decorativa de fondo */}
                <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none">
                    <h1 className="text-[12rem] font-black italic uppercase">{barber[0]}</h1>
                </div>
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                        <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Personal de Barbería</p>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">{barber}</h3>
                    </div>
                    <Link 
                        to={`/admin/historial/${encodeURIComponent(barber.toLowerCase())}`}
                        className="bg-amber-500 text-black text-[10px] font-black py-3 px-6 rounded-2xl uppercase hover:scale-105 transition-transform shadow-lg shadow-amber-500/20"
                    >
                        Ver Detalles
                    </Link>
                </div>
        
                <div className="grid gap-2 relative z-10">
                    {Object.entries(dates).map(([date, total]) => (
                        <div key={date} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                            <span className="text-zinc-400 font-bold text-sm italic">{date}</span>
                            <span className="text-green-400 font-black text-lg">{formatCurrency(total)}</span>
                        </div>
                    ))}
                    
                    {/* Total acumulado del barbero en este resumen */}
                    <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center px-4">
                        <span className="text-white font-black uppercase text-xs">Total Pendiente</span>
                        <span className="text-white font-black text-xl">
                            {formatCurrency(Object.values(dates).reduce((a, b) => a + b, 0))}
                        </span>
                    </div>
                </div>
            </motion.div>
        ))
      )}
    </div>
  );
}