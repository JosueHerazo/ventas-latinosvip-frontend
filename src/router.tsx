import {createBrowserRouter} from "react-router-dom"
import Layout from "./layouts/Layout"
import NewService, {action as newServiceAction} from "./pages/NewService"
import Service, {loader as servicesLoader} from "./pages/Services"
import EditService , {loader as editServiceLoader, action as editServiceAction } from "./pages/EditProduct"
import { action as DeleteServiceAction } from "./componenents/ServiceDetail"
import BarberSummary, {loader as barberPagoLoader} from "./pages/BarberSummary"
import BarberServices, {loader as barberServicesLoader} from "./pages/BarberServices"
import SearchClients, {loader as searchClintsLoader} from "./pages/SearchClients"
import DatesList, {loader as DateListLoader}from "./pages/DatesList"


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {   
                index: true,
                element:<Service/>,
                loader: servicesLoader
            },
            {   
                path: "nuevo/servicio",
                element:<NewService/>,
                action: newServiceAction,
            },
            {
                path: "/servicios/:id/editar",
                element: <EditService/>,
                action: editServiceAction,
                loader: editServiceLoader
            },
            {
                path: "/servicios/:id/eliminar",
                action: DeleteServiceAction
            },
            {
                path: "/pago/barberos",
                element: <BarberSummary/>,
                loader: barberPagoLoader
            },
            {
                path: "/barberos/:barber",
                element: <BarberServices/>,
                loader: barberServicesLoader,
            },
            {
                path: "/buscar/clientes",
                element: <SearchClients/>,
                loader: searchClintsLoader,
            },
            {
                path: "lista/citas",
                element: <DatesList/>,
                loader: DateListLoader,
            }
        ]
    }
])

export default router