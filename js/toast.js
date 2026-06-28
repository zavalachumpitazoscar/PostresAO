export function mostrarToast(){

    const toast =
        document.getElementById("toastExito");

    toast.classList.add("activo");

    const barra =
        toast.querySelector(".toast-barra");

    barra.style.animation="none";

    barra.offsetHeight;

    barra.style.animation=
        "progresoToast 3.5s linear forwards";

    setTimeout(()=>{

        toast.classList.remove("activo");

    },3500);

}
