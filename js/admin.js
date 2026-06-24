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
            activo:true,
            imagen: imagenURL || ""
        }
    );

    alert("Producto agregado correctamente");

    document.getElementById("nombreProducto").value="";
    document.getElementById("precioProducto").value="";
    document.getElementById("stockProducto").value="";
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

    document.getElementById("editImagen").value =
        producto.imagen || "";

    document.getElementById("previewImagen").src =
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

            imagen:
                document.getElementById("editImagen").value
        }
    );

    modalEditar.style.display = "none";

    cargarProductos();

});
