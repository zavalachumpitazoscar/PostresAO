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

const contenedor =
    document.getElementById("contenedorUsuarios");

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
