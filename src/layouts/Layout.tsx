import { Outlet } from "react-router-dom"
import latinosvip from "../assets/latinosvip.jpg"

export default function Layout() {
  return (
    <>
        <header  className="bg-amber-600 hover:bg-lime-500 "
        
        >

          <div className="mx-auto max-w-6xl py-10 flex justify-center align-baseline"
        
        >
          <img 
          src={latinosvip} alt="latinos VIP"
          className="w-32 h-32 object-cover rounded-full shadow-lg hover:w-2 animate-bounce"
           />
            <h1 className="text-center text-5xl text-amber-50  mb-1 font-extrabold shadow-amber-300 hover:text-4xl">
                        CORTES DEL DIA
                    </h1>
          <img 
          src={latinosvip} alt="latinos VIP"
          className="w-32 h-32 object-cover rounded-full shadow-lg hover:w-2 animate-bounce"
           />
        
           </div>
        </header>
        <main className="mx-auto  max-w-6xl py-10 bg-black shadow">
                    <Outlet/>
        </main>
    </>
  )
}
