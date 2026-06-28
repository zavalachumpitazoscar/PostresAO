import { db, auth } from "./firebase-config.js";

let modalBoleta = null;
let boletaInfo = null;
let cerrarBoleta = null;
let btnCompartir = null;

let pedidoActual = null;

// ===============================
// INIT DOM
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    modalBoleta = document.getElementById("modalBoleta");
    boletaInfo = document.getElementById("boletaInfo");
    cerrarBoleta = document.getElementById("cerrarBoleta");
    btnCompartir = document.getElementById("btnCompartirPedido");

    cerrarBoleta?.addEventListener("click", cerrarModal);

btnCompartir?.addEventListener("click", async () => {

    if (!pedidoActual) return;

    const elemento = document.querySelector(".boleta-contenido");

    if (!elemento) return;

    try {

        const canvas = await html2canvas(elemento, {
            scale: 2,
            backgroundColor: "#ffffff"
        });

        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, "image/png");
        });

        const file = new File([blob], "boleta.png", {
            type: "image/png"
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {

            await navigator.share({
                title: "Mi pedido",
                files: [file]
            });

        } else {
            alert("Tu dispositivo no soporta compartir imágenes");
        }

    } catch (e) {
        console.error(e);
        alert("Error al generar imagen");
    }
});
});

// ===============================
// ABRIR BOLETA PREMIUM
// ===============================
export function verPedido(pedido){

    const modal=document.getElementById("modalBoleta");
    const info=document.getElementById("boletaInfo");

    if(!modal||!info)return;

    pedidoActual=pedido;

    const fecha=new Date(
        pedido.fecha ||
        pedido.fechaPedido ||
        Date.now()
    );

    const fechaTexto=fecha.toLocaleDateString("es-PE",{
        day:"2-digit",
        month:"long",
        year:"numeric"
    });

    const horaTexto=fecha.toLocaleTimeString("es-PE",{
        hour:"2-digit",
        minute:"2-digit"
    });

    let html=`

    <div class="estado-pedido">

        <div class="estado-icono">
            ✓
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

            <span>Fecha</span>

            <strong>${fechaTexto}</strong>

        </div>

        <div class="dato-card">

            <span>Hora</span>

            <strong>${horaTexto}</strong>

        </div>

    </div>

    <div class="lista-productos">
    `;


    (pedido.productos||[]).forEach(producto=>{

        const imagen=
            producto.imagen ||
            producto.img ||
            producto.foto ||
            "img/producto.png";

        html+=`

        <div class="producto-card">

            <img
                src="${imagen}"
                class="producto-img">

            <div class="producto-info">

                <h4>${producto.nombre}</h4>

                <p>

                    Cantidad:
                    ${producto.cantidad}

                </p>

                <p>

                    Precio:
                    S/
                    ${Number(producto.precio).toFixed(2)}

                </p>

            </div>

            <div class="producto-precio">

                <strong>

                    S/
                    ${(producto.precio*producto.cantidad).toFixed(2)}

                </strong>

                <span>Total</span>

            </div>

        </div>

        `;

    });

    html+=`

    </div>

    <div class="boleta-total">

        <small>TOTAL PAGADO</small>

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

// ===============================
// CERRAR
// ===============================
function cerrarModal() {

    const modal = document.getElementById("modalBoleta");

    if (!modal) return;

    modal.classList.remove("activo");
    document.body.classList.remove("modal-open");
}

// ===============================
// ESC PARA CERRAR
// ===============================
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        cerrarModal();
    }
});

// ===============================
// EXPORT GLOBAL
// ===============================
window.verPedido = verPedido;
