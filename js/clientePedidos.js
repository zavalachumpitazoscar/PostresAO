// ===============================
// CLIENTE PEDIDOS - JS
// PARTE 1: INICIALIZACIÓN Y CARGA
// ===============================

// Referencias DOM
const contenedorPedidos = document.getElementById("contenedorPedidos");
const inputBuscar = document.getElementById("buscarPedido");

// Estado global
let pedidosGlobal = [];

// ===============================
// CARGAR PEDIDOS (INICIAL)
// ===============================
async function cargarMisPedidos() {
    try {
        contenedorPedidos.innerHTML = "<p>Cargando pedidos...</p>";

        // EJEMPLO: aquí debes reemplazar con tu Firebase o API
        const respuesta = await fetch("/api/pedidos");
        const data = await respuesta.json();

        pedidosGlobal = data;

        renderizarPedidos(pedidosGlobal);

    } catch (error) {
        console.error("Error cargando pedidos:", error);
        contenedorPedidos.innerHTML = "<p>Error al cargar pedidos</p>";
    }
}

window.cargarMisPedidos = cargarMisPedidos;

// ===============================
// RENDER PRINCIPAL
// ===============================
function renderizarPedidos(pedidos) {
    contenedorPedidos.innerHTML = "";

    if (!pedidos || pedidos.length === 0) {
        contenedorPedidos.innerHTML = "<p>No tienes pedidos registrados</p>";
        return;
    }

    pedidos.forEach(pedido => {
        const card = crearCardPedido(pedido);
        contenedorPedidos.appendChild(card);
    });
}


// ===============================
// CLIENTE PEDIDOS - JS
// PARTE 2: CARD DEL PEDIDO
// ===============================

// ===============================
// CREAR CARD PEDIDO
// ===============================
function crearCardPedido(pedido) {

    const card = document.createElement("div");
    card.classList.add("pedido-card");

    // Estado
    const estadoClass = obtenerClaseEstado(pedido.estado);

    // Productos HTML
    const productosHTML = (pedido.productos || [])
        .map(p => `
            <div class="producto-item">
                <div class="producto-nombre">${p.nombre}</div>
                <div class="producto-cantidad">x${p.cantidad}</div>
                <div class="producto-precio">S/ ${(p.precio * p.cantidad).toFixed(2)}</div>
            </div>
        `).join("");

    card.innerHTML = `
        <div class="pedido-header">
            <div class="pedido-id">Pedido #${pedido.id || "N/A"}</div>
            <div class="pedido-fecha">
                ${formatearFecha(pedido.fecha)}
            </div>
        </div>

        <div class="pedido-estado ${estadoClass}">
            ${pedido.estado || "PENDIENTE"}
        </div>

        <div class="pedido-productos">
            ${productosHTML}
        </div>

        <div class="pedido-total">
            Total: S/ ${(pedido.total || 0).toFixed(2)}
        </div>

        <div class="pedido-acciones">
            <button class="btn btn-ver" onclick="verPedido('${pedido.id}')">
                Ver
            </button>

            <button class="btn btn-cancelar" onclick="cancelarPedido('${pedido.id}')">
                Cancelar
            </button>
        </div>
    `;

    return card;
}

// ===============================
// ESTADO VISUAL
// ===============================
function obtenerClaseEstado(estado) {
    switch ((estado || "").toUpperCase()) {
        case "PENDIENTE":
            return "estado-pendiente";
        case "COMPLETADO":
            return "estado-completado";
        case "CANCELADO":
            return "estado-cancelado";
        default:
            return "estado-pendiente";
    }
}

// ===============================
// FORMATEAR FECHA
// ===============================
function formatearFecha(fecha) {

    if (!fecha) return "Sin fecha";

    const f = fecha.toDate ? fecha.toDate() : new Date(fecha);

    return f.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// ===============================
// CLIENTE PEDIDOS - JS
// PARTE 3: ACCIONES + BÚSQUEDA + EVENTOS
// ===============================

// ===============================
// BÚSQUEDA DE PEDIDOS
// ===============================
inputBuscar?.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase().trim();

    const filtrados = pedidosGlobal.filter(p => {
        const id = String(p.id || "").toLowerCase();
        const estado = String(p.estado || "").toLowerCase();

        return (
            id.includes(texto) ||
            estado.includes(texto)
        );
    });

    renderizarPedidos(filtrados);
});

// ===============================
// VER PEDIDO (DETALLE)
// ===============================
function verPedido(id) {
    const pedido = pedidosGlobal.find(p => p.id == id);

    if (!pedido) {
        alert("Pedido no encontrado");
        return;
    }

    console.log("DETALLE PEDIDO:", pedido);

    // Aquí puedes abrir modal si quieres
    alert(
        `Pedido #${pedido.id}\n` +
        `Estado: ${pedido.estado}\n` +
        `Total: S/ ${(pedido.total || 0).toFixed(2)}`
    );
}

// ===============================
// CANCELAR PEDIDO
// ===============================
async function cancelarPedido(id) {
    const confirmar = confirm("¿Seguro que deseas cancelar este pedido?");

    if (!confirmar) return;

    try {
        // 🔴 AQUÍ CONECTA TU BACKEND O FIREBASE
        // ejemplo:
        // await fetch(`/api/pedidos/${id}`, { method: "DELETE" });

        pedidosGlobal = pedidosGlobal.map(p => {
            if (p.id == id) {
                return { ...p, estado: "CANCELADO" };
            }
            return p;
        });

        renderizarPedidos(pedidosGlobal);

        alert("Pedido cancelado correctamente");

    } catch (error) {
        console.error("Error cancelando pedido:", error);
        alert("Error al cancelar pedido");
    }
}

// ===============================
// INICIALIZAR
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    cargarMisPedidos();
});
