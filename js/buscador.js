export function iniciarBuscador() {

    const buscador = document.getElementById("buscarProductos");

    if (!buscador) return;

    buscador.addEventListener("keyup", () => {

        const texto = buscador.value.toLowerCase();

        document
            .querySelectorAll(".producto-card")
            .forEach(card => {

                const contenido = card.textContent.toLowerCase();

                card.style.display =
                    contenido.includes(texto)
                        ? "block"
                        : "none";

            });

    });

}
