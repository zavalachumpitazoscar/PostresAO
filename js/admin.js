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
