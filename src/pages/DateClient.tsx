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
   // En DateClient.tsx
const liquidarVenta = async (cita: any) => {
    const confirmar = confirm(`¿Confirmar cobro de ${formatCurrency(cita.price)}?`);
    if (!confirmar) return;

    const ventaData = {
        citaId: cita.id,
        barbero: cita.barber,
        monto: cita.price,
        // ... otros datos
        isPaid: true // Indicamos que ya se cobró
    };
    try {
        await registrarCobro(ventaData);
        alert("Venta Liquidada");
        navigate(0); // Recargar para actualizar la tabla
    } catch (error) {
        console.error(error);
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
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {datelist.filter(c => !c.isPaid).map((cita) => ( // FILTRO PARA NO MOSTRAR PAGADOS
                            <tr key={cita.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-amber-400">{cita.service}</td>
                                <td className="p-4 italic">{cita.barber}</td>
                                <td className="p-4 font-black">{formatCurrency(cita.price)}</td>
                                <td className="p-4">{cita.client}</td>
                                <td className="p-4 text-center">
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
                {datelist.filter(c => !c.isPaid).length === 0 && (
                    <p className="text-center p-10 text-zinc-500 uppercase font-bold">No hay cobros pendientes</p>
                )}
            </div>
        </div>
    );
}   
