let cardDiv = document.querySelector('#containerDiv');
let divPagination;

const uri = `https://desafio-bsale-back-begazo.herokuapp.com/inventory`;
 //const uri = `http://localhost:3000/inventory`;

let urlProducts = `${uri}/products`;

let dataProducts;

let start = false;
let isLoaded = false;

// Para el Paginator
let cantImagesPagination = 9;
let cantGroup;
let limitInf = 0;
let limitSup;
let indicePaginationSelected = 0;

const urlParams = new URLSearchParams(window.location.search);
const myParamDataSearch = urlParams.get('product');

startProcess();

function startProcess() {

    /**
     * Comienza el proceso, primero verificara si hay algún queryParam, ya que el mismo index.html, se usa para la funcionalidad del Search producto.
     * - Luego de recibir la data de los productos se comienza con el flujo , primero con el agrupamiento de pagination,...
     */

    if (myParamDataSearch === null) {
        fetch(urlProducts)
            .then(
                (resp) => resp.json()
            )
            .then(function (data) {
                dataProducts = data.resp.list;
                groupPagination(dataProducts);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function groupPagination(data) {

    /***
     *  - Primero se calcula cuantos grupos de botones habrá en el paginator
     *  - Luego si es que ya se ha renderizado o creado una paginator anterior por la búsqueda o filtro, se borra
     *  - Luego se resta 1, ya que se comienza en 0 el índice del paginator
     *  - Se llena los botones del paginator
     */

    cantGroup = Math.floor(data.length / cantImagesPagination);
    if (data.length % cantImagesPagination > 0) {
        cantGroup = cantGroup + 1;
    }

    divPagination = document.querySelector('.pagination');

    // Borrar el antiguo pagination creada
    if (divPagination != null) {
        let e = document.querySelector('.pagination');
        let child = e.lastElementChild;

        while (child) {
            e.removeChild(child);
            child = e.lastElementChild;
        }
    }

    limitSup = cantImagesPagination - 1;
    fillButtonsPagination(data);
}

function previousClick(data) {

    /**
     * Cuando se da click al button Previous (<<), se cambia los limites y se reduce, dependiendo de lo que se estableció que haya N productos en cada paginación
     * - Llama a la función -> se encargará de crear los div y de agregar class al button selected, y cursor del prev y next
     */

    if (limitInf !== 0) {
        limitInf = limitInf - cantImagesPagination;
        limitSup = limitSup - cantImagesPagination;
        indicePaginationSelected = indicePaginationSelected - 1;

        creatDivsAndAddClass(data, indicePaginationSelected);
    }
}

function nextClick(data) {

    /**
     * Cuando se da click al button Next (>>), se cambia los limites y se aumenta, dependiendo de lo que se estableció que haya N productos en cada paginación
     * - Llama a la función -> se encargará de crear los div y de agregar class al button selected, y cursor del prev y next
     */

    if (limitSup <= data.length) { // 54 62 (el max es 56)    // 45 - 53
        limitInf = limitInf + cantImagesPagination;
        limitSup = limitSup + cantImagesPagination;
        indicePaginationSelected = indicePaginationSelected + 1;
        creatDivsAndAddClass(data, indicePaginationSelected);
    }
}

function generateButtonNextPrev(name, isNextPrev, data) {

    /**
     * -Generará los botones Previous(<<) y Next(>>), y eventos click de los botones
     */

    let miLi = document.createElement('li');
    miLi.classList.add('page-item');

    let miA = document.createElement('a');
    miA.classList.add('page-link');
    // Para no hacer lo window.scrollTo(0, 0);, se le da un redirección de #
    miA.href = "#";

    if (!isNextPrev) {
        miLi.classList.add('active-number-pagination');
        miA.textContent = name;
    } else {
        miLi.id = name;
        if (name === "previous") {
            miA.textContent = '<<'
        } else {
            miA.textContent = '>>';
        }

        miLi.addEventListener('click', () => {
            name === "previous" ? previousClick(data) : nextClick(data);
        });
    }

    miLi.appendChild(miA);
    divPagination.appendChild(miLi);
}

function fillButtonsPagination(data) {

    /**
     * - Primero se verifica si es la primera cargada de la pagina, para poder agregar primero el previos
     * - Luego se genera los buttons sabiendo la cantidad de grupos, que se realizó al comienzo
     * - Primero se verifica si es la primera cargada de la pagina, para poder agregar primero el next
     * - Luego se llena los eventos click de los botones
     * - Por ultimo se hace que se hagan ciertas acciones por ser la primera carga de la web
     */

    if (!isLoaded) {
        generateButtonNextPrev('previous', true, data);
    }

    // Crear los N en el pagination
    for (let i = 1; i <= cantGroup; i++) {
        generateButtonNextPrev(i, false, data);
    }

    if (!isLoaded) {
        generateButtonNextPrev('next', true, data);
    }

    fillEventClick(data);
    conditionalStart(data);
}

function conditionalStart(data) {

    /**
     * - Si es la primera carga de la web, entonces de frente cargara los divs
     * - Llama a la función -> se encargará de crear los div y de agregar class al button selected, y cursor del prev y next
     */

    if (!start && !isLoaded) {
        creatDivsAndAddClass(data, 0);
        start = true;
        isLoaded = true;
    }
}

function fillEventClick(dataFill) {
    /**
     * - Se realizó esta función para tratar que no se encuentre mucho código en una función, pero la principal razón fuel la reutilización de diversas funciones en los diversos scripts
     * - primero se establecen los limites del group del pagination --> los productos que estarán en cada button del paginator
     * - Se escucha al evento click del btn ,este tendrá una clase par que se muestre como seleccionado
     * - Llama a la función -> se encargará de crear los div y de agregar class al button selected, y cursor del prev y next
     */
    let buttonsPagination = document.querySelectorAll('.active-number-pagination');

    buttonsPagination.forEach((element, index) => {
        element.addEventListener('click', (data) => {
            // 0, 1 ,...
            changeLimits(index + 1);
            indicePaginationSelected = parseInt(data.target.textContent) - 1;
            creatDivsAndAddClass(dataFill, index);
        });
    });
}

function creatDivsAndAddClass(data, i) {
    /**
     * - Si es la primera carga de la web, entonces de frente cargara los divs
     * - Luego agregara class para los botones, para saber cuando debe estar desactivado el next o previous
     * - Por ultimo, se agrega class solo al button que este seleccionado o por default el 1
     */
    createDivsCard(data);
    addClassSelectedButtonPagination(i);
    addClassCursorPointerPrevNext();
}

function changeLimits(index) {
    /**
     * - Cambiar los limites del group ,con esto se sabrá que productos se renderizarán el tal grupo del button del paginator
     */
    limitInf = (index - 1) * cantImagesPagination;
    limitSup = (index - 1) * cantImagesPagination + (cantImagesPagination - 1);
}

function addClassSelectedButtonPagination(indice) {

    /**
     * Se haya la referencia de los botones del paginator, se les elimina a ambos y solo si es el indice actual seleccionado se agregara el active, para que se pinte y el usuario sepa que es el que esta seleccionado
     */

    let buttonsPagination = document.querySelectorAll('.active-number-pagination');

    buttonsPagination.forEach((element, index) => { //0,1,2,...
        // borrar la clase active de todos los botones
        element.classList.remove('active');
        if (index === indice) {
            element.classList.add('active');
        }
    });
}

function addClassCursorPointerPrevNext() {

    /**
     * Para saber cuando el button Previous (<<) y el Next (>>), ya no no tengan el cursor pointer, y no haga ninguna acción
     */

    let buttonNext = document.querySelector('#next');
    let buttonPrevious = document.querySelector('#previous');

    // Button Previous
    buttonPrevious.classList.remove("disabled");
    if (indicePaginationSelected === 0) {
        buttonPrevious.classList.add("disabled");
    }

    // Button Next
    buttonNext.classList.remove("disabled");
    if (indicePaginationSelected + 1 === cantGroup) {
        buttonNext.classList.add("disabled");
    }

}

function createDivsCard(data) {

    /**
     * Solo en la primera cargada, se llenara los div con los limites establecidos, si no es la primera, se debe borrar los divs que fueron creados en la primera, para que hacer rerender de la nueva data con los nuevos limites
     * Luego crear los elementos del dom por medio de Javascript
     */

    // Solo después de la primera cargada , se debe borrar, lo que se creo para agregar lo nuevo según el pagination
    if (start) {
        let e = document.querySelector('#containerDiv');
        let child = e.lastElementChild;
        while (child) {
            e.removeChild(child);
            child = e.lastElementChild;
        }
    }

    // Crear el card del producto
    data.forEach((element, index) => {
        // 0-8 || 54-56
        if (index >= limitInf && index <= limitSup) {

            // <div className="card">
            //     <img className="card-img-top" src="https://dojiw2m9tvv09.cloudfront.net/11132/product/409346.jpg"                                                                         width="150" height="280" alt="PISCO MISTRAL 40°">
            //         <div className="car-body">
            //             <h5 className="card-title text-center">PISCO MISTRAL 40</h5>
            //             <p className="card-text text-center">S/. 4,990</p>
            //             <p class="text-center">S/. 6392 (incluido el 20% de desc.) </p> --> OPCIONAL SI HAY DESCUENTO
            //         </div>
            // </div>

            const miDivCard = document.createElement('div');
            miDivCard.classList.add('card');

            const miImg = document.createElement('img');
            miImg.classList.add('card-img-top');

            if (element.url_image !== '' && element.url_image !== null) {
                miImg.src = element.url_image;
            } else {
                miImg.src = './assets/not_found.jpg';
            }

            miImg.width = 150;
            miImg.height = 280;
            miImg.alt = element.name;

            const miDivChild = document.createElement('div');
            miDivChild.classList.add('card-body');

            const name = document.createElement('h5');
            name.classList.add('card-title', 'text-center');
            name.textContent = element.name;

            const price = document.createElement('p');
            price.classList.add('card-text', 'text-center');
            price.textContent = `S/. ${new Intl.NumberFormat('es-MX').format(element.price)}`;

            let miDiscount
            if (element.discount > 0) {
                miDiscount = document.createElement('p');
                let priceWithDiscount = ((100 - element.discount) / 100) * element.price;
                miDiscount.textContent = `S/. ${priceWithDiscount} (incluído el ${element.discount}% de dscto) `;
                miDiscount.classList.add('text-center');

                price.classList.add('text-decoration-line-through');
            }

            miDivChild.appendChild(name);
            miDivChild.appendChild(price);
            if (element.discount > 0) {
                miDivChild.appendChild(miDiscount);
            }

            miDivCard.appendChild(miImg);
            miDivCard.appendChild(miDivChild);

            cardDiv.appendChild(miDivCard);
        }
    });
}

function resetVariables() {

    /**
     * Reiniciar el estado inicial de las variables para que el flujo se correcto
     */

    start = false;
    isLoaded = false;

    limitInf = 0;
    indicePaginationSelected = 0;
}
