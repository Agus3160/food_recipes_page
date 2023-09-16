//Se crea la lista de recetas devueltas por la API
let recipeList = []

//Se asigna el evento al botón de buscar
const btnSearch = document.getElementById('searchButton')
btnSearch.onclick = fnSearchRecipes

//Se obtiene el elemento de seleccion de tipo de dieta
const selectDiet = document.getElementById('select-diet')

//Se obtiene el boton de borrar filtros y se le asigna el evento para que al presionarlos, se reinicien los filtros seleccionados
const btnClearFilters = document.getElementById('clear-filter')
btnClearFilters.onclick = fnClearFilterFields

//Se obtienen los elementos input calorias y se verifica que no se ingresen números inválidos
const inputCaloriesFrom = document.getElementById('from-calories')
inputCaloriesFrom.onkeydown = function (e){if(e.key == '-') e.preventDefault()}
const inputCaloriesTo = document.getElementById('to-calories')
inputCaloriesTo.onkeydown = function (e){if(e.key == '-') e.preventDefault()}

//Se obtienen los elementos input proteina y se verifica que no se ingresen números inválidos
const inputProteinFrom = document.getElementById('from-protein')
inputProteinFrom.onkeydown = function (e){if(e.key == '-') e.preventDefault()}
const inputProteinTo = document.getElementById('to-protein')
inputProteinTo.onkeydown = function (e){if(e.key == '-') e.preventDefault()}

//se obtiene el input de busqueda y se buscan recetas segun los parametros ingresados en el buscador
const inputTextSearch = document.getElementById('searchText')
inputTextSearch.addEventListener('keypress', (e) => {
    if(e.key == 'Enter')fnSearchRecipes()
})


//Al cargar la pagina ya se generan recetas random mediante la funcion fnGetRecipe o según parametros
window.onload = () => {
    fnGetRecipe('', fnSetFilterParams())
}

// crea un objeto card
class RecipeCard{
    constructor(title, url, image, summary){
        this.title = title
        this.url = url
        this.image = image
        this.summary = summary
    }

    //Se crea, mediante una función, el html de una receta y se inserta al html principal
    getHtmlCard(){
        //se crea un link que contiene a la receta
        let recipeA = document.createElement('a')
        recipeA.setAttribute('href', this.url)
        recipeA.setAttribute('class', 'col-sm-10 col-md-5 col-lg-3 col-xl-3 m-3')
        recipeA.setAttribute('style', 'height: 500px; text-decoration:none;');

        //crea el div card de la receta
        let recipeDiv = document.createElement('div')
        recipeDiv.setAttribute('class', 'card div_card shadow_box')
        recipeDiv.setAttribute('style', 'height: 500px');

        //componentes del card 
        let component = (
            `<img src='${this.image}' class="card-img-top"/>            
            <div class='card-body'>
                <h2 class="card-title">${this.title}</h2>
                <p class='card-text fw-lighter'>${this.summary.replace(/<\/?[^>]+(>|$)/g, "")}</p>
            </div>`
        )

        recipeDiv.innerHTML=(component)
        recipeA.appendChild(recipeDiv)

        return recipeA
    }

}

//Funcion que devuelve recetas segun un parametro y si no hay parámetros, devuelve recetas aleatorias
function fnGetRecipe(query, params){    
    
    //VARIABLES:
    const API_KEY = 'b2a68d559e0b40c3864ab3f101ff2d33'
    let paramQuery = ''
    let url
    
    fnRecipesContaineRefresh()  //Se refresca el contenedor de recetas.

    //En caso de que el usuario haya ingresado algo o de que los parametros no esten vacios, se cargan el Query y Parametros para la busqueda de recetas
    //En caso de que no se hayan modificado los filtros, entonces el programa retornara una lista de recetas al azar.
    if(query.length > 0 || params.length > 0){
        paramQuery += `&query=${query}`
        url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}${paramQuery}${params}&addRecipeInformation=true&fillIngredients=true&number=9`
    }else{
        url = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=9`
    }
    //verificacion de parametros
    console.log(url)
    //Para traer los elementos de la URL API a la pagina web
    fetch(url, {
        method: 'GET',
        headres:{
            'Content-Type': 'application/json',
        }
    }).then(
        res => res.json()
    ).then(
        data => {
            if(query.length > 0 || params.length > 0){
                recipeList = data.results
            }else{
                recipeList = data.recipes
            }
            fnLoadRecipeCard(recipeList)
        }
    )
}

//Permite cargar los elementos carta receta
function fnLoadRecipeCard(rArray){
    let cardTemp = {}                                                   //Es la carta individual
    let recipesContainer = document.getElementById('recipesContainer')  //Es el contenedor que almacenara todas las recetas

    //En caso de que la cant de recetas encontradas sea mayor a 0
    if(rArray.length > 0){
        //Se recorre el array de recetas y se crean y agregan elementos carta receta al html
        rArray.forEach(recipe => {
            cardTemp = new RecipeCard(recipe.title, recipe.sourceUrl, recipe.image, recipe.summary)
            recipesContainer.appendChild(cardTemp.getHtmlCard())
        })
    //En caso de que la cant de recetas encontradas sea 0
    }else{
        //Se despliega un mensaje por pantalla para avisar que no se encontraron resultados.
        let h2TextNotFound = document.createElement('h2')
        h2TextNotFound.textContent = "No results found"
        recipesContainer.appendChild(h2TextNotFound)
    }
}

//Permite buscar las recetas, teniendo en cuenta el texto del usuario para el Query y los demas campos para los Parametros de busqueda.
function fnSearchRecipes(){
    let userText = inputTextSearch.value
    fnGetRecipe(userText, fnSetFilterParams())
}

//Permite refrescar el contenedor de recetas, con intencion de que las recetas no se vayan acumulando.
function fnRecipesContaineRefresh(){
    document.getElementById('recipesContainer').innerHTML = ''
}

//Permite vaciar todos los campos input.
function fnClearFilterFields(){
    inputCaloriesFrom.value = ''
    inputCaloriesTo.value = ''
    inputProteinFrom.value = ''
    inputProteinTo.value = ''
    inputTextSearch.value = ''
    selectDiet.value = ""
}

function fnSetFilterParams(){
    let paramsSearch = ''   //Variable que guarda todos los parametros que seran cargados a la URL

    //Se carga el parametro diet en caso de que este no este vacio
    let diet = selectDiet.value
    if(diet != ''){
        paramsSearch += `&diet=${diet}`
    }

    //Se valida la entrada del usuario en el caso de las calorias y luego se cargan los parametros dependiendo del caso
    let fromToCalories = fnIsValidFromToInput(inputCaloriesFrom, inputCaloriesTo)
    if(fromToCalories.length > 0){
        if(fromToCalories[1]===true){
            paramsSearch += `&minCalories=${fromToCalories[0]}`
        }else if(fromToCalories[1]===false){
            paramsSearch += `&maxCalories=${fromToCalories[0]}`
        }else{
            paramsSearch += `&minCalories=${fromToCalories[0]}&maxCalories=${fromToCalories[1]}`
        }
    }

    //Se valida la entrada del usuario en el caso de la proteina y luego se cargan los parametros dependiendo del caso
    let fromToProtein = fnIsValidFromToInput(inputProteinFrom, inputProteinTo)
    if(fromToProtein.length > 0){
        if(fromToProtein[1]===true){
            paramsSearch += `&minProtein=${fromToProtein[0]}`
        }else if(fromToProtein[1]===false){
            paramsSearch += `&maxProtein=${fromToProtein[0]}`
        }else{
            paramsSearch += `&minProtein=${fromToProtein[0]}&maxProtein=${fromToProtein[1]}`
        }
    }

    return  paramsSearch
}

//Permite validar los campos from-to
//Devuelve un array de dos elementos donde si el segundo no es un boolean entonces ambos campos (from-to) tienen datos
//En caso de que devuelva un dato y un true, entonces solo se cargo el minimo, si es false, entonces solo el maximo
function fnIsValidFromToInput(fromElement, toElement){
    let results = []
    
    let fromElementValue  = fromElement.value
    let toElementValue = toElement.value

    if (fromElementValue.length === 0 && toElementValue.length === 0) return results

    if(fromElementValue.length === 0  && toElementValue.length > 0){
        results = [toElementValue, false]
    }else if(toElementValue.length === 0 && fromElementValue.length > 0){
        results = [fromElementValue, true]
    }else if(toElementValue.length > 0 && fromElementValue.length > 0){
        if(parseInt(fromElementValue) > parseInt(toElementValue)){
            let aux = fromElementValue
            fromElementValue  = toElementValue
            toElementValue = aux
            fromElement.value = fromElementValue 
            toElement.value = toElementValue
        }
        results = [...[fromElementValue, toElementValue]]
    }
    return results
}
