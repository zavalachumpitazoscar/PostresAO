import {
    createUserWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    auth,
    db
}
from "./firebase-config.js";

const btnRegistrar =
    document.getElementById("btnRegistrar");

btnRegistrar.addEventListener(
    "click",
    async () => {

        const nombre =
            document.getElementById("nombre").value;

        const correo =
            document.getElementById("correo").value;

        const password =
            document.getElementById("password").value;

        try {

            const credencial =
                await createUserWithEmailAndPassword(
                    auth,
                    correo,
                    password
                );

            await setDoc(
                doc(
                    db,
                    "usuarios",
                    credencial.user.uid
                ),
                {
                    nombreCompleto: nombre,
                    correo: correo,
                    estado: "INACTIVO",
                    rol: "CLIENTE",
                    fechaRegistro:
                        new Date().toISOString()
                }
            );

            alert(
                "Cuenta creada. Espere activación del administrador."
            );

            window.location =
                "index.html";

        }
        catch (error) {

            alert(error.message);

        }

    }
);
