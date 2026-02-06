import { Form, useActionData, type ActionFunctionArgs, redirect, type LoaderFunctionArgs, useLoaderData } from "react-router-dom"
import ErrorMessaje from "../componenents/ErrorMessaje"
// Importamos updateDate para usarlo en el action
import { getDatesList, updateDate } from "../services/serviceDate" 
import type { DateList } from "../types"

export async function loader({ params }: LoaderFunctionArgs) {
    if (params.id !== undefined) {
        const dates = await getDatesList()
        const cita = dates.find(d => d.id === +params.id!)
        if (!cita) {
            return redirect("/lista/citas")
        }
        return cita
    }
    return redirect("/lista/citas")
}

export async function action({ request, params }: ActionFunctionArgs) {
    const data = Object.fromEntries(await request.formData())
    
    let error = ""
    if (Object.values(data).includes("")) {
        error = "Todos los campos son obligatorios"
    }
    if (error.length) return error

    if (params.id !== undefined) {
        // USAMOS LA FUNCIÓN IMPORTADA AQUÍ PARA QUE NO DE ERROR DE "UNREAD"
        // Asegúrate de que tu función updateDate en serviceDate acepte (id, data)
        await updateDate(+params.id, data) 
        return redirect("/lista/citas")
    }
}

export default function EditDate() {
    const cita = useLoaderData() as DateList
    const error = useActionData() as string

    const servicios = ["Corte", "Corte de Niño", "Barba", "Cejas", "Otros"];
    const barberos = ["Josue", "Vato"];

    return (
        <div className="p-5">
            <h2 className="text-2xl font-black text-white text-center">Editar Cita</h2>
            {error && <ErrorMessaje>{error}</ErrorMessaje>}

            <Form method="POST" className="mt-10 flex flex-col gap-4 max-w-md mx-auto">
                <div className="mb-4">
                    <label className="text-amber-50 font-bold" htmlFor="service">Servicio</label>
                    <select id="service" name="service" defaultValue={cita.service} className="mt-2 block w-full font-bold text-white rounded-2xl p-3 bg-amber-400">
                        {servicios.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="text-amber-50 font-bold" htmlFor="price">Precio</label>
                    <input id="price" type="number" name="price" defaultValue={cita.price} className="mt-2 font-bold text-white block w-full rounded-2xl p-3 bg-amber-400" />
                </div>

                <div className="mb-4">
                    <label className="text-amber-50 font-bold" htmlFor="barber">Barbero</label>
                    <select id="barber" name="barber" defaultValue={cita.barber} className="mt-2 block w-full font-bold text-white rounded-2xl p-3 bg-amber-400">
                        {barberos.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="text-amber-50 font-bold" htmlFor="client">Cliente</label>
                    <input id="client" type="text" name="client" defaultValue={cita.client} className="mt-2 block w-full p-3 rounded-2xl font-extrabold text-white bg-amber-400" />
                </div>

                <input type="submit" className="mt-5 bg-amber-600 p-2 text-white font-bold text-lg cursor-pointer rounded-4xl hover:bg-amber-700 transition-colors" value="Guardar Cambios" />
            </Form>
        </div>
    )
}