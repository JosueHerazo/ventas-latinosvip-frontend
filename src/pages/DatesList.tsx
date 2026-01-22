import { getDatesPending } from "../services/DateService";
import { useLoaderData } from "react-router-dom";
import type { DateList } from "../types";

export async function loader() {
    const datesList = await getDatesPending();
    return datesList
}

export default function DatesList() {
    
    const datesList = useLoaderData() as DateList[]
    
    return (

        <div className="relative">
           

            {datesList && (
                <div className="absolute top-14 right-0 w-96 bg-zinc-900 border-2 border-amber-400 rounded-2xl shadow-2xl z-50 p-4">
                    <h3 className="text-white font-black uppercase mb-4">Citas del Día</h3>
                    
                    {datesList.length === 0 ? (
                        <p className="text-gray-400">No hay citas pendientes</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {datesList.map(datelist => (
                                <div key={datelist.id} 
                                
                                className="bg-zinc-800 p-3 rounded-lg border-l-4 border-amber-400 flex justify-between items-center">
                                    <div>
                                        <p className="text-white font-bold">{datelist.service}</p>
                                        <p className="text-amber-200 text-sm">Barbero: {datelist.barber}</p>
                                        <p className="text-gray-400 text-xs">{(datelist.list)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-black">{datelist.price}€</p>
                                        <button 
                                            className="text-xs bg-green-600 text-white px-2 py-1 rounded mt-1 hover:bg-green-700"
                                            onClick={() => alert(`Cargando ${datelist.price}€ al total...`)}
                                        >
                                            Cobrar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
    