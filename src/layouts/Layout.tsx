import { Outlet, Link, useLocation, useLoaderData } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faCut, faCalendarCheck, faChartLine, faUser } from '@fortawesome/free-solid-svg-icons';
import latinosvip from "../assets/latinosvip.jpg";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import type { DateList } from "../types";
import { useEffect, useState } from "react";
import { getDatesList } from "../services/serviceDate"; 
// import { useEffect, useRef } from "react";
export async function loader() {
  const data = await getDatesList()
  return data
}
export default function Layout() {
    const data = useLoaderData() as DateList[] || [];
    const [notificacion, setNotificacion] = useState(false); // Ahora se usará para el aviso de "Nuevas"
    const { pathname } = useLocation();
    const { scrollY } = useScroll();

    useEffect(() => {
        const checkNewDates = async () => {
            const freshData = await getDatesList();
            const lastCount = localStorage.getItem('last_dates_count') || "0";
            
            // Si hay más citas que la última vez que abrimos la lista, activamos el aviso
            if (freshData.length > parseInt(lastCount)) {
                setNotificacion(true);
            }
        };
        checkNewDates();
    }, []);

    const headerHeight = useTransform(scrollY, [0, 100], ["12rem", "6rem"]);
    const logoScale = useTransform(scrollY, [0, 100], [1, 0.6]);
    
    const linkStyle = "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all";
    const activeStyle = "bg-amber-600 text-black shadow-lg shadow-amber-900/40";
    const inactiveStyle = "text-zinc-500 hover:text-white hover:bg-zinc-900";

    const limpiarNotificacion = () => {
        setNotificacion(false);
        localStorage.setItem('last_dates_count', data.length.toString());
    };

    // Contador dinámico para el badge rojo
    const citasPendientes = data.length;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black">
            <ToastContainer 
                theme="dark" 
                position="top-right"
                toastClassName={() => "relative flex p-1 rounded-xl justify-between overflow-hidden cursor-pointer bg-zinc-900 text-white border border-amber-600 mb-2 shadow-2xl"}
            />

            {/* HEADER DINÁMICO */}
            <motion.header 
                style={{ height: headerHeight }}
                className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-amber-600/30 px-6 flex items-center justify-between transition-all"
            >
                {/* Logo e Info de Citas a la izquierda */}
                <div className="flex-1 flex items-center gap-4">
                    <motion.div style={{ scale: logoScale }}>
                        <Link to="/" className="relative group">
                            <div className="absolute -inset-1 bg-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition"></div>
                            <img src={latinosvip} alt="Logo" className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-zinc-800" />
                        </Link>
                    </motion.div>
                </div>

                <div className="flex-1 text-center hidden md:block">
                    <motion.h2 className="text-xl font-black uppercase tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-500 to-white">
                        Latinos <span className="text-white">Vip</span>
                    </motion.h2>
                </div>

                <div className="flex-1 flex justify-end">
                    <a href="#" className="flex items-center gap-2 group hover:text-amber-500 transition-all font-black text-sm uppercase italic">
                        <FontAwesomeIcon icon={faInstagram} className="text-xl text-amber-500 group-hover:scale-125 transition-transform" /> 
                        <span className="hidden sm:block">@LatinosVip</span>
                    </a>
                </div>
            </motion.header>

            {/* NAVEGACIÓN PRINCIPAL */}
            <nav className="flex justify-center gap-2 md:gap-8 py-4 bg-zinc-950/50 sticky top-[6rem] z-40 backdrop-blur-sm border-b border-zinc-900">
                <Link to="/" className={`${linkStyle} ${pathname === "/" ? activeStyle : inactiveStyle}`}>
                    <FontAwesomeIcon icon={faChartLine} /> Ventas
                </Link>

                {/* LINK DE CITAS CON BADGE ROJO Y AVISO NARANJA */}
                <Link 
                    to="/lista/citas" 
                    onClick={limpiarNotificacion}
                    className={`relative ${linkStyle} ${pathname === "/lista/citas" ? activeStyle : inactiveStyle}`}
                >
                    {/* 1. BADGE ROJO (Total de citas a la izquierda) */}
                    {citasPendientes > 0 && (
                        <motion.span 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute -top-2 -left-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-lg border border-red-400"
                        >
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative">{citasPendientes}</span>
                        </motion.span>
                    )}

                    {/* 2. PUNTO NARANJA (Aviso de Citas Nuevas a la derecha) */}
                    {notificacion && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                    )}

                    <FontAwesomeIcon icon={faCalendarCheck} /> Citas
                </Link>

                <Link to="/nuevo/servicio" className={`${linkStyle} ${pathname === "/nuevo/servicio" ? activeStyle : inactiveStyle}`}>
                    <FontAwesomeIcon icon={faCut} /> Cobrar
                </Link>

                <Link to="/buscar/clientes" className={`${linkStyle} ${pathname === "/buscar/clientes" ? activeStyle : inactiveStyle}`}>
                    <FontAwesomeIcon icon={faUser} /> Clientes
                </Link>
            </nav>

            <main className="relative mx-auto max-w-6xl px-4 py-12 min-h-[70vh]">
                <Outlet />
            </main>
        </div>
    );
}