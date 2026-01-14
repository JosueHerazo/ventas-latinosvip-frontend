import { useLoaderData } from "react-router-dom";
import { getServices } from "../services/ServiceService";
import type { Service } from "../types";

export async function loader() {
  const services = await getServices();
  // Filtrar solo los campos necesarios
  const summary = services.map(service => ({
    service: service.service,
    price: service.price,
    barber: service.barber,
    createdAt: service.createdAt,
  }));
  return summary;
}

export default function BarberSummary() {
      const services = useLoaderData() as Service[];
       // Agrupar por barber y fecha
  const grouped = services.reduce<Record<string, Record<string, number>>>((acc, cur) => {
    const date = new Date(cur.createdAt).toLocaleDateString();
    if (!acc[cur.barber]) acc[cur.barber] = {};
    if (!acc[cur.barber][date]) acc[cur.barber][date] = 0;
    acc[cur.barber][date] += cur.price;
    return acc;
  }, {});
  return (
    <>
        <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-amber-600 mb-4">Resumen por Barbero</h2>
      {Object.entries(grouped).map(([barber, dates]) => (
        <div key={barber} className="mb-6">
          <h3 className="text-2xl font-bold text-white">{barber}</h3>
          <table className="min-w-full mt-2 table-auto bg-amber-700 text-white rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Total Ganado   
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dates).map(([date, total]) => (
                <tr key={date} className="text-center">
                  <td className="p-2 border">{date}</td>
                  <td className="p-2 border">${total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  

    </>
  )
}
