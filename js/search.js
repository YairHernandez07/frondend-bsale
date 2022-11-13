let dataSearch;

function searchProduct(evt) {
    /**
     * Para capturar la info del queryParam
     */
    evt.preventDefault();
    let dataNameSearch = document.querySelector('#searchId').value;
    window.location.href = `./index.html?product=${dataNameSearch}`;
}

if (myParamDataSearch !== null) {
    loadDataProductSearch();
}

function loadDataProductSearch() {

    /**
     * Comienza el proceso, primero verificara si hay algún queryParam, ya que el mismo index.html, se usa para la funcionalidad del Search producto.
     * - Luego de recibir la data del producto buscado, se comienza con el flujo , primero con el agrupamiento de pagination,...
     */

    if (myParamDataSearch !== null) {

        let urlProductsSearch = `${uri}/search/${myParamDataSearch}`;

        fetch(urlProductsSearch)
            .then(
                (resp) => resp.json()
            )
            .then(function (data) {
                dataSearch = data.resp.list;
                renderDataSearch(dataSearch);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function renderDataSearch(data) {

    /**
     * Si se ha hecho la búsqueda, se debe borrar el los hijos del div-filter, ya que dentro de ese div , o estarán los botones para los select y aplicar el filtro, o sino para renderizar el Subtitle
     * - Luego se agrega el Subtitle propio del Search, y luego se reinician las variables para que el flujo se cumpla correctamente
     * - Por ultimo se hacen las funciones reutilizables , como la función groupPagination, la cual es el inicio del proceso de ALL el renderizado de data como de la pagination
     * - Si es que no hay data de respuesta del back, se muestra que no se encontró información de lo que trata de buscar
     */

    deleteSelect();
    addSubtitle();
    resetVariables();

    if (data) {
        // Change button pagination
        groupPagination(data);

        // Rerender la nueva data filtrada por category
        createDivsCard(data);
    } else {
        addNotFoundProduct();
    }

}

function addSubtitle() {
    /**
     * Se agregará de forma dinámica el Subtítulo cuando se busca y te diga "Los resultados de busqueda: nameSearch"
     */
    let divDelete = document.querySelector('.div-filter');

    let miP = document.createElement('p');
    miP.textContent = `Los resultados de busqueda: `;
    miP.classList.add('subtitle');

    let miSpan = document.createElement('span');
    miSpan.textContent = myParamDataSearch;
    miSpan.classList.add('name-search');

    miP.appendChild(miSpan);

    divDelete.appendChild(miP);
}

function addNotFoundProduct() {
    /**
     * Se Agregará la etiqueta p para mostrar al usuario que no se encontró lo que busca
     */
    let divNotFound = document.querySelector('.not-found');
    let miP = document.createElement('p');
    miP.textContent = 'No se encontró ningún artículo con ese nombre';
    miP.classList.add('text-center', 'not-found', 'fw-light');
    divNotFound.appendChild(miP);
}
