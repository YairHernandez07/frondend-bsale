<h1 align="center">
  <a href="https://desafio-begazo-carhuayo.netlify.app/">
    Desafío Bsale - Frontend
  </a>
</h1>

Este repositorio esta enfocada para el lado Frontend del proyecto, el cual consumira el apirest del backend, y renderizará la web para el consumo del usuario. Esta web permite :
 - Listar los productos (con un una paginación hecha en javascript, solo se usaron csn de css y js de Boostrap), .
 - Buscar productos que sigan un patron que el usuario ingresa en el input (ejemplo pis --> renderizara los productos que contengan la cadena pis)
 - Filtrar los datos por medio de su precio o la categoría del producto , o ambos filtros ( solo se permite en el index, no cuando se busca un producto).
 - Paginación de los productos totales y los productos filtrados (poder dar siguiente y atras, y que se pinte en la página en la cual se encuentra, como también desactivar los botones de atras y adelante cuando esten en su limite inferior o superior de la paginación)

## Comenzando 🚀

- Dependiendo de si quieres probar el proyecto frontend con el servidor local o desplegado , dirígete al archivo `./js/product.js` y cambia la línea 4 o 5, si vas a realizar pruebas con el back desplegado no se mueve nada, pero si deseas probar el back local se comenta la línea 4 y se descomenta la línea 5.

- Para poder correr este proyecto, solo se debe servir en un servidor , por medio de Visual Studio Code con la extensión Liver Server, con solo darle al boton _Go Live_

<p>
  <img src="https://res.cloudinary.com/alvarob15/image/upload/v1637620741/goLive_f6zlli.png" alt="Go Live" width="500px" height="auto">
</p>

  _El navegador se abrirá automaticamente con la ruta establecida por la extensión y estará corriendo el index.html como los diversos script._

- También puede usar otras aplicaciones para levantarlo como servidor como XAMPP, LAMPP, Laragon (solo en Windows), entre otros.

_Si lo que desea es probar la versión desplegada, visita el siguiente enlace https://chic-florentine-60c7d1.netlify.app/  _`(cabe aclarar que suele no cargar en el primer intento, pero es algo que sale del alcance del desafío, ya que Heroku tiene un límite de estar encendido su proceso, y luego se vuelve inactivo, debido a que los servicios de Heroku y Netlify son gratuitos, por ello suele funcionar sin ningún problema en la segunda o tercera recarga, luego de esto cargará en la primera`__

## Flujo de trabajo
- Solo se tiene un hmtl, el index.html, que se encargará de hacer las funcionalidades que se mencionó al comienzo.

  #### product.js

  <p>
    <img src="https://res.cloudinary.com/alvarob15/image/upload/v1637621284/productJs_zzhffz.png" alt="product.js" width="500px" height="auto">
  </p>

  El flujo comienza con la función:

  - `startProcess()`, que primero validando si el index.html tiene query params en su url, si no las tiene, seguirá con el proceso, si las tiene defrente irá al search.js. Luego de valida que no exista un query params, hace un fetch para la petición de los productos totales y dependiendo de la cantidad de productos , se creará la paginación, luego va a groupPagination(data).

  - `groupPagination(data),` calculará y guardará la cantidad de grupo que habrán (se establecio al comeinzo en una variable que seria 9 imagenes por página), luego validará si existe o ya se ha creado el paginator (por medio del query selector), si este ya ha sido creado, se borra sus nodos hijos, ademas de establecer el limiteSuperior (los limites son para poder saber que imagenes van en cada grupo de la paginación), y luego continuará con la función fillButtonsPagination().

  - `fillButtonsPagination(data)`,  se encargará de generar los boton Anterior ('<') si es que ha sido cargada por primera vez , una variable que se declaro al comienzo, y luego un for con la cantidad de grupos de la paginación , y luego generar el botoón de Siguiente ('>'), estas acciones se realizan por medio de otra función generateButtonNextPrev(name, isNextPrev, data), y dentro de ella dependiendo name, se ejecutara el previousClick() o nextClick(data), luego fillEventClick(data);

  - `fillEventClick(data)`, esta función es encargad de agregar listener a los eventos click de los botones de la paginación, y  solo recíen cuando se le de click, cambie los limites de la paginación (con la función changeLimits(index)), luego crear los Divs y agregar algunas clases específicas para el cambio de la paginación seleccionada y verificar si debe estar activo o desactivo el boton de Siguiente '>' o Atras '<'(creatDivsAndAddClass(dataFill, index);), .

Siguiendo el flujo , seguiría la función de conditionalStart(data). _**La mayoría de funciones son reutilizables y solo se llamarán con la data nueva y se reutilizará de forma idónea el codigo.**_
 
  - `conditionalStart(data)`, verificará si es la primera cargada con las varibales declaradas, esto es ya que se usara para la carga de productos, el de filtrados, el de search, etc, por ultimo al ser la primera carga, se llamaran las funciones createDivsCard(data);
addClassSelectedButtonPagination(i); addClassCursorPointerPrevNext();. 

  - `createDivsCard(data)`, verificará si es la primera carga, si lo es no eliminará nada ya que no hay nodos hijos, si no es la primera carga eliminará para que se pueda renderizar para cuando se aplique los filtro o cuando se busque un producto. Luego recorrel la data de los productos obtenidos y crea N card los cuales se renderizarán en la web.

  - `addClassSelectedButtonPagination(i)`, como su nombre claro lo dice, se haya la referencia de los botones del paginator, se les elimina a ambos y solo si es el indice actual seleccionado se agregara el active, para que se pinte y el usuario sepa que es el que esta seleccionado

  - `addClassCursorPointerPrevNext()`, Para saber cuando el button Previous (<<) y el Next (>>), ya no no tengan el cursor pointer, y no haga ninguna acción

  - Por ultimo el `resetVariables(),` se ejecutará cuando se realize la filtración o busqueda, esta función reinicia el estado inicial de las variables para que el flujo se correcto


  #### filter.js

  <p>
    <img src="https://res.cloudinary.com/alvarob15/image/upload/v1637621284/filterJS_ub0yux.png" alt="filter.js" width="500px" height="auto">
  </p>

  - Primero `chargeCategories()`, pedirá información de las categorías de los productos, y con ella poder renderizarlos en los Select, solo si es que no hay query params, luego generateSelectCategories().

  - `generateSelectCategories()`, tiene 3 funciones en orden, generateSelect('category'); generateSelect('price'); generateButtonApplyFilters();

  - `generateSelect('category') && generateSelect('price')`, generará con javascript los 2 select usando una función reutilizable para ambos select, creara un div div, diferente dependiendo del parámetro enviado, luego de crear 2 div de select, generateButtonApplyFilters();.

  - `generateButtonApplyFilters()`, se encargará de crear el button de 'Apply Filters', además de generar el Listener del evento click de este botón, que será ejecutado cuando le den click al boton, entonces diparará el evento e irá a la función getIdsFiltersAndLoadData();

  - `getIdsFiltersAndLoadData()`, verificará que al menos un filtro haya sido seleccionado, sino no pedirá nada al back, minimo debe haber un filtro seleccionado o ambos, si cumple con lo anterior, el flujo continuaría con chargeDataFilters(idCategory, idOrderPrice) .

  - `chargeDataFilters(idCategory, idOrderPrice)`, retorna la data con el/los filtros aplicados por lado del server, luego realiza renderDataCategory(data).

  - `renderDataCategory(data)`, los cuales van a llamar a las funciones reutilizables de product.js, `resetVariables(); roupPagination(data); createDivsCard(data);`

  - `deleteSelect()`, esta función se ejecutará en el search.js, y la dejé aquí ya que eleiminará los div de los select creados en este filter.js


  #### search.js

  <p>
    <img src="https://res.cloudinary.com/alvarob15/image/upload/v1637621284/searchJS_r9jswh.png" alt="search.js" width="500px" height="auto">
  </p>

  searchProduct(evt), se dispara cuando se realizá el evento click, es el único evento declarado por lado de html, ya que el input y boton de busqueda estan en todo momento, basicamente la función se encarga de capturar la info del queryParam y redigir a la misma web , pero con parametros en su url.

  El flujo de este script comenzará cuando exista algun query params en la url, cuando se encuentre uno, el flujo será:
  
  - `loadDataProductSearch()`, Comienza el proceso, primero verificara si hay algún queryParam, ya que el mismo index.html, se usa para la funcionalidad del Search producto. Luego de recibir la data del producto buscado, renderDataSearch(dataSearch);

  - `renderDataSearch(dataSearch);`, ejecutará las funciones deleteSelect(); addSubtitle(); resetVariables();

  - `deleteSelect()`, eleiminará los div de los select creados en este filter.js.

  - `addSubtitle()`, se agregará de forma dinámica el Subtítulo cuando se busca y te diga "Los resultados de buscar: nameSearch"

  - `resetVariables()`, funcion reutilizable de product.js

  **_Por último si encuentra algún resultado de la busqueda_**, reutiliza las funciones de product.js con la data nueva como parametro groupPagination(data); createDivsCard(data); si no encuentra ninguna, realiza la función addNotFoundProduct().

  - `addNotFoundProduct()`, Se Agregará un mensaje,  para mostrar al usuario que no se encontró lo que busca.

