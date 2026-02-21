const API_BASE = '/api';

function getUserId() {
    let userId = localStorage.getItem('recipe_user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('recipe_user_id', userId);
    }
    return userId;
}

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (options.body && !(options.body instanceof FormData)) {
        options.body = JSON.stringify(options.body);
    } else {
        delete headers['Content-Type'];
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '请求失败');
    }

    return response.json();
}

async function getAllRecipes() {
    const result = await request('/recipes');
    return result.recipes || [];
}

async function getRecipeById(id) {
    const result = await request(`/recipes/${id}`);
    return result.recipe;
}

async function createRecipeAPI(data) {
    const result = await request('/recipes', {
        method: 'POST',
        body: data
    });
    return result.id;
}

async function updateRecipeAPI(id, data) {
    const result = await request(`/recipes/${id}`, {
        method: 'PUT',
        body: data
    });
    return result.id;
}

async function deleteRecipeAPI(id) {
    await request(`/recipes/${id}`, {
        method: 'DELETE'
    });
}

async function searchRecipesAPI(query) {
    const result = await request(`/recipes/search?q=${encodeURIComponent(query)}`);
    return result.recipes || [];
}

async function getRecipesByCategory(category) {
    const result = await request(`/recipes?category=${encodeURIComponent(category)}`);
    return result.recipes || [];
}

async function getRecipeImages(recipeId) {
    const result = await request(`/recipes/${recipeId}/images`);
    return result.images || [];
}

async function uploadRecipeImage(recipeId, file, isCover = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_cover', isCover ? '1' : '0');

    const result = await request(`/recipes/${recipeId}/images`, {
        method: 'POST',
        body: formData
    });
    return result.image;
}

async function getFavorites() {
    const userId = getUserId();
    const result = await request(`/favorites?user_id=${encodeURIComponent(userId)}`);
    return result.recipes || [];
}

async function addFavorite(recipeId) {
    const userId = getUserId();
    await request('/favorites', {
        method: 'POST',
        body: {
            recipe_id: recipeId,
            user_id: userId
        }
    });
}

async function removeFavoriteAPI(recipeId) {
    const userId = getUserId();
    await request(`/favorites/${recipeId}?user_id=${encodeURIComponent(userId)}`, {
        method: 'DELETE'
    });
}

async function checkFavorite(recipeId) {
    const userId = getUserId();
    try {
        const result = await request(`/favorites/check?recipe_id=${recipeId}&user_id=${encodeURIComponent(userId)}`);
        return result.is_favorite || false;
    } catch (error) {
        return false;
    }
}