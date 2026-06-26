import {
    collection,
    getDocs,
    doc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    db
}
from "./firebase-config.js";

import {
    signOut
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    auth
}
from "./firebase-config.js";

import {
    addDoc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    deleteDoc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

let productoEditando = null;

const modalEditar =
    document.getElementById("modalEditar");

const cerrarModal =
    document.getElementById("cerrarModal");

const contenedor =
    document.getElementById("contenedorUsuarios");

const contenedorProductos =
    document.getElementById("contenedorProductos");

async function cargarUsuarios() {

    contenedor.innerHTML = "";

    const consulta =
        await getDocs(
            collection(db, "usuarios")
        );

    consulta.forEach((documento) => {

        const usuario = documento.data();

        const card =
            document.createElement("div");

        card.classList.add("usuario-card");

        card.innerHTML = `
            <p><strong>Nombre:</strong> ${usuario.nombreCompleto}</p>

            <p><strong>Correo:</strong> ${usuario.correo}</p>

            <p class="estado ${
                usuario.estado === "ACTIVO"
                ? "activo"
                : "inactivo"
            }">
                Estado: ${usuario.estado}
            </p>
        `;

        const boton = document.createElement("button");

if (usuario.estado === "INACTIVO") {

    boton.textContent = "ACTIVAR";

    boton.addEventListener("click", async () => {

        await updateDoc(
            doc(db, "usuarios", documento.id),
            {
                estado: "ACTIVO"
            }
        );

        alert("Usuario activado");

        cargarUsuarios();

    });

} else {

    boton.textContent = "DESACTIVAR";

    boton.addEventListener("click", async () => {

        await updateDoc(
            doc(db, "usuarios", documento.id),
            {
                estado: "INACTIVO"
            }
        );

        alert("Usuario desactivado");

        cargarUsuarios();

    });

}

card.appendChild(boton);

        contenedor.appendChild(card);

    });

}

cargarUsuarios();

const vistaUsuarios =
    document.getElementById("vistaUsuarios");

const vistaProductos =
    document.getElementById("vistaProductos");

const vistaPedidos =
    document.getElementById("vistaPedidos");

document.getElementById("cardUsuarios").addEventListener("click", () => {

    vistaUsuarios.style.display = "block";
    vistaProductos.style.display = "none";
    vistaPedidos.style.display = "none";

});

document.getElementById("cardProductos").addEventListener("click", () => {

    vistaUsuarios.style.display = "none";
    vistaProductos.style.display = "block";
    vistaPedidos.style.display = "none";

});

document.getElementById("cardPedidos").addEventListener("click", () => {

    vistaUsuarios.style.display = "none";
    vistaProductos.style.display = "none";
    vistaPedidos.style.display = "block";

    cargarPedidos();

});

document
.getElementById("btnUsuarios")
.addEventListener("click", () => {

    vistaUsuarios.style.display = "block";
    vistaProductos.style.display = "none";
    vistaPedidos.style.display = "none";

});

document
.getElementById("btnProductos")
.addEventListener("click", () => {

    vistaUsuarios.style.display = "none";
    vistaProductos.style.display = "block";
    vistaPedidos.style.display = "none";

});

document
.getElementById("btnPedidos")
.addEventListener("click", () => {

    vistaUsuarios.style.display = "none";
    vistaProductos.style.display = "none";
    vistaPedidos.style.display = "block";

    cargarPedidos(); // ← agregar esto

});


document
.getElementById("btnCerrarSesion")
.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "index.html";

    }
    catch(error){

        alert("Error al cerrar sesión");

        console.error(error);

    }

});

const btnGuardarProducto =
    document.getElementById("btnGuardarProducto");

btnGuardarProducto.addEventListener(
    "click",
    guardarProducto
);

async function guardarProducto(){

    const nombre =
        document.getElementById("nombreProducto").value;

    const precio =
        Number(
            document.getElementById("precioProducto").value
        );

    const stock =
        Number(
            document.getElementById("stockProducto").value
        );

    const fecha =
    document.getElementById("fechaProducto").value;

    const imagenURL =
        document.getElementById("imagenProducto").value;

    if(nombre === "" || precio <= 0){

        alert("Complete los datos");

        return;
    }

    await addDoc(
        collection(db,"productos"),
        {
            nombre,
            precio,
            stock,
            fecha,
            activo:true,
            imagen: imagenURL || ""
        }
    );

    alert("Producto agregado correctamente");

    document.getElementById("nombreProducto").value="";
    document.getElementById("precioProducto").value="";
    document.getElementById("stockProducto").value="";
    document.getElementById("fechaProducto").value="";
    document.getElementById("imagenProducto").value="";

    cargarProductos();
}


async function cargarProductos(){

    contenedorProductos.innerHTML = "";

    const consulta =
        await getDocs(collection(db,"productos"));

    consulta.forEach((registro)=>{

        const producto = registro.data();

        const card = document.createElement("div");

        card.classList.add("producto-card");

        card.innerHTML = `
    ${
        producto.imagen
        ? `<img src="${producto.imagen}" alt="${producto.nombre}">`
        : `<img src="https://via.placeholder.com/300x200?text=Sin+Imagen">`
    }

    <div class="producto-info">

        <p><strong>${producto.nombre}</strong></p>

        <p>💰 S/ ${producto.precio}</p>

        <p>📦 Stock: ${producto.stock}</p>

        <p>📅 Disponible: ${producto.fecha || "Sin fecha"}</p>

        <p>
            ${
                producto.activo
                ? "🟢 Activo"
                : "🔴 Inactivo"
            }
        </p>

    </div>
`;

        // BOTÓN ACTIVAR / DESACTIVAR
        const btnEstado = document.createElement("button");
        btnEstado.classList.add("btn-estado");

        btnEstado.textContent =
            producto.activo ? "DESACTIVAR" : "ACTIVAR";

        btnEstado.addEventListener("click", async ()=>{

            await updateDoc(
                doc(db,"productos",registro.id),
                {
                    activo: !producto.activo
                }
            );

            cargarProductos();
        });

const btnEditar =
    document.createElement("button");

btnEditar.classList.add("btn-editar");

btnEditar.textContent = "EDITAR";

btnEditar.addEventListener("click", ()=>{

    productoEditando = registro.id;

    document.getElementById("editNombre").value =
        producto.nombre;

    document.getElementById("editPrecio").value =
        producto.precio;

    document.getElementById("editStock").value =
        producto.stock;

    document.getElementById("editFecha").value =
    producto.fecha || "";

    document.getElementById("editImagen").value =
        producto.imagen || "";

    modalEditar.style.display = "flex";

});

        // BOTÓN ELIMINAR
        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn-eliminar");
        btnEliminar.textContent = "ELIMINAR";

        btnEliminar.addEventListener("click", async ()=>{

            if(confirm("¿Eliminar producto?")){

                await deleteDoc(doc(db,"productos",registro.id));

                cargarProductos();
            }
        });

        const contenedorBotones =
    document.createElement("div");

contenedorBotones.classList.add(
    "botones-producto"
);

contenedorBotones.appendChild(btnEstado);
contenedorBotones.appendChild(btnEditar);
contenedorBotones.appendChild(btnEliminar);

card.appendChild(contenedorBotones);

        contenedorProductos.appendChild(card);
    });
}

cargarProductos();


cerrarModal.addEventListener("click", ()=>{

    modalEditar.style.display = "none";

});

document
.getElementById("btnActualizarProducto")
.addEventListener("click", async ()=>{

    await updateDoc(
        doc(
            db,
            "productos",
            productoEditando
        ),
        {
            nombre:
                document.getElementById("editNombre").value,

            precio:
                Number(
                    document.getElementById("editPrecio").value
                ),

            stock:
                Number(
                    document.getElementById("editStock").value
                ),

            fecha:
                document.getElementById("editFecha").value,

            imagen:
                document.getElementById("editImagen").value
        }
    );

    modalEditar.style.display = "none";

    cargarProductos();

});

async function cargarPedidos() {

    const contenedor =
        document.getElementById("contenedorPedidos");

    contenedor.innerHTML = "";

    const consulta =
        await getDocs(
            collection(db, "pedidos")
        );

consulta.forEach((registro) => {

    const pedido = registro.data();

    const card = document.createElement("div");

    card.dataset.buscar = `
${pedido.correo}
${pedido.productos.map(p => p.nombre).join(" ")}
`.toLowerCase();

    card.classList.add("pedido-admin");

    let productosHTML = "";

    pedido.productos.forEach(producto => {

        productosHTML += `
            <div style="
                display:flex;
                align-items:center;
                gap:10px;
                margin:8px 0;
            ">
                <img
                    src="${producto.imagen || 'https://via.placeholder.com/50'}"
                    width="50"
                    height="50"
                    style="object-fit:cover;border-radius:8px;"
                >

                <div>
                    <strong>${producto.nombre}</strong><br>
                    ${producto.cantidad} x S/ ${producto.precio}
                </div>
            </div>
        `;
    });

card.innerHTML = `
<div class="pedido-card-pro">

    <div class="pedido-header">

        <div>
        <h3>
        👤 ${
        pedido.nombreCliente ||
        pedido.correo
        }
        </h3>
        </div>

        <span class="estado estado-${pedido.estado}">
            ${pedido.estado}
        </span>

    </div>

    <div class="productos-admin">
        ${productosHTML}
    </div>

    <div class="pedido-info">

        <p>
            💳 ${pedido.metodoPago}
        </p>

        <h2>
            S/ ${pedido.total}
        </h2>

    </div>

    ${
        pedido.comprobantePago
        ? `
            <div class="comprobante-admin">
                <img
                    src="${pedido.comprobantePago}"
                    class="img-comprobante-admin">
            </div>
        `
        : ""
    }

    <div class="acciones-pedido">

        <button
            class="aprobar"
            data-id="${registro.id}">
            ✅ Aprobar
        </button>

        <button
            class="rechazar"
            data-id="${registro.id}">
            ❌ Rechazar
        </button>

    </div>

</div>
`;

    contenedor.appendChild(card);
});

    asignarEventosPedidos();
}

async function aprobarPedido(id){

    await updateDoc(
        doc(db, "pedidos", id),
        {
            estado: "APROBADO"
        }
    );

    cargarPedidos();
    cargarDashboard();
}

async function rechazarPedido(id){

    await updateDoc(
        doc(db, "pedidos", id),
        {
            estado: "RECHAZADO"
        }
    );

    cargarPedidos();
    cargarDashboard();
}

function asignarEventosPedidos(){

    document
    .querySelectorAll(".aprobar")
    .forEach(btn => {

        btn.onclick = () =>
            aprobarPedido(
                btn.dataset.id
            );

    });

    document
    .querySelectorAll(".rechazar")
    .forEach(btn => {

        btn.onclick = () =>
            rechazarPedido(
                btn.dataset.id
            );

    });
}

cargarPedidos();


document
.getElementById("buscarPedido")
.addEventListener("keyup", buscarPedidos);

function buscarPedidos(){

    const texto =
        document
        .getElementById("buscarPedido")
        .value
        .toLowerCase();

    const cards =
        document.querySelectorAll(".pedido-admin");

    cards.forEach(card => {

        if(
            card.dataset.buscar.includes(texto)
        ){
            card.style.display = "block";
        }
        else{
            card.style.display = "none";
        }

    });

}


async function cargarDashboard(){

    // Usuarios
    const usuarios =
        await getDocs(
            collection(db,"usuarios")
        );

    document.getElementById("totalUsuarios").textContent =
        usuarios.size;

    // Productos
    const productos =
        await getDocs(
            collection(db,"productos")
        );

    document.getElementById("totalProductos").textContent =
        productos.size;

    // Pedidos
    const pedidos =
        await getDocs(
            collection(db,"pedidos")
        );

    document.getElementById("totalPedidos").textContent =
        pedidos.size;

    // Ventas del día
    let totalHoy = 0;

    const hoy = new Date();

    pedidos.forEach(doc => {

        const pedido = doc.data();

        const fecha =
            pedido.fecha?.toDate
            ? pedido.fecha.toDate()
            : new Date(pedido.fecha);

        if(

            fecha.getDate() === hoy.getDate() &&

            fecha.getMonth() === hoy.getMonth() &&

            fecha.getFullYear() === hoy.getFullYear()

        ){

            if(pedido.estado === "APROBADO"){

                totalHoy += pedido.total;

            }

        }

    });

    document.getElementById("ventasHoy").textContent =
        "S/ " + totalHoy.toFixed(2);

}
cargarDashboard();


function cambiarVista(vista){

    vistaUsuarios.style.display = "none";
    vistaProductos.style.display = "none";
    vistaPedidos.style.display = "none";

    document
        .querySelectorAll(".sidebar button")
        .forEach(btn => btn.classList.remove("activo"));

    document
        .querySelectorAll(".card-dashboard")
        .forEach(card => card.classList.remove("activo"));

    switch(vista){

        case "usuarios":

            vistaUsuarios.style.display = "block";

            document
                .getElementById("btnUsuarios")
                .classList.add("activo");

            document
                .getElementById("cardUsuarios")
                .classList.add("activo");

            break;

        case "productos":

            vistaProductos.style.display = "block";

            document
                .getElementById("btnProductos")
                .classList.add("activo");

            document
                .getElementById("cardProductos")
                .classList.add("activo");

            break;

        case "pedidos":

            vistaPedidos.style.display = "block";

            document
                .getElementById("btnPedidos")
                .classList.add("activo");

            document
                .getElementById("cardPedidos")
                .classList.add("activo");

            cargarPedidos();

            break;

    }

}
