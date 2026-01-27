import { useLoaderData, useParams,Link, useNavigate } from "react-router-dom";
import { archivarSemana, getServices } from "../services/ServiceService";
import type { Service } from "../types";
import {  formatDate } from "../utils";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../utils";

export async function loader() {
    // Obtenemos todos los servicios
    const services = await getServices();
    return services;
}

const generarPDFLiquidacion = (barbero: string, total: number, comision: number, servicios: any[]) => {
    const doc = new jsPDF();

    // 1. Encabezado con Estilo
    doc.setFontSize(22);
    doc.setTextColor(191, 155, 48); // Color Ámbar
    doc.text("BARBERÍA VIP - RECIBO DE PAGO", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Barbero: ${barbero.toUpperCase()}`, 14, 35);

    // 2. Tabla de Servicios
    autoTable(doc, {
        startY: 45,
        head: [['Servicio', 'Cliente', 'Fecha', 'Precio']],
        body: servicios.map(s => [
            s.service, 
            s.client, 
            new Date(s.createdAt).toLocaleDateString(), 
            formatCurrency(s.price)
        ]),
        headStyles: { fillColor: [191, 155, 48] }, // Fondo ámbar en cabecera
        theme: 'striped'
    });

    // 3. Totales al final de la tabla
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Bruto Recaudado: ${formatCurrency(total)}`, 14, finalY);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 197, 94); // Color Verde
    doc.text(`TOTAL A PAGAR (50%): ${formatCurrency(comision)}`, 14, finalY + 10);

    // 4. Firma
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("__________________________", 14, finalY + 30);
    doc.text("Firma del Barbero", 14, finalY + 35);

    // Guardar el PDF
    doc.save(`Liquidacion_${barbero}_${new Date().toLocaleDateString()}.pdf`);
};

export default function BarberServices() {
    const services = useLoaderData() as Service[];
    const { barber } = useParams(); // Obtenemos el nombre del barbero de la URL
const navigate = useNavigate(); // Inicializa la función
   
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
    // Lógica de filtrado y totales (mismo código anterior)
    const servicesbarber = services.filter((service) => {
        const serviceDate = new Date(service.createdAt);
        return service.barber === barber && serviceDate >= startOfWeek;
    });
    const totalSemana = servicesbarber.reduce((acc, cur) => acc + cur.price, 0);
    const comisionBarbero = totalSemana * 0.50;
const finalizarSemana = async () => {
    const confirmar = confirm(`¿Cerrar semana de ${barber}?`);
    
    if (confirmar) {
        const cierreData = {
            barbero: barber || "Desconocido",
            fechaCierre: new Date().toISOString(),
            totalBruto: totalSemana,
            comision50: comisionBarbero,
            serviciosArchivados: servicesbarber.map(s => s.id) 
        };

        try {
            await archivarSemana(cierreData); 

            // --- AQUÍ LLAMAMOS A LA FUNCIÓN QUE DICES QUE NO SE LEE ---
            generarPDFLiquidacion(
                barber || "Sin Nombre", 
                totalSemana, 
                comisionBarbero, 
                servicesbarber
            );

            alert("La semana ha sido liquidada. Se ha descargado el comprobante de pago.");
            navigate("/admin/ventas-totales"); 
        } catch (error) {
            alert("Error al conectar con el servidor de archivos.");
        }
    }
};
// ... en el JSX, debajo de los totales:
<motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={finalizarSemana}
    className="w-full mt-10 bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-[2rem] uppercase tracking-[0.2em] shadow-2xl shadow-red-900/40"
>
    Cerrar Semana y Archivar Caja
</motion.button>
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
           // En la sección de resultados finales de BarberServices:
<div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 flex flex-col items-center">
        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Recaudado</span>
        <p className="text-4xl text-white font-black">{formatCurrency(totalSemana)}</p>
    </div>

    <motion.div 
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="bg-amber-500 p-8 rounded-[2rem] flex flex-col items-center shadow-2xl shadow-amber-500/20"
    >
        <span className="text-black text-[10px] font-black uppercase tracking-widest mb-2">Tu Liquidación (50%)</span>
        <p className="text-4xl text-black font-black italic">{formatCurrency(comisionBarbero)}</p>
    </motion.div>
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
