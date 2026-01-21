import { Link, useLoaderData} from "react-router-dom"
import { getServices } from "../services/ServiceService";
import ServiceDetails from "../componenents/ServiceDetail";
import {type Service} from "../types"

export async function loader() {
  const services = await getServices()
  return services
}

export default function Services() {

  const services = useLoaderData() as Service[]

  return (
    <>
    <div className="flex justify-between ">
        <h2 className="text-4xl  hover:text-3xl font-black text-amber-600">Servicios</h2>
        <Link to={"/lista/citas"}>
          Lista de Citas
        </Link>
        <Link 
        className="rounded-md bg-amber-700 hover:bg-green-400 hover:text-3xl p-3 font-bold text-white shadow-sm " 
        to="nuevo/servicio">
           Pagar servicio     
        </Link>
     
    </div>
    <div className="p-2 overflow-x-auto shadow-amber-600">
      <table className="min-w-[700px] mt-5 shadow-amber-600 ">
      <thead className="bg-amber-800 text-white font-black shadow">
          <tr className="">
              
              <th className="p-2">ID</th>
              <th className="p-2">Servicio</th>
              <th className="p-2">Precio</th>
              <th className="p-2 ">Barbero</th>
              <th className="p-2 ">Cliente</th>
              <th className="p-2 ">Telefono</th>
              <th className="p-2 ">Fecha</th>
              <th className="p-2 ">Editar</th>
              <th className="p-2 ">Eliminar</th>
              {/* <th className="p-2 ">Editar</th> */}
          </tr>
      </thead>
      <tbody>
        {services.map(service => (
          <ServiceDetails
          key={service.id}
          service={service}
          />
        ))}
      </tbody>
    </table>
</div>
    </>
  )
}
