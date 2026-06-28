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
// ABRIR BOLETA
// ===============================
export function verPedido(pedido) {

    const modal = document.getElementById("modalBoleta");
    const info = document.getElementById("boletaInfo");

    if (!modal || !info) return;

    pedidoActual = pedido;

    let html = "";

    (pedido.productos || []).forEach(p => {
        html += `
        <div class="boleta-item">
            <span>${p.nombre} x${p.cantidad}</span>
            <span>S/ ${(p.precio * p.cantidad).toFixed(2)}</span>
        </div>`;
    });

    html += `
        <div class="boleta-total">
            TOTAL: S/ ${(pedido.total || 0).toFixed(2)}
        </div>
    `;

    info.innerHTML = html;

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
