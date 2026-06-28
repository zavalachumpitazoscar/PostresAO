// ===============================
// FILTRO
// ===============================

function aplicarFiltros() {

    const texto = inputBuscar.value.toLowerCase().trim();
    const fechaFiltro = document.getElementById("filtroFecha").value;
    const estadoFiltro = document.getElementById("filtroEstado").value;
    const orden = document.getElementById("ordenPedidos").value;

    let filtrados = [...pedidosGlobal];

    // ======================
    // BUSCADOR
    // ======================
if (texto) {

    filtrados = filtrados.filter(p => {

        const id = String(p.id || "").toLowerCase();

        const estado = String(p.estado || "").toLowerCase();

        const metodo = String(p.metodoPago || "").toLowerCase();

        const productos = (p.productos || [])
            .map(prod => prod.nombre.toLowerCase())
            .join(" ");

        return (
            id.includes(texto) ||
            estado.includes(texto) ||
            metodo.includes(texto) ||
            productos.includes(texto)
        );

    });

}

    // ======================
    // ESTADO
    // ======================
    if (estadoFiltro) {
        filtrados = filtrados.filter(p =>
            (p.estado || "").toUpperCase() === estadoFiltro
        );
    }

    // ======================
    // FECHA
    // ======================
    if (fechaFiltro) {
        filtrados = filtrados.filter(p => {
            const f = p.fecha?.toDate
                ? p.fecha.toDate()
                : new Date(p.fecha);

            return f.toISOString().split("T")[0] === fechaFiltro;
        });
    }

    // ======================
    // ORDEN
    // ======================
    if (orden === "recientes") {

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

if (orden === "antiguos") {

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

    if (orden === "mayor") {
        filtrados.sort((a, b) => (b.total || 0) - (a.total || 0));
    }

    if (orden === "menor") {
        filtrados.sort((a, b) => (a.total || 0) - (b.total || 0));
    }

    renderizarPedidos(filtrados);
}


// ===============================
// EVENTOS DE FILTROS
// ===============================
inputBuscar?.addEventListener("input", aplicarFiltros);

document.getElementById("filtroFecha")?.addEventListener("change", aplicarFiltros);

document.getElementById("filtroEstado")?.addEventListener("change", aplicarFiltros);

document.getElementById("ordenPedidos")?.addEventListener("change", aplicarFiltros);
// ===============================
// FIN
// ===============================
