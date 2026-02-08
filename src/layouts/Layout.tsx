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

export default function Layout() {
    const data = useLoaderData() as DateList[] || [];
    const [notificacion, setNotificacion] = useState(false);
    const { pathname } = useLocation();
    const { scrollY } = useScroll();

    useEffect(() => {
        const checkNewDates = async () => {
            const data = await getDatesList();
            const lastCount = localStorage.getItem('last_dates_count') || "0";
            
            if (data.length > parseInt(lastCount)) {
                setNotificacion(true);
            }
        };
        checkNewDates();
    }, []);
    // Asegura que sea un array    
    // const prevCountRef = useRef(data.length);
    // const pendientes = data.filter(c => c.isPaid === false || c.isPaid === null);  
    // const totalPendientes = pendientes.length;
    //   useEffect(() => {
        //         if (totalPendientes > prevCountRef.current) {
            //             const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            //             audio.play().catch(() => {}); // El catch evita errores si el usuario no ha interactuado
            //         }
            //     }, [pendientes]); // Solo suena si el número de pendientes cambia
            // Efecto de encogimiento para el header al hacer scroll
            const headerHeight = useTransform(scrollY, [0, 100], ["12rem", "6rem"]);
            const logoScale = useTransform(scrollY, [0, 100], [1, 0.6]);
            
            // Estilo base para los links para no repetir código
            const linkStyle = "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all";
            const activeStyle = "bg-amber-600 text-black shadow-lg shadow-amber-900/40";
            const inactiveStyle = "text-zinc-500 hover:text-white hover:bg-zinc-900";
            
          
    const limpiarNotificacion = () => {
        setNotificacion(false);
        // Actualizamos el contador para que sepa que ya las vimos
        localStorage.setItem('last_dates_count', data.length.toString());
    };
    return (
        
        <div className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black">
            {/* Contenedor de Alertas Configurado para no dar error de TS */}
            <ToastContainer 
                theme="dark" 
                position="top-right"
                toastClassName={() => "relative flex p-1 min-h-10 rounded-xl justify-between overflow-hidden cursor-pointer bg-zinc-900 text-white border border-amber-600 mb-2 shadow-2xl"}
            />

            {/* HEADER DINÁMICO */}
            <motion.header 
                style={{ height: headerHeight }}
                className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-amber-600/30 px-6 flex items-center justify-between transition-all"
            >
                <nav>
            <Link 
                to="/lista/citas" 
                onClick={limpiarNotificacion} // <--- Esto limpia el punto naranja
                className={`relative ${linkStyle} ${pathname === "/lista/citas" ? activeStyle : inactiveStyle}`}
            >
                <FontAwesomeIcon icon={faCalendarCheck} />
                
                {notificacion && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                )}
            </Link>
        </nav>
                {/* Logo */}
                <motion.div style={{ scale: logoScale }} className="flex-1 flex justify-start">
                    <Link to="/" className="relative group">
                        <div className="absolute -inset-1 bg-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition"></div>
                        <img 
                            src={latinosvip} 
                            alt="Logo" 
                            className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-zinc-800" 
                        />
                    </Link>
                </motion.div>

                {/* Título Central */}
                <div className="flex-1 text-center hidden md:block">
                    <motion.h2 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-xl font-black uppercase tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-500 to-white"
                    >
                        Latinos <span className="text-white">Vip</span>
                    </motion.h2>
                </div>

                {/* Redes Sociales */}
                <div className="flex-1 flex justify-end">
                    <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 group hover:text-amber-500 transition-all font-black text-sm uppercase italic"
                    >
                        <FontAwesomeIcon icon={faInstagram} className="text-xl text-amber-500 group-hover:scale-125 transition-transform" /> 
                        <span className="hidden sm:block">@LatinosVip</span>
                    </a>
                </div>
            </motion.header>

            {/* NAVEGACIÓN CON BURBUJA DE CITAS */}
            <nav className="flex justify-center gap-2 md:gap-8 py-4 bg-zinc-950/50 sticky top-[6rem] z-40 backdrop-blur-sm border-b border-zinc-900">
                <Link 
                    to="/" 
                    className={`${linkStyle} ${pathname === "/" ? activeStyle : inactiveStyle}`}
                >
                    <FontAwesomeIcon icon={faChartLine} /> Ventas
                </Link>

                <Link 
                    to="/lista/citas" 
                    className={`relative ${linkStyle} ${pathname === "/lista/citas" ? activeStyle : inactiveStyle}`}
                >
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    Citas
                </Link>

                <Link 
                    to="/nuevo/servicio" 
                    className={`${linkStyle} ${pathname === "/nuevo/servicio" ? activeStyle : inactiveStyle}`}
                    >
                    <FontAwesomeIcon icon={faCut} /> Cobrar
                </Link>
                <Link 
                    to={"buscar/clientes"}  
                    className={`${linkStyle} ${pathname === "/nuevo/servicio" ? activeStyle : inactiveStyle}`}
                    >
                        
                    <FontAwesomeIcon icon={faUser} /> Clientes
                </Link>
            </nav>

            {/* CONTENIDO PRINCIPAL */}
            <main className="relative mx-auto max-w-6xl px-4 py-12 min-h-[70vh]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(217,119,6,0.08),transparent_50%)] pointer-events-none"></div>
                
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.div>
            </main>

            {/* FOOTER */}
            <footer className="mt-20 border-t border-zinc-900 bg-zinc-950 p-10 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                            Sistema Operativo - LatinosVip v3.0
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
                //     {totalPendientes > 0 && (
                //       <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-2 rounded-full animate-bounce">
                //           {totalPendientes}
                //       </span>
                //   )}