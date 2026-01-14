import { useLoaderData, useParams } from "react-router-dom";
import type { Service } from "../types";
import { getServices } from "../services/ServiceService";

export async function loader(){

  const services = await getServices();
  // 🔒 seguridad
  // 1️⃣ Filtrar servicios por barbero
  return services
}



export default function BarberServices() {
  const services = useLoaderData() as Service[];
  const filtered = services.filter(
    (service) => service.barber === service.barber
  );
  const barber = services.map(
    (service) => service.barber === service.barber
  );
  
  // if (!barber) return null;
  // const services = useLoaderData() as Service[]
  
  // 2️⃣ Agrupar por fecha
  const grouped = filtered.reduce<Record<string, Service[]>>(
    (acc, service) => {
      const date = new Date(service.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(service);
      return acc;
    },
    {}
  );
  
  // 3️⃣ Total general del barbero
  const totalGeneral = filtered.reduce(
    (sum, s) => sum + s.price,
    0
  );
  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <h2 className="text-3xl font-bold text-amber-500 mb-4">
        Barbero: {barber}
      </h2>

      <p className="mb-6 text-xl">
        💰 Total General:{" "}
        <span className="font-bold">${totalGeneral}</span>
      </p>

      {Object.entries(grouped).map(([date, items]) => {
        const totalDia = items.reduce(
          (sum, s) => sum + s.price,
          0
        );

        return (
          <div key={date} className="mb-6 bg-amber-700 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">
              📅 {date} — Total: ${totalDia}
            </h3>

            <ul className="space-y-2">
              {items.map((service) => (
                <li
                  key={service.id}
                  className="flex justify-between bg-amber-600 p-2 rounded"
                >
                  <span>{service.service}</span>
                  <span>${service.price}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
