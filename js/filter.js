let dataCategories;
let urlCategories = `${uri}/categories`;

const divFilter = document.querySelector('.div-filter');

chargeCategories();

function chargeCategories() {

    /**
     *  Para pedir información de las categorías de los productos, y con ella poder renderizarlos en los Select
     */

    if (myParamDataSearch === null) {
        fetch(urlCategories)
            .then(
                (resp) => resp.json()
            )
            .then(function (data) {
                dataCategories = data.resp.list;
                generateSelectCategories();
            })
            .catch(function (error) {
                console.log(error);
            });

    }
}

function generateSelect(tipoSelect) {

    

    if (divFilter.children.length === 0 || divFilter.children.length === 1) {

        let miDivSelect = document.createElement('div');

        let miLabel = document.createElement('label');
        miLabel.classList.add('mb-2')

        let miSelect = document.createElement('select');

        if (tipoSelect === 'category') {
            miLabel.htmlFor = 'select-categories';
            miLabel.textContent = 'Categories';

            miSelect.id = 'select-categories';
        }

        if (tipoSelect === 'price') {
            miLabel.htmlFor = 'select-order-price';
            miLabel.textContent = 'Price';

            miSelect.id = 'select-order-price';
        }

        miDivSelect.appendChild(miLabel);
        miDivSelect.appendChild(miSelect);
        miDivSelect.classList.add('spacing-filter');

        let miDivFilter = document.querySelector('.div-filter');
        miDivFilter.appendChild(miDivSelect);

        let miOp = document.createElement('option');
        miOp.textContent = '-- Please choose a category --';
        miOp.value = (-1).toString();
        miSelect.appendChild(miOp);

        if (tipoSelect === 'category') {
            dataCategories.forEach(element => {
                const miOption = document.createElement('option');
                miOption.value = element.id;
                miOption.textContent = element.name;

                miSelect.appendChild(miOption);
            });
        }

        if (tipoSelect === 'price') {
            const miOption1 = document.createElement('option');
            miOption1.value = (0).toString();
            miOption1.textContent = 'De Menor a Mayor precio';

            miSelect.appendChild(miOption1);

            const miOption2 = document.createElement('option');
            miOption2.value = (1).toString();
            miOption2.textContent = 'De Mayor a Menor precio';

            miSelect.appendChild(miOption2);
        }
    }
}

// Llenar el select con las categories de la base de datos
function generateSelectCategories() {

    /**
     * Genera los divs para el select de category y para el select de price, ambos están usando solo 1 función reutilizable
     */

    generateSelect('category');
    generateSelect('price');
    generateButtonApplyFilters();

}

function generateButtonApplyFilters() {

    /**
     * Button para que el usuario pueda elegir que filtros quiere aplicar, como el evento click a escuchar
     */

    let buttonApplyFilter = document.createElement('button');
    buttonApplyFilter.classList.add('btn', 'btn-primary');
    buttonApplyFilter.type = 'button';
    buttonApplyFilter.textContent = 'Apply Filters';
    buttonApplyFilter.id = 'button-filter';

    buttonApplyFilter.addEventListener('click', () => {
        getIdsFiltersAndLoadData();
    });

    let miDivFilter = document.querySelector('.div-filter')
    miDivFilter.appendChild(buttonApplyFilter);
}

function deleteSelect() {

    /**
     * Si se ha hecho la búsqueda, se debe borrar el los hijos del div-filter , ya que dentro de ese div , o estarán los botones para los select y aplicar el filtro, o sino para renderizar el Subtitle
     */

    if (divFilter != null) {
        let e = document.querySelector('.div-filter');
        let child = e.lastElementChild;

        while (child) {
            e.removeChild(child);
            child = e.lastElementChild;
        }
    }
}

function chargeDataFilters(idCategory, idOrderPrice) {

    /**
     *  Luego de retornar la data , se dirige a realizar el flujo de la funcionalidad
     */

    let urlProductCategory = `${uri}/products/filters/${idCategory}/${idOrderPrice}`;

    fetch(urlProductCategory)
        .then(
            (resp) => resp.json()
        )
        .then(function (data) {
            dataCategories = data.resp.list;
            renderDataCategory(dataCategories);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function renderDataCategory(data) {

    /**
     * - Se hacen las funciones reutilizables , como la función groupPagination, la cual es el inicio del proceso de ALL el renderizado de data como de la pagination, la resetVariables, para darle los valores propicios para que el flujo sea correcto. Y el createDivs, para generar los divs respectivos en este caso con la data filtrada del back.
     */

    resetVariables();
    // Change button pagination
    groupPagination(data);

    // Rerender la nueva data filtrada por category
    createDivsCard(data);
}

function getIdsFiltersAndLoadData() {
    /**
     * Se recupera los valores seleccionados de los select y dependiendo de si eligio AL MENOS UNO, recién se podrá hacer la petición al back
     */

    let idCategory = document.getElementById('select-categories').value;
    let idOrderPrice = document.getElementById('select-order-price').value;

    if (idCategory > 0 || idOrderPrice >= 0) { // Se ha realizado algún filtro -> se envía la petición
        chargeDataFilters(idCategory, idOrderPrice);
    }
}
