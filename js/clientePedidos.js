// ===============================
// CLIENTE PEDIDOS - JS
// PARTE 1: INICIALIZACIÓN Y CARGA
// ===============================

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { db, auth } from "./firebase-config.js";

// Referencias DOM
const contenedorPedidos = document.getElementById("contenedorMisPedidos");
const inputBuscar = document.getElementById("buscarPedido");


// Estado global
let pedidosGlobal = [];

// ===============================
// CARGAR PEDIDOS (FIREBASE REAL)
// ===============================
async function cargarMisPedidos() {
    try {
        contenedorPedidos.innerHTML = "<p>Cargando pedidos...</p>";

        if (!auth.currentUser) return;

        const q = query(
            collection(db, "pedidos"),
            where("usuarioId", "==", auth.currentUser.uid)
        );

        const consulta = await getDocs(q);

        pedidosGlobal = [];

        consulta.forEach((docSnap) => {
            pedidosGlobal.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        });

        aplicarFiltros();

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

        aplicarFiltros();

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

    const sidebar = document.querySelector(".sidebar");
    const btnMenu = document.getElementById("btnMenu");
    const overlay = document.getElementById("overlay");

    if (!btnMenu || !sidebar || !overlay) return;

    btnMenu.onclick = () => {
        sidebar.classList.toggle("activo");
        overlay.classList.toggle("activo");
    };

    overlay.onclick = () => {
        sidebar.classList.remove("activo");
        overlay.classList.remove("activo");
    };
});


window.verPedido = verPedido;
window.cancelarPedido = cancelarPedido;


// ===============================
// FILTRO
// ===============================

function aplicarFiltros() {

    const texto = inputBuscar.value.toLowerCase().trim();
    const fechaFiltro = document.getElementById("filtroFecha").value;
    const estadoFiltro = document.getElementById("filtroEstado").value;
    const orden = document.getElementById("ordenPedidos").value;

    let filtrados = [...pedidosGlobal];

    // ======================
    // BUSCADOR
    // ======================
    if (texto) {
        filtrados = filtrados.filter(p =>
            String(p.id || "").toLowerCase().includes(texto) ||
            String(p.estado || "").toLowerCase().includes(texto)
        );
    }

    // ======================
    // ESTADO
    // ======================
    if (estadoFiltro) {
        filtrados = filtrados.filter(p =>
            (p.estado || "").toUpperCase() === estadoFiltro
        );
    }

    // ======================
    // FECHA
    // ======================
    if (fechaFiltro) {
        filtrados = filtrados.filter(p => {
            const f = p.fecha?.toDate
                ? p.fecha.toDate()
                : new Date(p.fecha);

            return f.toISOString().split("T")[0] === fechaFiltro;
        });
    }

    // ======================
    // ORDEN
    // ======================
    if (orden === "recientes") {
        filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }

    if (orden === "antiguos") {
        filtrados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }

    if (orden === "mayor") {
        filtrados.sort((a, b) => (b.total || 0) - (a.total || 0));
    }

    if (orden === "menor") {
        filtrados.sort((a, b) => (a.total || 0) - (b.total || 0));
    }

    renderizarPedidos(filtrados);
}
// ===============================
// FIN
// ===============================
