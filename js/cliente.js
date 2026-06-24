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

let carrito = [];

const contenedorProductos =
    document.getElementById(
        "contenedorProductos"
    );

async function cargarProductos(){

    contenedorProductos.innerHTML = "";

    const consulta =
        await getDocs(
            collection(db,"productos")
        );

    consulta.forEach((registro)=>{

        const producto =
            registro.data();

        if(
            !producto.activo ||
            producto.stock <= 0
        ){
            return;
        }

        const card =
            document.createElement("div");

        card.classList.add(
            "producto-card"
        );

        card.innerHTML = `
            <img src="${
                producto.imagen
            }">

            <div class="producto-info">

                <p>
                    <strong>
                        ${producto.nombre}
                    </strong>
                </p>

                <p>
                    S/ ${producto.precio}
                </p>

                <p>
                    Stock:
                    ${producto.stock}
                </p>

            </div>
        `;

        const boton =
            document.createElement(
                "button"
            );

        boton.classList.add(
            "btn-agregar"
        );

        boton.textContent =
            "Agregar al carrito";

        boton.addEventListener(
            "click",
            ()=>{

                carrito.push({
                    nombre:
                        producto.nombre,

                    precio:
                        producto.precio
                });

                actualizarCarrito();

            }
        );

        card.appendChild(boton);

        contenedorProductos
        .appendChild(card);

    });

}

function actualizarCarrito(){

    const contenedor =
        document.getElementById(
            "contenedorCarrito"
        );

    contenedor.innerHTML = "";

    let total = 0;

    carrito.forEach((item)=>{

        total += item.precio;

        const div =
            document.createElement(
                "div"
            );

        div.classList.add(
            "item-carrito"
        );

        div.innerHTML = `
            ${item.nombre}
            - S/ ${item.precio}
        `;

        contenedor.appendChild(div);

    });

    document.getElementById(
        "totalPedido"
    ).textContent =
        "Total: S/ " + total;

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

    vistaCarrito.style.display =
        "none";

    vistaPedidos.style.display =
        "none";

});

document
.getElementById(
    "btnCarrito"
)
.addEventListener("click",()=>{

    vistaCatalogo.style.display =
        "none";

    vistaCarrito.style.display =
        "block";

    vistaPedidos.style.display =
        "none";

});

document
.getElementById(
    "btnMisPedidos"
)
.addEventListener("click",()=>{

    vistaCatalogo.style.display =
        "none";

    vistaCarrito.style.display =
        "none";

    vistaPedidos.style.display =
        "block";

});

cargarProductos();
