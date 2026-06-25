import {
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    signOut
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    db,
    auth
}
from "./firebase-config.js";

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
    actualizarCarrito(); // 🔥 IMPORTANTE
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

    const consulta =
        await getDocs(
            collection(db, "productos")
        );

    consulta.forEach((registro) => {

        const producto = registro.data();

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

            // 🔒 validación segura
            if (!stockTemporal[registro.id] || stockTemporal[registro.id] <= 0) {
                alert("No hay más stock disponible");
                return;
            }

            // crear item si no existe
            if (!carrito[registro.id]) {
                carrito[registro.id] = {
                    id: registro.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: 0
                };
            }

            // incrementar carrito
            carrito[registro.id].cantidad++;

            // descontar stock local
            stockTemporal[registro.id]--;

            // UI updates
            actualizarCarrito();
            actualizarStockVisual(registro.id);

            mostrarMensaje(producto.nombre + " agregado al carrito");
        });

        card.appendChild(boton);
        contenedorProductos.appendChild(card);
    });
}

function actualizarCarrito() {

    const contenedor = document.getElementById("contenedorCarrito");
    contenedor.innerHTML = "";

    let total = 0;

Object.values(carrito).forEach((item) => {

    const div = document.createElement("div");
    div.classList.add("item-carrito");

    div.innerHTML = `
        <div class="msg-bubble">
            <strong>${item.nombre}</strong><br>
            S/ ${item.precio} x ${item.cantidad}
        </div>

        <div class="actions">
            <button class="btn-mini">-</button>
            <button class="btn-mini">+</button>
            <button class="btn-remove">✖</button>
        </div>
    `;

    // ➖ restar
    div.querySelector(".btn-mini").onclick = () => {
        if (item.cantidad > 1) {
            item.cantidad--;
            stockTemporal[item.id]++;
        } else {
            delete carrito[item.id];
        }
        actualizarCarrito();
    };

    // ➕ sumar
    div.querySelectorAll(".btn-mini")[1].onclick = () => {

        if (stockTemporal[item.id] <= 0) return;

        item.cantidad++;
        stockTemporal[item.id]--;

        actualizarCarrito();
    };

    // ❌ eliminar
    div.querySelector(".btn-remove").onclick = () => {
        stockTemporal[item.id] += item.cantidad;
        delete carrito[item.id];
        actualizarCarrito();
    };

    contenedor.appendChild(div);
});

    document.getElementById("totalPedido").textContent =
        "Total: S/ " + total;

const count = Object.values(carrito)
    .reduce((acc, item) => acc + item.cantidad, 0);

carritoCount.textContent = count;
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

document
.getElementById(
    "btnCatalogo"
)
.addEventListener("click",()=>{

    vistaCatalogo.style.display =
        "block";


    vistaPedidos.style.display =
        "none";

});

document.getElementById("btnCarrito").addEventListener("click", () => {
    vistaCatalogo.style.display = "none";
    vistaPedidos.style.display = "none";

    carritoPanel.classList.add("activo");
    actualizarCarrito();
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

});

cargarProductos();

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

document.getElementById("btnSolicitarPedido").addEventListener("click", async () => {

    if (Object.keys(carrito).length === 0) {
        alert("Carrito vacío");
        return;
    }

    const pedido = {
        productos: Object.values(carrito),
        total: Object.values(carrito).reduce(
            (acc, item) => acc + item.precio * item.cantidad,
            0
        ),
        fecha: new Date(),
        estado: "PENDIENTE"
    };

    await addDoc(collection(db, "pedidos"), pedido);

    alert("Pedido enviado correctamente 🎉");

carrito = {};
stockTemporal = {};
actualizarCarrito();
cargarProductos();
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
