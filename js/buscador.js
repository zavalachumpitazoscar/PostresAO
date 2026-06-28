export function iniciarBuscador() {

    const buscador = document.getElementById("buscarProductos");
    const filtroFecha = document.getElementById("filtroFechaProductos");

    if (!buscador || !filtroFecha) return;

    function aplicarFiltros() {

        const texto = buscador.value.toLowerCase().trim();
        const fechaSeleccionada = filtroFecha.value;

        document.querySelectorAll(".producto-card").forEach(card => {

            const contenido = card.textContent.toLowerCase();

            const fechaCard = card.dataset.fecha || "";

            const coincideTexto =
                contenido.includes(texto);

            const coincideFecha =
                !fechaSeleccionada ||
                fechaCard === fechaSeleccionada;

            card.style.display =
                (coincideTexto && coincideFecha)
                    ? "block"
                    : "none";

        });

    }

    buscador.addEventListener("input", aplicarFiltros);

    filtroFecha.addEventListener("change", aplicarFiltros);

}
