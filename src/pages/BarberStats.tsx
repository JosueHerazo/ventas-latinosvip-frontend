import { useLoaderData } from "react-router-dom";
import { formatCurrency } from "../utils";
import { type Service } from "../types";

export default function BarberStats() {
    const services = useLoaderData() as Service[];
    
    // Agrupar por mes para el resumen histórico
    const statsPorMes = services.reduce((acc, curr) => {
        const mes = new Date(curr.createdAt).toLocaleString('es-ES', { month: 'long' });
        acc[mes] = (acc[mes] || 0) + Number(curr.price);
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                <h3 className="text-amber-500 font-black uppercase mb-4">Ventas por Mes</h3>
                {Object.entries(statsPorMes).map(([mes, total]) => (
                    <div key={mes} className="flex justify-between border-b border-zinc-800 py-3">
                        <span className="capitalize">{mes}</span>
                        <span className="font-bold text-green-400">{formatCurrency(total)}</span>
                    </div>
                ))}
            </div>
            
            <div className="bg-amber-600 p-6 rounded-3xl text-black flex flex-col justify-center items-center">
                <p className="font-black text-xs uppercase opacity-70">Total Acumulado</p>
                <p className="text-5xl font-black italic">
                    {formatCurrency(services.reduce((acc, s) => acc + Number(s.price), 0))}
                </p>
            </div>
        </div>
    );
}