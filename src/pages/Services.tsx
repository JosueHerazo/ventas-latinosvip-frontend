import { Link, useLoaderData } from "react-router-dom"
import { motion } from "framer-motion"
import { getServices } from "../services/ServiceService";
import ServiceDetails from "../componenents/ServiceDetail";
import { type Service } from "../types"

export async function loader() {
  const services = await getServices()
  return services
}

export default function Services() {
  const services = useLoaderData() as Service[]

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4 lg:p-8"
    >
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div>
          <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">
            Ventas <span className="text-amber-500">Realizadas</span>
          </h2>
          <p className="text-zinc-500 font-bold text-sm uppercase ml-1">Historial de servicios y cobros</p>
        </div>

        <div className="flex gap-3">
          <Link 
            className="rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 p-4 font-black text-zinc-300 shadow-xl transition-all uppercase text-xs flex items-center gap-2" 
            to={"lista/citas"}
          >
            📅 Citas
          </Link>
          <Link 
            className="rounded-2xl bg-amber-600 hover:bg-amber-500 p-4 font-black text-black shadow-lg shadow-amber-900/20 transition-all uppercase text-xs flex items-center gap-2" 
            to="nuevo/servicio"
          >
            <span>+</span> Pagar Servicio
          </Link>
        </div>
      </div>

      {/* CONTENEDOR DE TABLA DINÁMICA */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-950 rounded-[2.5rem] border border-zinc-900 overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                <th className="p-5 text-amber-500 text-[10px] font-black uppercase italic">ID</th>
                <th className="p-5 text-amber-500 text-[10px] font-black uppercase italic">Servicio</th>
                <th className="p-5 text-amber-500 text-[10px] font-black uppercase italic">Precio</th>
                <th className="p-5 text-amber-500 text-[10px] font-black uppercase italic text-center">Barbero</th>
                <th className="p-5 text-amber-500 text-[10px] font-black uppercase italic">Cliente / Tel.</th>
                <th className="p-5 text-amber-500 text-[10px] font-black uppercase italic">Fecha</th>
                <th className="p-5 text-amber-500 text-[10px] font-black uppercase italic text-center">Acciones</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-zinc-900">
              {services.length > 0 ? (
                services.map((service, index) => (
                  <motion.tr 
                    key={service.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-zinc-900/30 transition-colors group"
                  >
                    <ServiceDetails service={service} />
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-20 text-center text-zinc-600 font-bold uppercase text-sm tracking-widest">
                    No hay servicios registrados hoy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* RESUMEN RÁPIDO (Opcional) */}
      <div className="mt-6 flex justify-end">
        <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-3 rounded-2xl">
          <p className="text-zinc-500 text-[10px] font-black uppercase">Total del día</p>
          <p className="text-2xl font-black text-white">
            ${services.reduce((acc, curr) => acc + Number(curr.price), 0).toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}