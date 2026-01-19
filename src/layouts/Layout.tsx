import { Outlet, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faInstagram} from '@fortawesome/free-brands-svg-icons'
import latinosvip from "../assets/latinosvip.jpg"


export default function Layout() {
  return (
    <>
       
      <header className="flex flex-col md:flex-row justify-between items-center min-h-[12rem] md:h-40 mb-5 mx-1 bg-black shadow-xl shadow-amber-600 p-4">
    {/* Contenedor del Logo */}
    <div className="flex-1 flex justify-center md:justify-start">
        <Link to="/">
            <img 
                src={latinosvip} 
                alt="Logo" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover" 
            />
        </Link>
    </div>

    {/* Contenedor del Título Central */}
    <div className="flex-1 text-center my-4 md:my-0">
        <h2 className="text-xl md:text-2xl font-extrabold text-white animate-pulse uppercase">
            Bienvenidos a LatinosVip
        </h2>
    </div>

    {/* Contenedor de Instagram */}
    <div className="flex-1 flex justify-center md:justify-end text-white uppercase text-xl md:text-2xl font-extrabold">
        <h2 className="hover:text-yellow-200 transition-colors flex items-center gap-2">
            <FontAwesomeIcon icon={faInstagram} className="text-amber-500" /> 
            <span>LatinosVip1</span>
        </h2>
    </div>
</header>
        <main className="mx-auto  max-w-6xl py-10 bg-black shadow">
                    <Outlet/>
        </main>
    </>
  )
}

            {/* <nav className='flex flex-wrap justify-end sm:justify-start  mr-2 ml-2 my-2 text-white uppercase text-2xl  shadow-xl'>
                <Link to="/inicio" className='mx-2  hover:text-yellow-200'>Barberos</Link>

                <Link to="/artistas" className='mx-2  hover:text-yellow-200'>Clientes</Link> */}
{/* 
                < Link to="/coverup" className='mx-2  hover:text-yellow-200'>Cover Up</Link>

                <Link to="/trabajos" className='mx-2  hover:text-yellow-200'>Trabajos</Link>

                <Link to="/videos" className='mx-2  hover:text-yellow-200'>Videos</Link>

                <Link to="/noticias" className='mx-2  hover:text-yellow-200'>Noticias</Link>

            //     <Link to="/contacto" className='mx-2  hover:text-yellow-200'>Contacto</Link> */}
            {/* // </nav> */}