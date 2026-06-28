import { db, auth } from "./firebase-config.js";

let modalBoleta = null;
let boletaInfo = null;
let cerrarBoleta = null;
let btnCompartir = null;

let pedidoActual = null;

// =========================================
// OBTENER FECHA SEGURO
// =========================================

function obtenerFechaSegura(fecha) {

    if (!fecha) return new Date();

    // Firestore Timestamp
    if (fecha.toDate) {
        return fecha.toDate();
    }

    // string o number fallback
    const d = new Date(fecha);

    if (isNaN(d.getTime())) {
        return new Date();
    }

    return d;
}

// =========================================
// INICIALIZAR DOM
// =========================================
document.addEventListener("DOMContentLoaded", () => {

    modalBoleta = document.getElementById("modalBoleta");
    boletaInfo = document.getElementById("boletaInfo");
    cerrarBoleta = document.getElementById("cerrarBoleta");
    btnCompartir = document.getElementById("btnCompartirPedido");

    cerrarBoleta?.addEventListener(
        "click",
        cerrarModal
    );

    // Cerrar tocando el fondo
    modalBoleta?.addEventListener("click", e => {

        if(e.target===modalBoleta){

            cerrarModal();

        }

    });

    // Compartir comprobante
    btnCompartir?.addEventListener("click", compartirBoleta);

});





// =========================================
// ABRIR BOLETA PREMIUM
// =========================================
export function verPedido(pedido){

    const modal=document.getElementById("modalBoleta");
    const info=document.getElementById("boletaInfo");

    if(!modal || !info)return;

    pedidoActual=pedido;

    const fecha = obtenerFechaSegura(pedido.fecha);

    const fechaTexto=fecha.toLocaleDateString(
        "es-PE",
        {
            day:"2-digit",
            month:"long",
            year:"numeric"
        }
    );

    const horaTexto=fecha.toLocaleTimeString(
        "es-PE",
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

    const numeroPedido=(pedido.id || "000000")
        .substring(0,8)
        .toUpperCase();

    let html=`

    <div class="estado-pedido">

        <div class="estado-icono">
            ✔
        </div>

        <div class="estado-texto">

            <h3>Pedido confirmado</h3>

            <span>
                Gracias por comprar en AIERTO
            </span>

        </div>

    </div>

    <div class="datos-grid">

        <div class="dato-card">

            <span>Pedido</span>

            <strong>#${numeroPedido}</strong>

        </div>

        <div class="dato-card">

            <span>Estado</span>

            <strong>${pedido.estado}</strong>

        </div>

        <div class="dato-card">

            <span>Fecha</span>

            <strong>${fechaTexto}</strong>

        </div>

        <div class="dato-card">

            <span>Hora</span>

            <strong>${horaTexto}</strong>

        </div>

        <div class="dato-card">

            <span>Cliente</span>

            <strong>${pedido.nombreCliente}</strong>

        </div>

        <div class="dato-card">

            <span>Pago</span>

            <strong>${pedido.metodoPago}</strong>

        </div>

    </div>

    <div class="lista-productos">
    `;

    (pedido.productos || []).forEach(producto=>{

        const imagen=
            producto.imagen ||
            "https://via.placeholder.com/90x90?text=🍰";

        html+=`

        <div class="producto-card">

            <img
                src="${imagen}"
                class="producto-img">

            <div class="producto-info">

                <h4>
                    ${producto.nombre}
                </h4>

                <p>

                    Cantidad:
                    <strong>${producto.cantidad}</strong>

                </p>

                <p>

                    Precio Unit.

                    S/
                    ${Number(producto.precio).toFixed(2)}

                </p>

            </div>

            <div class="producto-precio">

                <strong>

                    S/
                    ${(producto.precio*producto.cantidad).toFixed(2)}

                </strong>

                <span>

                    Subtotal

                </span>

            </div>

        </div>

        `;

    });

    html+=`

    </div>

    <div class="boleta-total">

        <small>

            TOTAL PAGADO

        </small>

        <strong>

            S/
            ${(pedido.total||0).toFixed(2)}

        </strong>

    </div>

    `;

    info.innerHTML=html;

    modal.classList.add("activo");

    document.body.classList.add("modal-open");

}


// =========================================
// CERRAR MODAL
// =========================================
function cerrarModal(){

    const modal=document.getElementById("modalBoleta");

    if(!modal)return;

    modal.classList.remove("activo");

    document.body.classList.remove("modal-open");

}



// =========================================
// CERRAR CON ESC
// =========================================
document.addEventListener("keydown",e=>{

    if(e.key==="Escape"){

        cerrarModal();

    }

});



// =========================================
// CERRAR TOCANDO AFUERA
// =========================================
document.addEventListener("click",e=>{

    const modal=document.getElementById("modalBoleta");

    if(!modal)return;

    if(
        e.target===modal &&
        modal.classList.contains("activo")
    ){

        cerrarModal();

    }

});



// =========================================
// COLORES SEGÚN ESTADO
// =========================================
export function obtenerClaseEstado(estado){

    estado=(estado || "").toUpperCase();

    switch(estado){

        case "ACEPTADO":
            return "estado-aceptado";

        case "ENTREGADO":
            return "estado-entregado";

        case "CANCELADO":
            return "estado-cancelado";

        default:
            return "estado-pendiente";

    }

}



// =========================================
// ICONO MÉTODO DE PAGO
// =========================================
export function obtenerIconoPago(tipo){

    if(!tipo)return "💳";

    tipo=tipo.toUpperCase();

    if(tipo==="QR")
        return "📱";

    if(tipo==="YAPE")
        return "🟣";

    if(tipo==="PLIN")
        return "🟢";

    if(tipo==="EFECTIVO")
        return "💵";

    if(tipo==="TRANSFERENCIA")
        return "🏦";

    return "💳";

}



// =========================================
// FORMATO MONEDA
// =========================================
export function moneda(valor){

    return "S/ " + Number(valor).toFixed(2);

}



// =========================================
// FORMATO FECHA
// =========================================
export function fechaBonita(fecha){

    return new Date(fecha).toLocaleDateString(

        "es-PE",

        {

            day:"2-digit",

            month:"long",

            year:"numeric"

        }

    );

}



// =========================================
// EXPORT GLOBAL
// =========================================
window.verPedido=verPedido;
