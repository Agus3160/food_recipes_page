
let recipeList = []

const btnSearch = document.getElementById('searchButton')
btnSearch.onclick = fnSearchRecipes

const selectDiet = document.getElementById('select-diet')

const btnClearFilters = document.getElementById('clear-filter')
btnClearFilters.onclick = fnClearFilterFields

const inputCaloriesFrom = document.getElementById('from-calories')
inputCaloriesFrom.onkeydown = function (e){if(e.key == '-') e.preventDefault()}
const inputCaloriesTo = document.getElementById('to-calories')
inputCaloriesTo.onkeydown = function (e){if(e.key == '-') e.preventDefault()}

const inputProteinFrom = document.getElementById('from-protein')
inputProteinFrom.onkeydown = function (e){if(e.key == '-') e.preventDefault()}
const inputProteinTo = document.getElementById('to-protein')
inputProteinTo.onkeydown = function (e){if(e.key == '-') e.preventDefault()}

const inputTextSearch = document.getElementById('searchText')
inputTextSearch.addEventListener('keypress', (e) => {
    if(e.key == 'Enter')fnSearchRecipes()
})



window.onload = () => {
    fnGetRandomRecipe('', fnSetFilterParams())
}

class RecipeCard{
    constructor(title, url, image, summary){
        this.title = title
        this.url = url
        this.image = image
        this.summary = summary
    }

    getHtmlCard(){
        let recipeA = document.createElement('a')
        recipeA.setAttribute('href', this.url)

        let recipeDiv = document.createElement('div')
        recipeDiv.setAttribute('class', 'recipeCardContainer')

        let component = (
            `<img src='${this.image}' class="recipeImg"/>
            <h2 class="tituloReceta">${this.title}</h2>
            <div class='recipeSummary'>
                <p class='recipeCalories'>${this.summary.replace(/<\/?[^>]+(>|$)/g, "")}</p>
            </div>`
        )

        recipeDiv.innerHTML=(component)
        recipeA.appendChild(recipeDiv)

        return recipeA
    }

}

function fnGetRandomRecipe(query, params){    
    
    const API_KEY = '008838f4b5fd428e9ed897a54bc64617'
    let paramQuery = ''
    let url
    
    fnRecipesContaineRefresh()

    if(query.length > 0 || params.length > 0){
        paramQuery += `&query=${query}`
        url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}${paramQuery}${params}&addRecipeInformation=true&fillIngredients=true&number=3`
    }else{
        url = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=3`
    }
    console.log(url)
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

function fnLoadRecipeCard(rArray){
    let cardTemp = {}
    let recipesContainer = document.getElementById('recipesContainer')

    rArray.forEach(recipe => {
        cardTemp = new RecipeCard(recipe.title, recipe.sourceUrl, recipe.image, recipe.summary)
        recipesContainer.appendChild(cardTemp.getHtmlCard())
    })
}


function fnSearchRecipes(){
    let userText = inputTextSearch.value
    fnGetRandomRecipe(userText, fnSetFilterParams())
}

function fnRecipesContaineRefresh(){
    document.getElementById('recipesContainer').innerHTML = ''
}

function fnClearFilterFields(){
    inputCaloriesFrom.value = ''
    inputCaloriesTo.value = ''
    inputProteinFrom.value = ''
    inputProteinTo.value = ''
    inputTextSearch.value = ''
}

function fnSetFilterParams(){
    let paramsSearch = ''

    let diet = selectDiet.value
    if(diet != ''){
        paramsSearch += `&diet=${diet}`
    }

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
            let aux = fromCaloriesValue
            fromElementValue  = toElementValue
            toElementValue = aux
            fromElement.value = fromElementValue 
            toElement.value = toElementValue
        }
        results = [...[fromElementValue, toElementValue]]
    }
    return results
}