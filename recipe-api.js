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
        try {
            const error = await response.json();
            throw new Error(error.error || '请求失败');
        } catch (jsonError) {
            throw new Error('请求失败: ' + response.statusText);
        }
    }

    try {
        return await response.json();
    } catch (jsonError) {
        return {};
    }
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

async function getCategories() {
    const result = await request('/categories');
    return result.categories || [];
}

async function getRecipeImages(recipeId) {
    const result = await request(`/recipes/${recipeId}/images`);
    return result.images || [];
}

async function uploadRecipeImage(recipeId, file, isCover = false, thumbnail = null, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_cover', isCover ? '1' : '0');
    if (thumbnail) {
        formData.append('thumbnail', thumbnail);
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable && onProgress) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                onProgress(percentComplete);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const result = JSON.parse(xhr.responseText);
                    resolve(result.image);
                } catch (error) {
                    reject(new Error('解析响应失败'));
                }
            } else {
                reject(new Error(`上传失败: ${xhr.status}`));
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('网络错误'));
        });

        xhr.addEventListener('abort', () => {
            reject(new Error('上传被取消'));
        });

        xhr.open('POST', `${API_BASE}/recipes/${recipeId}/images`);
        xhr.send(formData);
    });
}

async function deleteRecipeImage(recipeId, imageId) {
    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('imageId', imageId);
    
    const response = await fetch(`${API_BASE}/recipes/${recipeId}/images`, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        try {
            const error = await response.json();
            throw new Error(error.error || '请求失败');
        } catch (jsonError) {
            throw new Error('请求失败: ' + response.statusText);
        }
    }
    
    return true;
}

// 暴露为全局函数，确保在HTML中可用
if (typeof window !== 'undefined') {
    window.deleteRecipeImage = deleteRecipeImage;
}