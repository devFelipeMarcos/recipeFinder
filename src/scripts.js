const form = document.querySelector('.search-form');
const recipeList = document.querySelector('.recipe-list');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.close-modal');

// Evento de busca
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const inputValue = event.target[0].value;
    searchRecipes(inputValue);
});

// Buscar receitas pela API
const searchRecipes = async (ingredient) => {
    recipeList.innerHTML = "<p>Carregando Receitas...</p>";
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
        console.error("Erro ao buscar receitas:", error);
    }
};

// Exibir receitas na tela
function showRecipes(recipes) {
    recipeList.innerHTML = recipes.map((i) => `
        <div class="recipe-card" onclick="getRecipeDetails('${i.idMeal}')">
            <img src="${i.strMealThumb}" alt="${i.strMeal}">
            <h3>${i.strMeal}</h3>
        </div>
    `).join('');
}

// Buscar detalhes da receita e abrir modal
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

        modalContent.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-img">
            <h3>Categoria: ${recipe.strCategory}</h3>
            <h3>Origem: ${recipe.strArea}</h3>
            <h3>Ingredientes:</h3>
            <ul>${ingredients}</ul>
            <h3>Instruções:</h3>
            <p>${recipe.strInstructions}</p>
            <p>Tags: ${recipe.strTags ? recipe.strTags : 'Nenhuma'}</p>
            <p>Vídeo: <a href="${recipe.strYoutube}" target="_blank">Assista no YouTube</a></p>
        `;
        
        modal.style.display = "block";
    } catch (error) {
        console.error("Erro ao buscar detalhes da receita:", error);
    }
}

// Fechar modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});