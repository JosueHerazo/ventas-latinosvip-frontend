import { useLoaderData, useParams,Link } from "react-router-dom";
import { getServices } from "../services/ServiceService";
import type { Service } from "../types";
import { formatCurrency, formatDate } from "../utils";

export async function loader() {
    // Obtenemos todos los servicios
    const services = await getServices();
    return services;
}

export default function BarberServices() {
    const services = useLoaderData() as Service[];
    const { barber } = useParams(); // Obtenemos el nombre del barbero de la URL

    // // Filtramos los servicios por el barbero seleccionado
    // const servicesbarber = services.filter(
    //     (service) => service.barber === barber
    // );
    // Lógica para obtener el lunes de la semana actual
    const getStartOfWeek = () => {
        const now = new Date();
        const day = now.getDay(); // 0 (Dom) a 6 (Sab)
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para que el Lunes sea el día 1
        const monday = new Date(now.setDate(diff));
        monday.setHours(0, 0, 0, 0); // Resetear a medianoche
        return monday;
    };
    const startOfWeek = getStartOfWeek();
    // Filtramos: 1. Por Barbero, 2. Por Fecha (Posterior al Lunes 00:00)
    const servicesbarber = services.filter((service) => {
        const serviceDate = new Date(service.createdAt);
        return service.barber === barber && serviceDate >= startOfWeek;
    });
    // --- CÁLCULOS DE TOTALES ---
    const totalSemana = servicesbarber.reduce((acc, cur) => acc + cur.price, 0);
    const comisionBarbero = totalSemana * 0.50; // El 50% solicitado

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold text-amber-600 mb-4">
                Servicios de: <span className="text-white">{barber}</span>
            </h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-zinc-900 text-white rounded-lg overflow-hidden border border-amber-600/30">
                    <thead>
                        <tr className="bg-amber-700">
                            <th className="p-3 border-b border-amber-600">Cliente</th>
                            <th className="p-3 border-b border-amber-600">Servicio</th>
                            <th className="p-3 border-b border-amber-600">Fecha</th>
                            <th className="p-3 border-b border-amber-600">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicesbarber.length > 0 ? (
                            servicesbarber.map((service) => (
                                <tr key={service.id} className="text-center border-b border-zinc-800 hover:bg-zinc-800">
                                    <td className="p-3">{service.client}</td>
                                    <td className="p-3">{service.service}</td>
                                    <td className="p-3">{formatDate(service.createdAt)}</td>
                                    <td className="p-3 font-bold text-green-400">{formatCurrency(service.price)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-gray-500">No hay servicios registrados esta semana.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* SECCIÓN DE RESULTADOS FINALES */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 text-center">
                    <p className="text-gray-400 uppercase text-xs font-bold tracking-widest">Total Bruto</p>
                    <p className="text-3xl text-white font-black">
                        {formatCurrency(totalSemana)}
                    </p>
                </div>

                <div className="bg-amber-600/20 p-4 rounded-xl border border-amber-600 text-center">
                    <p className="text-amber-500 uppercase text-xs font-bold tracking-widest">Ganancia (50%)</p>
                    <p className="text-3xl text-green-400 font-black">
                        {formatCurrency(comisionBarbero)}
                    </p>
                </div>
            </div>
            
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <Link className="bg-zinc-700 hover:bg-zinc-600 rounded-xl p-3 font-bold text-white transition-colors" to="/pago/barberos">
                    ← Volver al Resumen
                </Link>
                <p className="text-2xl text-white font-bold bg-amber-600/20 p-4 rounded-xl border border-amber-600">
                    Total Semana: <span className="text-amber-500">{formatCurrency(servicesbarber.reduce((acc, cur) => acc + cur.price, 0))}</span>
                </p>
            </div>
        </div>
    );
}