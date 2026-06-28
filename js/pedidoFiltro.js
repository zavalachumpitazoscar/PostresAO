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
