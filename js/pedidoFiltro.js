import { db, auth } from "./firebase-config.js";

const modalBoleta = document.getElementById("modalBoleta");
const boletaInfo = document.getElementById("boletaInfo");
const cerrarBoleta = document.getElementById("cerrarBoleta");
const btnCompartir = document.getElementById("btnCompartirPedido");

let pedidoActual = null;

// ===============================
// ABRIR BOLETA
// ===============================
export function verPedido(pedido) {

    if (!modalBoleta || !boletaInfo) return;

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

    boletaInfo.innerHTML = html;

    modalBoleta.classList.add("activo");
    document.body.classList.add("modal-open");
}

// ===============================
// CERRAR BOLETA
// ===============================
function cerrarModal() {
    if (!modalBoleta) return;

    modalBoleta.classList.remove("activo");
    document.body.classList.remove("modal-open");
}

// ===============================
// INIT DOM EVENTS
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modalBoleta");
    const cerrar = document.getElementById("cerrarBoleta");
    const compartir = document.getElementById("btnCompartirPedido");

    if (cerrar) {
        cerrar.addEventListener("click", cerrarModal);
    }

    if (compartir) {
        compartir.addEventListener("click", async () => {

            if (!pedidoActual) return;

            let texto = `🧾 PEDIDO\n\n`;

            pedidoActual.productos.forEach(p => {
                texto += `• ${p.nombre} x${p.cantidad} = S/ ${(p.precio * p.cantidad).toFixed(2)}\n`;
            });

            texto += `\nTOTAL: S/ ${(pedidoActual.total || 0).toFixed(2)}`;

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Mi pedido",
                        text: texto
                    });
                } catch (e) {}
            } else {
                await navigator.clipboard.writeText(texto);
                alert("Pedido copiado al portapapeles");
            }
        });
    }
});

// ===============================
// ESC PARA CERRAR
// ===============================
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        cerrarModal();
    }
});

// ===============================
// EXPORT GLOBAL (si lo necesitas)
// ===============================
window.verPedido = verPedido;
