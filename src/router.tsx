import { createBrowserRouter } from "react-router-dom"
import Layout from "./layouts/Layout"
import NewService, { action as newServiceAction } from "./pages/NewService"
import Service, { loader as servicesLoader } from "./pages/Services"
import EditService, { loader as editServiceLoader, action as editServiceAction } from "./pages/EditProduct"
import { action as DeleteServiceAction } from "./componenents/ServiceDetail"
import BarberSummary, { loader as barberPagoLoader } from "./pages/BarberSummary"
import BarberServices, { loader as barberServicesLoader } from "./pages/BarberServices"
import SearchClients, { loader as searchClintsLoader } from "./pages/SearchClients"
import DatesList, { loader as DateListLoader } from "./pages/DateClient"
// 1. Importa tu nueva página de historial
import VentasTotales from "./pages/VentasTotales" 
import BarberHistory from "./componenents/BarberHistory"
import EditDate, { loader as editDateLoader, action as editDateAction } from "./pages/EditDate"
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        hydrateFallbackElement: <div>Cargando...</div>,
        children: [
            { index: true, element: <Service />, loader: servicesLoader },
            { 
                path: "nuevo/servicio", 
                element: <NewService />, 
                action: newServiceAction 
            },
            {
                path: "servicios/:id/editar",
                element: <EditService />,
                action: editServiceAction,
                loader: editServiceLoader
            },
            {
                path: "servicios/:id/eliminar",
                action: DeleteServiceAction
            },
            {
                path: "/pago/barberos",
                element: <BarberSummary />,
                loader: barberPagoLoader
            },
            {
                path: "/barberos/:barber",
                element: <BarberServices />,
                loader: barberServicesLoader,
            },
            {
                path: "/buscar/clientes",
                element: <SearchClients />,
                loader: searchClintsLoader,
            },
            {
                path: "lista/citas",
                element: <DatesList />,
                loader: DateListLoader,
            },// Rutas sugeridas
            {   
            path: "barbero/:barber",
            element: <BarberServices />, // La que ya tienes (Semana actual)
            },
            {
            path: "historial/:barber",
            element: <BarberHistory />, // La nueva (Meses/Años)
            },
            // Ejemplo de configuración de rutas
            {
            path: "/admin/historial/:barber", // El :barber es la clave
            element: <BarberHistory />,
            loader: servicesLoader, // El loader que ya tienes
            },
            // 2. AÑADIMOS LA RUTA DE VENTAS TOTALES (HISTORIAL)
            {
                path: "/admin/ventas-totales",
                element: <VentasTotales />
            },
            // En tu router.tsx, dentro de children: [ ... ]
{
    path: "admin/citas/editar/:id", // Nota: Sin el "/" inicial si es hijo del Layout
    element: <EditDate/>, // Asegúrate de crear este componente
    loader: editDateLoader, // Y su loader
    action: editDateAction  // Y su acción
},
        ]
    }
])

export default router