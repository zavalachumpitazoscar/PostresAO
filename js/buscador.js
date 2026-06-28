// ===============================
// FILTRO
// ===============================
const inputBuscarProductos =
document.getElementById("buscarProducto");

function aplicarFiltrosProductos() {

    const textoProductos = inputBuscarProductos.value.toLowerCase().trim();
    const fechaFiltroProductos = document.getElementById("filtroFechaProductos").value;
    const ordenProductos = document.getElementById("ordenProductos").value;

    let filtrados = [...productosGlobal];

    // ======================
    // BUSCADOR
    // ======================
if (textoProductos) {

    filtrados = filtrados.filter(p => {

        const productos = (p.nombre || [])
            .map(prod => prod.nombre.toLowerCase())
            .join(" ");

        return (
            productos.includes(textoProductos)
        );

    });

}

    // ======================
    // FECHA
    // ======================
    if (fechaFiltroProductos) {
        filtrados = filtrados.filter(p => {
            const f = p.fecha?.toDate
                ? p.fecha.toDate()
                : new Date(p.fecha);

            return f.toISOString().split("T")[0] === fechaFiltroProductos;
        });
    }

    // ======================
    // ORDEN
    // ======================
    if (ordenProductos === "recientes") {

    filtrados.sort((a, b) => {

        const fechaA = a.fecha?.toDate
            ? a.fecha.toDate()
            : new Date(a.fecha);

        const fechaB = b.fecha?.toDate
            ? b.fecha.toDate()
            : new Date(b.fecha);

        return fechaB - fechaA;
    });

}

if (ordenProductos === "antiguos") {

    filtrados.sort((a, b) => {

        const fechaA = a.fecha?.toDate
            ? a.fecha.toDate()
            : new Date(a.fecha);

        const fechaB = b.fecha?.toDate
            ? b.fecha.toDate()
            : new Date(b.fecha);

        return fechaA - fechaB;
    });

}

    if (ordenProductos === "mayor") {
        filtrados.sort((a, b) => (b.total || 0) - (a.total || 0));
    }

    if (ordenProductos === "menor") {
        filtrados.sort((a, b) => (a.total || 0) - (b.total || 0));
    }

    renderizarProductos(filtrados);
}


// ===============================
// EVENTOS DE FILTROS
// ===============================
inputBuscarProductos?.addEventListener("input", aplicarFiltrosProductos);

document.getElementById("filtroFechaProductos")?.addEventListener("change", aplicarFiltrosProductos);

document.getElementById("ordenProductos")?.addEventListener("change", aplicarFiltrosProductos);
// ===============================
// FIN
// ===============================
