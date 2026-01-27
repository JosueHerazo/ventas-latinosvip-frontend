import { Outlet, Link, useLocation } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faCut, faCalendarCheck, faChartLine } from '@fortawesome/free-solid-svg-icons'
import latinosvip from "../assets/latinosvip.jpg"

export default function Layout() {
    const { pathname } = useLocation();
    const { scrollY } = useScroll();
    
    // Efecto de encogimiento para el header al hacer scroll
    const headerHeight = useTransform(scrollY, [0, 100], ["12rem", "6rem"]);
    const logoScale = useTransform(scrollY, [0, 100], [1, 0.6]);

    const navLinks = [
        { to: "/", label: "Ventas", icon: faChartLine },
        { to: "/lista/citas", label: "Citas", icon: faCalendarCheck },
        { to: "/nuevo/servicio", label: "Cobrar", icon: faCut },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black">
            
            {/* HEADER DINÁMICO CON FRAMER MOTION */}
            <motion.header 
                style={{ height: headerHeight }}
                className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-amber-600/30 px-6 flex items-center justify-between transition-all"
            >
                {/* Logo con escalado dinámico */}
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

                {/* Título Central Dinámico */}
                <div className="flex-1 text-center hidden md:block">
                    <motion.h2 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-xl font-black uppercase tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-500 to-white"
                    >
                        Latinos <span className="text-white">Vip</span>
                    </motion.h2>
                </div>

                {/* Redes Sociales / Instagram */}
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

            {/* NAV DE ACCESO RÁPIDO (Estilo App) */}
            <nav className="flex justify-center gap-2 md:gap-8 py-4 bg-zinc-950/50 sticky top-[6rem] z-40 backdrop-blur-sm border-b border-zinc-900">
                {navLinks.map((link) => (
                    <Link 
                        key={link.to} 
                        to={link.to}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                            pathname === link.to 
                            ? "bg-amber-600 text-black shadow-lg shadow-amber-900/40" 
                            : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                        }`}
                    >
                        <FontAwesomeIcon icon={link.icon} />
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* MAIN CON TRANSICIONES */}
            <main className="relative mx-auto max-w-6xl px-4 py-12 min-h-[70vh]">
                {/* Decoración de fondo */}
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

            {/* FOOTER DINÁMICO */}
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
                    <p className="text-zinc-700 text-xs">
                        &copy; {new Date().getFullYear()} Creado para los mejores barberos.
                    </p>
                </div>
            </footer>
        </div>
    )
}