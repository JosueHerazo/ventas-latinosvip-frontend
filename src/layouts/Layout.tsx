import { Outlet, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faInstagram} from '@fortawesome/free-brands-svg-icons'
import latinosvip from "../assets/latinosvip.jpg"


export default function Layout() {
  return (
    <>
       
        <header className=" Header flex  justify-between flex-col content-center items-center h-50
         sm:flex-row  mb-5 mx-1  hover:text-yellow-200 shadow-xl bg-black">
            <Link to="/inicio">
                <img src={latinosvip} alt="Logo" className='text-3xl size-60 w-30 ml-2 h-30 rounded-2xl' />
            </Link>
            <h1 className="text-uppercase font-extrabold text-white animate-pulse">Bienvenidos a LatinosVip</h1>

            <div className='flex justify-end my-2 mr-10 text-white uppercase text-2xl font-extrabold pt-40'>
                <h1 className="ml-20  hover:text-yellow-200 shadow-xl">
                    <FontAwesomeIcon icon={faInstagram} /> LatinosVip1
                </h1>
            </div>
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
        </header>
        <main className="mx-auto  max-w-6xl py-10 bg-black shadow">
                    <Outlet/>
        </main>
    </>
  )
}
