import { useLoaderData, Link, } from "react-router-dom";
import { getServices } from "../services/ServiceService";
import type { Service } from "../types";
import { formatCurrency } from "../utils";

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
        <div key={barber} className="mb-8 bg-zinc-900/50 p-4 rounded-xl border border-amber-900/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
                {barber}
            </h3>
            {/* ESTE LINK ES LA CLAVE: Conecta el resumen con el detalle */}
            <Link 
              to={`/barberos/${encodeURIComponent(barber)}`}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-1 px-3 rounded uppercase"
            >
              Ver Detalle Completo
            </Link>
          </div>

          <table className="min-w-full table-auto bg-amber-800/20 text-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-amber-800 text-left">
                <th className="p-3">Fecha</th>
                <th className="p-3 text-right">Ganancia del Día</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dates).map(([date, total]) => (
                <tr key={date} className="border-b border-amber-900/50 hover:bg-amber-900/20">
                  <td className="p-3">{date}</td>
                  <td className="p-3 text-right font-mono font-bold text-green-400">
                    {formatCurrency(total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         
        </div>
      ))}
    </div>
  );
}