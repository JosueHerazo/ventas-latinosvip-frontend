import { useState, useEffect } from "react";
import { Form, type ActionFunctionArgs, redirect, useActionData, useSearchParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { addProduct } from "../services/ServiceService"
import ErrorMessaje from "../componentes/ErrorMessaje";

// --- DATOS INICIALES ---
const INITIAL_SERVICES = [
    { nombre: "Corte", precio: 13 },
    { nombre: "Corte con cejas", precio: 15 },
    { nombre: "Corte con barba", precio: 18 },
    { nombre: "Corte Vip", precio: 25 },
    { nombre: "Barba", precio: 8 },
    { nombre: "Barba VIP", precio: 11 },
    { nombre: "Cejas", precio: 5 },
    { nombre: "Mechas", precio: 30 },
    { nombre: "Tinte", precio: 30 },
    { nombre: "Trenzas", precio: 20 },
    { nombre: "Mask Carbon", precio: 3 },
    { nombre: "Limpieza Facial", precio: 15 },
    { nombre: "Diseño", precio: 3 },
    { nombre: "Lavado de Cabello", precio: 2 },
    { nombre: "Otros", precio: 0 },
];

const INITIAL_BARBERS = ["Josue", "Bryan"];

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    if (Object.values(data).includes("")) return "Todos los campos son obligatorios"

    // Convertimos el precio a número para la API/DB
    await addProduct({ ...data, price: String(data.price) })
    return redirect("/")
}

export default function NewService() {
    const error = useActionData() as string;
    const [searchParams] = useSearchParams();

    // --- PERSISTENCIA CON LOCALSTORAGE ---
    const [servicios, setServicios] = useState(() => {
        const saved = localStorage.getItem("servicios_barber");
        return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    });

    const [barberos, setBarberos] = useState(() => {
        const saved = localStorage.getItem("barberos_barber");
        return saved ? JSON.parse(saved) : INITIAL_BARBERS;
    });

    useEffect(() => {
        localStorage.setItem("servicios_barber", JSON.stringify(servicios));
    }, [servicios]);

    useEffect(() => {
        localStorage.setItem("barberos_barber", JSON.stringify(barberos));
    }, [barberos]);

    // --- ESTADOS DEL FORMULARIO ---
    const [selectedService, setSelectedService] = useState(searchParams.get("service") || "");
    const [price, setPrice] = useState<number | string>("");
    const [showAdmin, setShowAdmin] = useState(false);

    useEffect(() => {
        const encontrado = servicios.find((s: any) => s.nombre === selectedService);
        if (encontrado) setPrice(encontrado.precio);
    }, [selectedService, servicios]);

    // --- FUNCIONES DE GESTIÓN ---
    const handleAddBarber = () => {
        const nombre = prompt("Nombre del nuevo barbero:");
        if (nombre) setBarberos([...barberos, nombre]);
    };

    const handleAddService = () => {
        const nombre = prompt("Nombre del servicio:");
        const precio = prompt("Precio del servicio:");
        if (nombre && precio) {
            setServicios([...servicios, { nombre, precio: Number(precio) }]);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 max-w-lg mx-auto bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-amber-500 uppercase italic">
                    Pagar <span className="text-white">Servicio</span>
                </h2>
                <button 
                    type="button"
                    onClick={() => setShowAdmin(!showAdmin)}
                    className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1.5 rounded-full hover:text-amber-500 transition-colors"
                >
                    {showAdmin ? "Cerrar Ajustes" : "⚙️ Ajustes"}
                </button>
            </div>

            {/* --- PANEL DE ADMINISTRACIÓN --- */}
            <AnimatePresence>
                {showAdmin && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-8 space-y-4 p-4 bg-zinc-900/50 rounded-3xl border border-zinc-800"
                    >
                        {/* Gestión Barberos */}
                        <div>
                            <p className="text-amber-500 font-bold text-[10px] uppercase mb-2">Gestionar Barberos</p>
                            <div className="flex flex-wrap gap-2">
                                {barberos.map((b: string) => (
                                    <button 
                                        key={b} 
                                        onClick={() => setBarberos(barberos.filter((barber: string) => barber !== b))}
                                        className="bg-zinc-800 text-white text-[10px] px-2 py-1 rounded-lg border border-zinc-700 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                                    >
                                        {b} ✕
                                    </button>
                                ))}
                                <button onClick={handleAddBarber} className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-lg border border-amber-500/20 font-bold">+ Nuevo</button>
                            </div>
                        </div>

                        {/* Gestión Servicios */}
                        <div>
                            <p className="text-amber-500 font-bold text-[10px] uppercase mb-2">Gestionar Servicios</p>
                            <div className="flex flex-wrap gap-2">
                                {servicios.map((s: any) => (
                                    <button 
                                        key={s.nombre} 
                                        onClick={() => setServicios(servicios.filter((serv: any) => serv.nombre !== s.nombre))}
                                        className="bg-zinc-800 text-white text-[10px] px-2 py-1 rounded-lg border border-zinc-700 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                                    >
                                        {s.nombre} (${s.precio}) ✕
                                    </button>
                                ))}
                                <button onClick={handleAddService} className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-lg border border-amber-500/20 font-bold">+ Nuevo</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {error && <ErrorMessaje>{error}</ErrorMessaje>}

            <Form method="POST" className="flex flex-col gap-5">
                {/* SELECT BARBERO */}
                <div className="space-y-1">
                    <label className="text-amber-500 text-[10px] font-black uppercase ml-1">Barbero</label>
                    <select name="barber" className="w-full font-bold text-white rounded-xl p-3 bg-zinc-900 border border-zinc-800 outline-none focus:border-amber-500 appearance-none">
                        <option value="">Selecciona Barbero...</option>
                        {barberos.map((barbero: string) => (
                            <option key={barbero} value={barbero}>{barbero}</option>
                        ))}
                    </select>
                </div>

                {/* SELECT SERVICIO Y PRECIO */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-amber-500 text-[10px] font-black uppercase ml-1">Servicio</label>
                        <select 
                            name="service" 
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="w-full font-bold text-white rounded-xl p-3 bg-zinc-900 border border-zinc-800 outline-none focus:border-amber-500 appearance-none"
                        >
                            <option value="">Selecciona...</option>
                            {servicios.map((s: any) => (
                                <option key={s.nombre} value={s.nombre}>{s.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-amber-500 text-[10px] font-black uppercase ml-1">Precio ($)</label>
                        <input 
                            name="price" 
                            type="number" 
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full font-bold text-white rounded-xl p-3 bg-zinc-900 border border-zinc-800 outline-none focus:border-amber-500" 
                        />
                    </div>
                </div>

                {/* DATOS CLIENTE */}
                <div className="space-y-4 bg-zinc-900/40 p-5 rounded-3xl border border-zinc-800/50">
                    <div className="space-y-1">
                        <label className="text-amber-500 text-[10px] font-black uppercase ml-1">Nombre Cliente</label>
                        <input name="client" type="text" defaultValue={searchParams.get("client") || ""} className="w-full font-bold text-white rounded-xl p-3 bg-zinc-800 border border-zinc-700 outline-none focus:border-amber-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-amber-500 text-[10px] font-black uppercase ml-1">Teléfono</label>
                        <input name="phone" type="number" defaultValue={searchParams.get("phone") || ""} className="w-full font-bold text-white rounded-xl p-3 bg-zinc-800 border border-zinc-700 outline-none focus:border-amber-500" />
                    </div>
                </div>

                <button type="submit" className="mt-4 bg-amber-600 hover:bg-amber-500 p-4 text-black font-black rounded-xl uppercase transition-all shadow-lg shadow-amber-900/20 active:scale-95">
                    Confirmar y Registrar Pago ✓
                </button>

                <Link to="/" className="text-center text-zinc-500 text-xs font-bold hover:text-white uppercase">
                    Volver al inicio
                </Link>
            </Form>
        </motion.div>
    )
}