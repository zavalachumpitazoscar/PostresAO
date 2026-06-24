import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

const btnGuardar =
    document.getElementById("btnGuardar");

const lista =
    document.getElementById("listaProductos");

btnGuardar.addEventListener(
    "click",
    guardarProducto
);

async function guardarProducto() {

    const nombre =
        document.getElementById("nombre").value;

    const precio =
        Number(
            document.getElementById("precio").value
        );

    const stock =
        Number(
            document.getElementById("stock").value
        );

    if(
        nombre === "" ||
        precio <= 0
    ){
        alert("Complete los datos");
        return;
    }

    await addDoc(
        collection(db, "productos"),
        {
            nombre,
            precio,
            stock,
            activo: true
        }
    );

    document.getElementById("nombre").value="";
    document.getElementById("precio").value="";
    document.getElementById("stock").value="";

    cargarProductos();

}

async function cargarProductos() {

    lista.innerHTML = "";

    const consulta =
        await getDocs(
            collection(db, "productos")
        );

    consulta.forEach((registro) => {

        const producto =
            registro.data();

        const div =
            document.createElement("div");

        div.classList.add("producto");

        div.innerHTML = `
            <p><strong>${producto.nombre}</strong></p>
            <p>Precio: S/ ${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <p class="${
                producto.activo
                ? "activo"
                : "inactivo"
            }">
                ${
                    producto.activo
                    ? "ACTIVO"
                    : "INACTIVO"
                }
            </p>
        `;

        const boton =
            document.createElement("button");

        if(producto.activo){

            boton.textContent =
                "DESACTIVAR";

            boton.classList.add(
                "btnDesactivar"
            );

            boton.addEventListener(
                "click",
                async () => {

                    await updateDoc(
                        doc(
                            db,
                            "productos",
                            registro.id
                        ),
                        {
                            activo:false
                        }
                    );

                    cargarProductos();

                }
            );

        }else{

            boton.textContent =
                "ACTIVAR";

            boton.classList.add(
                "btnActivar"
            );

            boton.addEventListener(
                "click",
                async () => {

                    await updateDoc(
                        doc(
                            db,
                            "productos",
                            registro.id
                        ),
                        {
                            activo:true
                        }
                    );

                    cargarProductos();

                }
            );

        }

        div.appendChild(boton);

        lista.appendChild(div);

    });

}

cargarProductos();
