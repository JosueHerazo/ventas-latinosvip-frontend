import { Link, Form, useActionData, type ActionFunctionArgs, redirect, type LoaderFunctionArgs, useLoaderData } from "react-router-dom"
import ErrorMessaje from "../componenents/ErrorMessaje"
import {  updateService } from "../services/ServiceService"
import { getServiceById } from "../services/ServiceService";
import type { Service } from "../types";



export async function loader({params} : LoaderFunctionArgs) {
    console.log(params.id);
    if(params.id !== undefined){
        const service = await getServiceById(+params.id)

        if(!service){
           return redirect("/")
        }
        return service
    }
    
}



export async function action({request, params} : ActionFunctionArgs){
  
  const data = Object.fromEntries(await request.formData())

    let error = ""
    if(Object.values(data).includes("")){
        error = "Todos los campos son obligatorios"
    }
    if(error.length){
        return error
    }
    if(params.id !== undefined){
        await updateService(data, +params.id)
        console.log(data);
        
        return redirect("/")

    }
}

export default function EditService() {

    const service = useLoaderData() as Service
    const error = useActionData() as string
   // const locatio.//

     const servicios = [
    "Corte",
    "Corte de Niño",
    "Barba",
    "Cejas",
    "Mechas",
    "Tinte",
    "Trenzas",
    "Mask Carbon",
    "Limpieza Facial",
    "Diseño",
    "Lavado de Cabello",
    "Otros",
  ];
  const barberos = ["Josue", "Vato"];
  
  
  return (
  <>
   {error && <ErrorMessaje>{error}</ErrorMessaje>}

      <Form
   method="POST"
    className="mt-10 grid  md:grid-cols-2 gap-6 grid-cols-5 "
    
    >
    <div className="mb-4 ">
        <label
            className="text-amber-50 font-bold"
            htmlFor="service"
        >servicio</label>
        <select 
            id="service"
            className="mt-2 block w-full font-bold text-white hover: rounded-2xl  p-3 bg-amber-400 "
            name="service"
        >
            <option>
                Seleciona un Servicio
            </option>
            { servicios.map((servicio) => 
                
            (

                <option key={servicio} >
                    {servicio}
                    </option>
                
            )
            )}
        </select>
    </div>
    <div className="mb-4">
        <label
            className="text-amber-50 font-bold"
            htmlFor="price"
        >Precio:</label>
        <input 
            id="price"
            type="number"
            className="mt-2 font-bold text-white block w-full rounded-2xl  p-3 bg-amber-400"
            placeholder="Precio Producto. ej. 200, 300"
            name="price"
        />
    </div>
    {/* <div className="mb-4">
        <label
            className="text-amber-50 font-bold"
            htmlFor="date"
        >Fecha:</label>
        <input 
            id="prifechace"
            type="date"
            className="mt-2 block w-full p-3 bg-gray-50 font-bold"
            placeholder="Precio Producto. ej. 200, 300"
            name="date"
             defaultValue={new Date().toISOString().split("T")[0]}
        />
    </div> */}
    <div className="mb-4">
        <label
            className="text-amber-50 font-bold"
            htmlFor="price"
        >Barbero</label>
        <select 
            id="barber"
            className="mt-2 block w-full font-bold text-white rounded-2xl  p-3 bg-amber-400"
            name="barber"
        >
            <option value="">Seleciona Barbero</option>
                {barberos.map((barbero)=>(
            <option key={barbero} >
                    {barbero}
            </option>
                ))}
         </select>
    </div>
    <div className="mb-4">
        <label
            className="text-amber-50 font-bold"
            htmlFor="client"
        >Cliente</label>
        <input 
            id="client"
            type="text"
            className="mt-2 block w-full p-3  rounded-2xl font-extrabold text-white bg-amber-400"
            placeholder="Nombre del cliente"
            name="client"
        />
    </div>
     <div className="mb-4">
        <label
            className="text-amber-50 font-bold"
            htmlFor="phone"
        >Telefono:</label>
        <input 
            id="phone"
            type="number"
            className="mt-2 block w-full p-3 rounded-2xl  font-bold text-white bg-amber-400"
            placeholder="movil del cliente"
            name="phone"
        />
    </div>
     {/* <div className="mb-4">
        <label
            className="text-amber-50 font-bold"
            htmlFor="createdAt"
        >Fecha:</label>
        <input 
            id="createdAt"
            type="date"
            className="mt-2 block w-full p-3 bg-gray-5 0"
            placeholder="movil del cliente"
            name="createdAt"
            defaultValue={new Date().toISOString().split("T")[0]}
        />
    </div> */}
     {/* <div className="mb-4">
        <label
            className="text-amber-50 font-bold"
            htmlFor="createdAt"
        >Telefono:</label>
        <input 
            id="phone"
            type="date"
            className="mt-2 block w-full p-3 bg-gray-50 font-bold"
            placeholder="movil del cliente"
            name="createdAt"
        />
    </div> */}

    <div className=" ">
    <input
      type="submit"
      className="mt-5  bg-amber-600 p-2 text-white font-bold text-lg cursor-pointer rounded-4xl"
      value="Registrar Producto"
      /> 
    </div>
    <br />
 </Form>
 <br />
    <Link className=" bg-amber-600 rounded-4xl p-3 font-bold text-white shadow-sm   hover:bg-indigo-200 " 
    to="/">
           servicios Vendidos      
    </Link>
</>
  )}



