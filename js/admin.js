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
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

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

    if(
        nombre === "" ||
        precio <= 0
    ){
        alert("Complete los datos");
        return;
    }

    await addDoc(
        collection(db,"productos"),
        {
            nombre,
            precio,
            stock,
            activo:true
        }
    );

    document.getElementById("nombreProducto").value="";
    document.getElementById("precioProducto").value="";
    document.getElementById("stockProducto").value="";

    cargarProductos();

}


async function cargarProductos(){

    contenedorProductos.innerHTML = "";

    const consulta =
        await getDocs(
            collection(db,"productos")
        );

    consulta.forEach((registro)=>{

        const producto =
            registro.data();

        const card =
            document.createElement("div");

        card.classList.add("producto-card");

        card.innerHTML = `
            <p><strong>${producto.nombre}</strong></p>
            <p>Precio: S/ ${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <p>
                Estado:
                ${
                    producto.activo
                    ? "ACTIVO"
                    : "INACTIVO"
                }
            </p>
        `;

        contenedorProductos.appendChild(card);

    });

}

cargarProductos();
