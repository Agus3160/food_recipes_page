
let recipeList = []

const btnSearch = document.getElementById('searchButton')
btnSearch.onclick = fnSearchRecipes

const btnFilter = document.getElementById('filter-button')
btnFilter.onclick = fnSearchRecipes

const inputCaloriesFrom = document.getElementById('from-calories')
inputCaloriesFrom.onkeydown = function (e){if(e.key == '-') e.preventDefault()}

const inputCaloriesTo = document.getElementById('to-calories')
inputCaloriesTo.onkeydown = function (e){if(e.key == '-') e.preventDefault()}

const inputTextSearch = document.getElementById('searchText')
inputTextSearch.addEventListener('keypress', (e) => {
    if(e.key == 'Enter')fnSearchRecipes()
})

window.onload = () => {
    fnGetRandomRecipe('pizza', fnSetFilterParams())
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
    fnRecipesContaineRefresh()

    let paramQuery = ''

    if(query.length > 0){
        paramQuery += `&query=${query}`
    }else{

    }
    
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}${paramQuery}${params}&addRecipeInformation=true&fillIngredients=true&number=3`
    

    fetch(url, {
        method: 'GET',
        headres:{
            'Content-Type': 'application/json',
        }
    }).then(
        res => res.json()
    ).then(
        data => {
            recipeList = data.results
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

function fnSetFilterParams(){
    let paramsSearch = ''

    let diet = document.getElementById('select-diet').value
    if(diet != ''){
        paramsSearch += `&diet=${diet}`
    }

    let fromCalories = document.getElementById('from-calories').value
    let toCalories = document.getElementById('to-calories').value
    if(fromCalories.length < 0  && toCalories.length > 0){
        paramsSearch += `&maxCarbs=${toCalories.value}`
    }else if(toCalories.length < 0 && fromCalories.length > 0){
        paramsSearch += `&minCarbs=${fromCalories}+`
    }else if(toCalories.length > 0 && fromCalories.length > 0){
        if(parseInt(fromCalories) > parseInt(toCalories)){
            let aux = fromCalories
            fromCalories = toCalories
            toCalories = aux
        }
        paramsSearch += `&minCarbs=${fromCalories}+`
        paramsSearch += `&maxCarbs=${toCalories.value}`
    }

    return  paramsSearch
}


