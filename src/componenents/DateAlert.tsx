import { useEffect, useRef, useState } from "react";
import { getDatesList } from "../services/serviceDate";
import { toast } from "react-toastify";

export function useCitaAlert() {
    const [pendientesCount, setPendientesCount] = useState(0);
    const lastCount = useRef<number | null>(null);

    useEffect(() => {
        const checkNewDates = async () => {
            try {
                const dates = await getDatesList();
                const pendientes = dates.filter(c => !c.isPaid).length;
                setPendientesCount(pendientes);

                if (lastCount.current === null) {
                    lastCount.current = pendientes;
                    return;
                }

                if (pendientes > lastCount.current) {
                    toast.info("💈 ¡NUEVA CITA RECIBIDA!", {
                        icon: () => "🔥",
                        // Usamos style para evitar el error de progressStyle
                        style: { border: '1px solid #d97706' },
                        className: "rounded-2xl bg-zinc-900 text-white font-bold",
                    });
                    
                    new Audio("/notification.mp3").play().catch(() => {}); 
                }
                lastCount.current = pendientes;
            } catch (error) {
                console.error(error);
            }
        };

        checkNewDates(); // Carga inicial
        const interval = setInterval(checkNewDates, 30000);
        return () => clearInterval(interval);
    }, []);

    return pendientesCount; // Retornamos el número para la burbuja
}