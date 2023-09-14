
let hitList = []

const btnSearch = document.getElementById('searchButton')
btnSearch.onclick = fnSearchRecipes

const btnFilter = document.getElementById('filter-button')
btnFilter.onclick = fnSearchRecipes

const inputTextSearch = document.getElementById('searchText')
inputTextSearch.addEventListener('keypress', (e) => {
    if(e.key == 'Enter')fnSearchRecipes()
})

window.onload = () => {
    fnGetRandomRecipe('pizza', fnSetFilterParams())
}

class RecipeCard{
    constructor(title, url, image,calories, ingredients){
        this.title = title
        this.url = url
        this.image = image
        this.calories = calories
        this.ingredients = ingredients
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
                <p class='recipeCalories'>Calories: <span>${this.calories}</span></p>
                <p>Ingredients: <span>${this.ingredients}</span></p>
            </div>`
        )

        recipeDiv.innerHTML=(component)
        recipeA.appendChild(recipeDiv)

        return recipeA
    }

}

function fnGetRandomRecipe(query, params){    

    fnRecipesContaineRefresh()

    let paramQuery = ''

    if(query.length > 0){
        paramQuery += `&q=${query}`
    }
    
    let url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=4b39cecb&app_key=%20edb64012675c4c34c91c6546d35f285a${paramQuery}${params}`

    fetch(url, {
        method: 'GET',
        headres:{
            'Content-Type': 'application/json',
        }
    }).then(
        res => res.json()
    ).then(
        data => {
            hitList = data.hits
            fnLoadRecipeCard(hitList)
        }
    )
}

function fnLoadRecipeCard(rArray){
    let cardTemp = {}
    let recipesContainer = document.getElementById('recipesContainer')

    rArray.forEach(hit => {
        cardTemp = new RecipeCard(hit.recipe.label, hit.recipe.url, hit.recipe.image, Math.round(hit.recipe.calories), hit.recipe.ingredients.length)
        recipesContainer.appendChild(cardTemp.getHtmlCard())
    })
}


function fnSearchRecipes(){
    let userText = inputTextSearch.value
    if(userText.length === 0 || userText.trim() === '') return
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

    if(fromCalories == '' && toCalories != ''){
        paramsSearch += `&calories=${toCalories.value}`
    }else if(toCalories === '' && fromCalories != ''){
        paramsSearch += `&calories=${fromCalories}%2B`
    }else if(toCalories !== '' && fromCalories !== ''){
        if(parseInt(fromCalories) > parseInt(toCalories)){
            let aux = fromCalories
            fromCalories = toCalories
            toCalories = aux
        }
        paramsSearch += `&calories=${fromCalories}-${toCalories}`
    }

    return  paramsSearch
}


