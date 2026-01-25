import { useLoaderData } from "react-router-dom";
import type { DateList } from "../types";
import { getDatesList } from "../services/ServiceService";
import { formatCurrency } from "../utils";

export async function loader() {
  const datelist = await getDatesList()
  return datelist
}

// / 1. Crea una pequeña función de ayuda fuera del componente o impórtala
// const formatFriendlyDate = (date: any) => {
//     if (!date) return "Sin fecha"; // Si es null, muestra este texto
    
//     const d = new Date(date);
//     if (isNaN(d.getTime())) return "Fecha inválida"; // Por si el string está mal
    
//     return d.toLocaleDateString('es-ES', {
//         day: '2-digit',
//         month: 'long',
//         year: 'numeric'
//     });
// }

export default function DateClient() {
    // Obtenemos los datos del loader
    const datelist = useLoaderData() as DateList[];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-amber-500 mb-6 uppercase tracking-widest border-b-2 border-amber-500 pb-2">
                Próximas Citas y Cobros
            </h1>

            <div className="overflow-x-auto shadow-2xl rounded-lg border border-amber-900/20">
                <table className="w-full text-left bg-zinc-900 text-gray-200">
                    <thead className="bg-amber-600 text-black uppercase text-sm">
                        <tr>
                            <th className="p-4">Servicio</th>
                            <th className="p-4">Barbero</th>
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/30">
                        {datelist.length > 0 ? (
                            datelist.map((cita) => (
                                <tr key={cita.id} className="hover:bg-amber-500/10 transition-colors">
                                    <td className="p-4 font-semibold text-amber-400">
                                        {cita.service}
                                    </td>
                                    <td className="p-4 italic">
                                        {cita.barber}
                                    </td>
                                 <td className="p-4">
                                {(cita.dateList)}
                                </td>
                                    <td className="p-4 font-bold text-green-500">
                                        {formatCurrency(cita.price)}
                                    </td>
                                    <td className="p-4">
                                        <button className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-1 rounded font-bold text-xs uppercase transition-all">
                                            Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-gray-500">
                                    No hay citas registradas actualmente.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Ejemplo de botón para ir al formulario de registro si lo necesitas */}
            {/* <div className="mt-8">
                <Form method="post">
                    <button className="bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold py-3 px-6 rounded-lg transition-all duration-300">
                        Agendar Nueva Cita
                    </button>
                </Form>
            </div> */}
        </div>
    );
}