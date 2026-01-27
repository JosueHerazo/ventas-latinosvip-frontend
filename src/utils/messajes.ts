// src/utils/messaging.ts

export const enviarWhatsApp = (telefono: string, nombre: string, tipo: 'pago' | 'cita' | 'ausente') => {
    if (!telefono) {
        alert("El cliente no tiene un número de teléfono registrado.");
        return;
    }

    const enlaceCitas = `${window.location.origin}/reservar`;
    
    // Configuramos los diferentes mensajes
    const mensajes = {
        pago: `¡Hola ${nombre}! 💈 Tu pago ha sido registrado con éxito en la Barbería. ¡Gracias por tu visita!`,
        cita: `¡Hola ${nombre}! 📅 Tu cita ha sido confirmada. Te esperamos. Puedes gestionar tus reservas aquí: ${enlaceCitas}`,
        ausente: `¡Hola ${nombre}! 💈 Te extrañamos en la barbería. ¿Listo para renovar tu corte? Reserva tu lugar aquí: ${enlaceCitas}`
    };

    const mensajeFinal = mensajes[tipo];
    
    // Limpiar el teléfono: quita espacios, guiones y asegura que solo queden números
    const telefonoLimpio = telefono.replace(/\D/g, '');

    // Abrir WhatsApp con el mensaje pre-cargado
    const url = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensajeFinal)}`;
    window.open(url, '_blank');
};