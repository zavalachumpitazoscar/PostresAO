import {
    signInWithEmailAndPassword,
    signOut
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    auth,
    db
}
from "./firebase-config.js";

const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async () => {

    const correo =
        document.getElementById("correo").value;

    const password =
        document.getElementById("password").value;

    try {

        const credencial =
            await signInWithEmailAndPassword(
                auth,
                correo,
                password
            );

        const uid = credencial.user.uid;

        const usuarioRef =
            doc(db, "usuarios", uid);

        const usuarioSnap =
            await getDoc(usuarioRef);

        if (!usuarioSnap.exists()) {

            alert("Usuario no encontrado");

            await signOut(auth);

            return;
        }

        const usuario =
            usuarioSnap.data();

        if (usuario.estado !== "ACTIVO") {

            alert(
                "Su cuenta aún no ha sido activada"
            );

            await signOut(auth);

            return;
        }

        if (usuario.rol === "ADMIN") {
        window.location.href = "admin.html";
        } else {
        window.location.href = "cliente.html";
        }

        // luego aquí irá cliente.html o admin.html

    }
    catch (error) {

        alert(error.message);

    }

});



btnLogin.addEventListener("click", async()=>{

    const correo=correoInput.value;
    const password=passwordInput.value;

    await signInWithEmailAndPassword(auth,correo,password);

});
