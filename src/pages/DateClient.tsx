import { useLoaderData, useNavigate } from "react-router-dom";
import type { DateList } from "../types";
import { getDatesList, registrarCobro } from "../services/ServiceService"; // Importamos la lógica
import { formatCurrency } from "../utils";

export async function loader() {
    return await getDatesList();
}

export default function DateClient() {
    const datelist = useLoaderData() as DateList[];
    const navigate = useNavigate();

    // AQUÍ VA LA FUNCIÓN
    const liquidarVenta = async (cita: DateList) => {
        const ventaData = {
            fecha: new Date().toISOString(),
            monto: cita.price,
            barbero: cita.barber,
            servicio: cita.service,
            cliente: cita.client,
            telefono: cita.phone,
            metodo: "Efectivo"
        };

        try {
            await registrarCobro(ventaData); // Enviamos los datos al backend
            alert("¡Venta registrada con éxito en la lista de ventas!");
            navigate(0); // Esto refresca la página para actualizar la lista
        } catch (error) {
            alert("Hubo un error al procesar el cobro.");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-black text-amber-500 mb-6 uppercase tracking-tighter">
                Control de Citas y <span className="text-white">Cobros</span>
            </h1>

            <div className="overflow-x-auto shadow-2xl rounded-3xl border border-zinc-800">
                <table className="w-full text-left bg-zinc-900 text-gray-200">
                    <thead className="bg-amber-500 text-black uppercase text-xs font-black">
                        <tr>
                            <th className="p-4">Servicio</th>
                            <th className="p-4">Barbero</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {datelist.map((cita) => (
                            <tr key={cita.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-amber-400">{cita.service}</td>
                                <td className="p-4 italic">{cita.barber}</td>
                                <td className="p-4 font-black">{formatCurrency(cita.price)}</td>
                                <td className="p-4">{cita.client}</td>
                                <td className="p-4 text-center">
                                    {/* EL BOTÓN QUE DISPARA LA FUNCIÓN */}
                                    <button 
                                        onClick={() => liquidarVenta(cita)}
                                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all"
                                    >
                                        Liquidar Venta
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}