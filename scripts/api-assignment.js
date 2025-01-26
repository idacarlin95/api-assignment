const API_ENDPOINT = "https://www.themealdb.com/api/json/v1/1/random.php";
let randomRecipe = {};


const getRecipeButton = document.getElementById('get-recipe-button');
const initialPage = document.getElementById('initial-page');
const recipeContainer = document.getElementById('recipe-container');
const nextRecipeButton = document.getElementById('next-recipe-button');


getRecipeButton.addEventListener('click', () => {
    console.log('Get Recipe Button Clicked');
    initialPage.style.display = 'none';
    recipeContainer.style.display = 'block';
    getRecipe();
});

nextRecipeButton.addEventListener('click', () => {
    console.log('Next Recipe Button Clicked');
    getRecipe(); 
});

const getRecipe = async () => {
    try {
        console.log('Fetching Random Recipe...');
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error('Failed to fetch recipe');
        
        const recipeData = await response.json();
        console.log('API Response:', recipeData);
        
        const meal = recipeData.meals[0];
        if (meal) {
            updateRecipe(meal);
        } else {
            console.error('No meal found in response data.');
        }
    } catch (error) {
        alert('Failed to fetch recipe. Please try again later.');
        console.error('Error fetching recipe:', error);
    }
};

const updateRecipe = (meal) => {
    console.log('Updating Recipe UI with:', meal);
    $('.recipe-name').text(meal.strMeal);
    $('.recipe-image img').attr('src', meal.strMealThumb).attr('alt', meal.strMeal);
    $('.ingredients-list').empty();
    
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            $('.ingredients-list').append(`<li>${measure} ${ingredient}</li>`);
        }
    }
    $('.recipe-area').text(meal.strInstructions);
    $('.toggle-layout-button').text('Show Instructions');
};

$('.toggle-layout-button').on('click', function () {
    const instructionsSection = $('.instructions-section');
    if (instructionsSection.is(':visible')) {
        instructionsSection.hide();
        $(this).text('Show Instructions');
    } else {
        instructionsSection.show();
        $(this).text('Hide Instructions');
    }
});

$('#search-button').on('click', async function() {
    const searchTerm = $('#recipe-search').val();
    if (!searchTerm) return;
    try {
        console.log(`Searching for recipe: ${searchTerm}`);
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        console.log('Search Response:', data);
        if (data.meals) {
            randomRecipe = data.meals[0];
            updateRecipe(randomRecipe);
        } else {
            alert("No recipes found");
        }
    } catch (error) {
        alert('Error fetching recipe');
        console.error('Error during search:', error);
    }
});


