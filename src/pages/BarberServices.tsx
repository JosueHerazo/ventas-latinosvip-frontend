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

    // Filtramos los servicios por el barbero seleccionado
    const servicesbarber = services.filter(
        (service) => service.barber === barber
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold text-amber-600 mb-4">
                Servicios de: <span className="text-white">{barber}</span>
            </h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-amber-700 text-white rounded-lg">
                    <thead>
                        <tr className="bg-amber-800">
                            <th className="p-3 border">Cliente</th>
                            <th className="p-3 border">Servicio</th>
                            <th className="p-3 border">Fecha</th>
                            <th className="p-3 border">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicesbarber.map((service) => (
                            <tr key={service.id} className="text-center border-b border-amber-600">
                                <td className="p-2">{service.client}</td>
                                <td className="p-2">{service.service}</td>
                                <Link to={"/pago/barberos"}>
                                <td className="p-2">{formatDate(service.createdAt)}</td>
                                <td className="p-2 font-bold">{formatCurrency(service.price)}</td>
                                </Link>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-6 text-right">
                <p className="text-2xl text-white font-bold">
                    Total Acumulado: {formatCurrency(servicesbarber.reduce((acc, cur) => acc + cur.price, 0))}
                </p>
            </div>
        </div>
    );
}