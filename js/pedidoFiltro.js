const modalBoleta = document.getElementById("modalBoleta");
const boletaInfo = document.getElementById("boletaInfo");
const cerrarBoleta = document.getElementById("cerrarBoleta");
const btnCompartir = document.getElementById("btnCompartirPedido");

let pedidoActual = null;

// ABRIR BOLETA
export function verPedido(pedido){

    pedidoActual = pedido;

    let html = "";

    pedido.productos.forEach(p => {
        html += `
        <div class="boleta-item">
            <span>${p.nombre} x${p.cantidad}</span>
            <span>S/ ${(p.precio * p.cantidad).toFixed(2)}</span>
        </div>`;
    });

    html += `
        <div class="boleta-total">
            TOTAL: S/ ${pedido.total.toFixed(2)}
        </div>
    `;

    boletaInfo.innerHTML = html;
    modalBoleta.classList.add("activo");
};

// CERRAR
cerrarBoleta.onclick = () => {
    modalBoleta.classList.remove("activo");
};

// COMPARTIR (CELULAR TOP)
btnCompartir.onclick = async () => {

    if (!pedidoActual) return;

    let texto = `🧾 PEDIDO\n\n`;

    pedidoActual.productos.forEach(p => {
        texto += `• ${p.nombre} x${p.cantidad} = S/ ${(p.precio * p.cantidad).toFixed(2)}\n`;
    });

    texto += `\nTOTAL: S/ ${pedidoActual.total.toFixed(2)}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: "Mi pedido",
                text: texto
            });
        } catch (e) {
            console.log("Cancelado");
        }
    } else {
        // fallback
        await navigator.clipboard.writeText(texto);
        alert("Pedido copiado al portapapeles");
    }
};
