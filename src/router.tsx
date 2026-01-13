import {createBrowserRouter} from "react-router-dom"
import Layout from "./layouts/Layout"
import NewService, {action as newServiceAction} from "./pages/NewService"
import Service, {loader as servicesLoader} from "./pages/Services"
import EditService , {loader as editServiceLoader, action as editServiceAction } from "./pages/EditProduct"
import { action as DeleteServiceAction } from "./componenents/ServiceDetail"


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
                action: newServiceAction
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
            }
        ]
    }
])