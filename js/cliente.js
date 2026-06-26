import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    addDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { db, auth } from "./firebase-config.js";

const splash =
    document.getElementById("splashScreen");

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;

    }

    cargarProductos();

    setTimeout(() => {

        splash.classList.add("oculto");

    }, 5200);

});

let productosGlobal = [];

let carrito = {};
let stockTemporal = {};

const vistaCatalogo =
    document.getElementById(
        "vistaCatalogo"
    );

const carritoPanel = document.getElementById("carritoPanel");
const carritoFloatBtn = document.getElementById("carritoFloatBtn");
const cerrarCarrito = document.getElementById("cerrarCarrito");
const carritoCount = document.getElementById("carritoCount");

carritoFloatBtn.addEventListener("click", () => {
    carritoPanel.classList.add("activo");
    actualizarCarrito(); // 👈 OBLIGATORIO
});

cerrarCarrito.addEventListener("click", () => {
    carritoPanel.classList.remove("activo");
});



const vistaPedidos =
    document.getElementById(
        "vistaPedidos"
    );

const contenedorProductos =
    document.getElementById(
        "contenedorProductos"
    );

async function cargarProductos(){

    contenedorProductos.innerHTML = "";
    productosGlobal = [];
    stockTemporal = {};

const user = auth.currentUser;
    if (!user) return;

    const q = query(
        collection(db, "productos"),
        where("activo", "==", true)
    );

    const consulta = await getDocs(q);

    consulta.forEach((registro) => {

        const producto = registro.data();

let fechaTexto = "Sin fecha";

if (producto.fecha) {

    const fecha = new Date(producto.fecha);

    fechaTexto = fecha.toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    // Quitar la coma
    fechaTexto = fechaTexto.replace(",", "");

    // Primera letra en mayúscula
    fechaTexto =
        fechaTexto.charAt(0).toUpperCase() +
        fechaTexto.slice(1);
}

        // ❌ FILTRO PRIMERO (IMPORTANTE)
        if (!producto.activo || producto.stock <= 0) {
            return;
        }

        // ✅ stock solo de productos válidos
        stockTemporal[registro.id] = producto.stock;

        productosGlobal.push({
            id: registro.id,
            ...producto
        });

        const card = document.createElement("div");
        card.classList.add("producto-card");
        card.dataset.id = registro.id;

        card.innerHTML = `
            <img src="${
                producto.imagen
                ? producto.imagen
                : 'https://via.placeholder.com/300x200?text=Sin+Imagen'
            }">

            <div class="producto-info">

                <p>
                    <strong>${producto.nombre}</strong>
                </p>

                <p>
                📅 ${fechaTexto}
                </p>

                <p>
                    S/ ${producto.precio}
                </p>

                <p class="stock-text">
                    Stock: ${stockTemporal[registro.id] ?? producto.stock}
                </p>

            </div>
        `;

        
        const boton = document.createElement("button");
        boton.classList.add("btn-agregar");
        boton.textContent = "Agregar al carrito";

boton.addEventListener("click", () => {

    const stock = stockTemporal[registro.id] || 0;

    if (stock <= 0) {
        alert("Sin stock");
        return;
    }

    if (!carrito[registro.id]) {
        carrito[registro.id] = {
            id: registro.id,
            nombre: producto.nombre,
            precio: producto.precio,
            fecha: producto.fecha || "",
            imagen: producto.imagen || '',
            cantidad: 0
        };
    }

    carrito[registro.id].cantidad++;
    stockTemporal[registro.id]--;

    actualizarCarrito();
    actualizarEstadoBoton(registro.id);
});

        card.appendChild(boton);
        contenedorProductos.appendChild(card);
        actualizarEstadoBoton(registro.id);
    });
}

function actualizarCarrito() {

    
    console.log("Carrito:", carrito);

    const contenedor = document.getElementById("contenedorCarrito");

    console.log("Contenedor:", contenedor);

    const totalEl = document.getElementById("totalPedido");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    const items = Object.values(carrito);

    let total = 0;
    let cantidadTotal = 0;

    if (items.length === 0) {
        contenedor.innerHTML = `
            <div style="
                text-align:center;
                padding:20px;
                opacity:0.6;
            ">
                🛒 Tu carrito está vacío
            </div>
        `;

        carritoCount.textContent = "0";
        if (totalEl) totalEl.textContent = "Total: S/ 0";
        return;
    }

    items.forEach((item) => {

        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        cantidadTotal += item.cantidad;

        const card = document.createElement("div");
        card.className = "cart-mini-card";

        card.innerHTML = `
    <img src="${item.imagen || 'https://via.placeholder.com/60'}" class="cart-img">

    <div class="cart-info">

        <div class="cart-title">
            ${item.nombre}
        </div>

        <div class="cart-meta">
            📅 ${item.fecha || "Sin fecha"}
        </div>

        <div class="cart-meta">
            S/ ${item.precio.toFixed(2)} c/u
        </div>

        <div class="cart-meta subtotal">
            Subtotal: <strong>S/ ${(item.precio * item.cantidad).toFixed(2)}</strong>
        </div>

        <div class="cart-actions">

            <button class="btn-mini minus">−</button>

            <span class="cantidad">${item.cantidad}</span>

            <button class="btn-mini plus">+</button>

            <button class="btn-remove">🗑</button>

        </div>

    </div>
`;

        // ➖
        card.querySelector(".minus").onclick = () => {
            item.cantidad--;

            stockTemporal[item.id] = (stockTemporal[item.id] || 0) + 1;

            if (item.cantidad <= 0) {
                delete carrito[item.id];
            }

            actualizarCarrito();
            actualizarEstadoBoton(item.id);
        };

        // ➕
card.querySelector(".plus").onclick = () => {

    if ((stockTemporal[item.id] || 0) <= 0) return;

    item.cantidad++;
    stockTemporal[item.id]--;

    actualizarCarrito();
    actualizarEstadoBoton(item.id);
};

        // ❌
        card.querySelector(".btn-remove").onclick = () => {
            stockTemporal[item.id] = (stockTemporal[item.id] || 0) + item.cantidad;
            delete carrito[item.id];

            actualizarCarrito();
            actualizarEstadoBoton(item.id);
        };

        contenedor.appendChild(card);
    });

    if (totalEl) {
        totalEl.textContent = "Total: S/ " + total.toFixed(2);
    }

    carritoCount.textContent = cantidadTotal;
}

document
.getElementById(
    "btnCerrarSesion"
)
.addEventListener(
    "click",
    async ()=>{

        await signOut(auth);

        window.location.href =
            "index.html";

    }
);

document.getElementById("btnCatalogo").addEventListener("click", () => {
    vistaCatalogo.style.display = "block";
    vistaPedidos.style.display = "none";

    carritoPanel.classList.remove("activo");
});

document
.getElementById(
    "btnMisPedidos"
)
.addEventListener("click",()=>{

    vistaCatalogo.style.display =
        "none";


    vistaPedidos.style.display =
        "block";

    cargarMisPedidos();
});

function buscarProductos(){

    const texto =
        document.getElementById(
            "buscarProducto"
        )
        .value
        .toLowerCase();

    const cards =
        document.querySelectorAll(
            ".producto-card"
        );

    cards.forEach(card=>{

        const contenido =
            card.textContent
            .toLowerCase();

        if(
            contenido.includes(texto)
        ){
            card.style.display = "block";
        }
        else{
            card.style.display = "none";
        }

    });

}

document
.getElementById(
    "buscarProducto"
)
.addEventListener(
    "keyup",
    buscarProductos
);


function mostrarMensaje(texto){

    const mensaje =
        document.createElement("div");

    mensaje.textContent = texto;

    mensaje.style.position = "fixed";
    mensaje.style.top = "20px";
    mensaje.style.right = "20px";
    mensaje.style.background = "#16a34a";
    mensaje.style.color = "white";
    mensaje.style.padding = "15px";
    mensaje.style.borderRadius = "10px";
    mensaje.style.zIndex = "9999";

    document.body.appendChild(mensaje);

    setTimeout(()=>{
        mensaje.remove();
    },2000);

}

function convertirBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

    });

}

document.getElementById("btnSolicitarPedido").addEventListener("click", async () => {

    if (Object.keys(carrito).length === 0) {
        alert("Carrito vacío");
        return;
    }

    const metodo =
    document.getElementById("metodoPago").value;

if (!metodo) {

    alert("Seleccione método de pago");

    return;
}
const archivo =
    document.getElementById("comprobantePago")
    .files[0];

if (
    metodo === "QR" &&
    !archivo
) {
    alert("Debe adjuntar el comprobante");
    return;
}

if (archivo && archivo.size > 500000) {

    alert(
        "La imagen es muy grande. Máximo 500 KB."
    );

    return;
}

let comprobantePago = "";

if (metodo === "QR") {

    comprobantePago =
        await convertirBase64(archivo);

}

const usuarioRef = doc(
    db,
    "usuarios",
    auth.currentUser.uid
);

const usuarioSnap =
    await getDoc(usuarioRef);

let nombreCliente =
    auth.currentUser.email;

if (usuarioSnap.exists()) {

    nombreCliente =
        usuarioSnap.data().nombreCompleto;
}
    
const pedido = {

    usuarioId: auth.currentUser.uid,

    nombreCliente: nombreCliente,

    correo: auth.currentUser.email,

    productos: Object.values(carrito),

    total: Object.values(carrito).reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    ),

    fecha: new Date(),

    estado: "PENDIENTE",

    metodoPago: metodo,

    comprobantePago: comprobantePago

};

await addDoc(collection(db, "pedidos"), pedido);

// Descontar stock real en Firestore
for (const item of Object.values(carrito)) {

    const refProducto = doc(db, "productos", item.id);

    const snap = await getDoc(refProducto);

    if (snap.exists()) {

        const producto = snap.data();

const nuevoStock =
    Math.max(
        0,
        producto.stock - item.cantidad
    );

        await updateDoc(
            refProducto,
            {
                stock: nuevoStock
            }
        );
    }
}

alert("Pedido enviado correctamente 🎉");

carrito = {};
stockTemporal = {};

actualizarCarrito();
});


function actualizarStockVisual(id){

    const cards = document.querySelectorAll(".producto-card");

    cards.forEach(card => {

        if(card.dataset.id === id){

            const stockText = card.querySelector(".stock-text");

stockText.textContent = `Stock: ${stockTemporal[id] ?? 0}`;
        }
    });
}

function actualizarEstadoBoton(id) {

    const card = document.querySelector(`[data-id="${id}"]`);
    if (!card) return;

    const btn = card.querySelector(".btn-agregar");
    const stockText = card.querySelector(".stock-text");

    const stock = stockTemporal[id] ?? 0;

    if (stock <= 0) {
        btn.disabled = true;
        btn.textContent = "Sin stock";
    } else {
        btn.disabled = false;
        btn.textContent = "Agregar al carrito";
    }

    if (stockText) {
        stockText.textContent = `Stock: ${stock}`;
    }
}


const metodoPago =
    document.getElementById("metodoPago");

const inputArchivo =
    document.getElementById("comprobantePago");

const nombreArchivo =
    document.getElementById("nombreArchivo");

inputArchivo.addEventListener("change", () => {

    if(inputArchivo.files.length){

        nombreArchivo.textContent =
            "✅ " + inputArchivo.files[0].name;

    }else{

        nombreArchivo.textContent =
            "Ningún archivo seleccionado";

    }

});

const bloqueComprobante =
    document.getElementById("bloqueComprobante");

metodoPago.addEventListener("change", () => {

    if (metodoPago.value === "QR") {

        bloqueComprobante.style.display = "block";

    } else {

        bloqueComprobante.style.display = "none";

    }

});


async function cargarMisPedidos() {

    if (!auth.currentUser) return;

    const contenedor =
        document.getElementById("contenedorMisPedidos");

    contenedor.innerHTML = "";

    const q = query(
        collection(db, "pedidos"),
        where("usuarioId", "==", auth.currentUser.uid)
    );

    const consulta = await getDocs(q);

    consulta.forEach((registro) => {

        const pedido = registro.data();

        let comprobanteHTML = "";

        if (
            pedido.metodoPago === "QR" &&
            pedido.comprobantePago
        ) {
            comprobanteHTML = `
                <div class="comprobante-box">
                    <p><strong>Comprobante QR</strong></p>
                    <img src="${pedido.comprobantePago}" class="img-comprobante">
                </div>
            `;
        }

        const card = document.createElement("div");
        card.classList.add("pedido-card");

        let productosHTML = "";

pedido.productos.forEach(producto => {

    const subtotal = producto.precio * producto.cantidad;

    productosHTML += `
        <div class="producto-item">

            <img src="${producto.imagen || 'https://via.placeholder.com/60'}" class="producto-img">

            <div class="producto-info">

                <div class="producto-nombre">
                    ${producto.nombre}
                </div>

                <div class="producto-detalle">
                    ${producto.cantidad} x S/ ${producto.precio}
                </div>

            </div>

            <div class="producto-subtotal">
                S/ ${subtotal.toFixed(2)}
            </div>

        </div>
    `;
});

        const fechaPedido =
            pedido.fecha?.toDate
                ? pedido.fecha.toDate()
                : new Date(pedido.fecha);

        card.innerHTML = `
    <div class="boleta">

        <div class="boleta-header">
            <h3>🧾 Boleta de Pedido</h3>
            <span class="estado ${pedido.estado.toLowerCase()}">
                ${pedido.estado}
            </span>
        </div>

        <div class="boleta-body">

            <p><strong>📅 Fecha:</strong> ${fechaPedido.toLocaleDateString("es-PE")}</p>

            <p><strong>💳 Método:</strong> ${pedido.metodoPago}</p>

            <hr>

            <h4>🛒 Productos</h4>

            <div class="productos-lista">
                ${productosHTML}
            </div>

        </div>

        <div class="boleta-footer">
            <h3>Total: S/ ${pedido.total}</h3>
        </div>

        ${comprobanteHTML}

    </div>
`;

        contenedor.appendChild(card);
    });
}


const sidebar = document.querySelector(".sidebar");
const btnMenu = document.getElementById("btnMenu");
const overlay = document.getElementById("overlay");

btnMenu.onclick = () => {
    sidebar.classList.toggle("activo");
    overlay.classList.toggle("activo");
};

overlay.onclick = () => {
    sidebar.classList.remove("activo");
    overlay.classList.remove("activo");
};
