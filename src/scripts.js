const form = document.querySelector('.search-form');
const recipeList = document.querySelector('.recipe-list');
const recipeDetails = document.querySelector('.recipe-details');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const inputValue = event.target[0].value.trim();

    if (!inputValue) {
        alert("Por favor, digite um ingrediente!");
        return;
    }

    searchRecipes(inputValue);
});

const searchRecipes = async (ingredient) => {
    recipeList.innerHTML = "<p> Carregando Receitas! </p>";
    const URL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;

    try {
        const query = await fetch(URL);
        const data = await query.json();

        if (data.meals) {
            showRecipes(data.meals);
        } else {
            alert("Não foi encontrada nenhuma receita para esse ingrediente!");
        }
    } catch (error) {
        alert("Erro ao buscar receitas. Tente novamente!");
        console.error(error);
    }
};

function showRecipes(recipes) {
    recipeList.innerHTML = "";
    
    recipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.dataset.id = recipe.idMeal;

        recipeCard.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
        `;

        recipeCard.addEventListener("click", () => getRecipeDetails(recipe.idMeal));
        recipeList.appendChild(recipeCard);
    });
}

async function getRecipeDetails(id) {
    const endPoint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    try {
        const result = await fetch(endPoint);
        const data = await result.json();
        const recipe = data.meals[0];

        let ingredients = "";
        for (let i = 1; i <= 20; i++) {
            if (recipe[`strIngredient${i}`]) {
                ingredients += `<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`;
            } else {
                break;
            }
        }

        recipeDetails.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-img">
            <h3>Categoria: ${recipe.strCategory}</h3>
            <h3>Origem: ${recipe.strArea}</h3>
            <h3>Ingredientes:</h3>
            <ul>${ingredients}</ul>
            <h3>Instruções:</h3>
            <p>${recipe.strInstructions}</p>
            ${recipe.strTags ? `<p>TAGS: ${recipe.strTags}</p>` : ""}
            <p>Vídeo: <a href="${recipe.strYoutube}" target="_blank">Assista no YouTube</a></p>
        `;
    } catch (error) {
        alert("Erro ao buscar detalhes da receita. Tente novamente!");
        console.error(error);
    }
}
