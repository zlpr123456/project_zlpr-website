export async function onRequestGet(context) {
  const { env, params } = context;
  
  try {
    const recipeId = params.id;
    
    const recipe = await env.DB.prepare(
      'SELECT * FROM recipes WHERE id = ?'
    ).bind(recipeId).first();
    
    if (!recipe) {
      return new Response(JSON.stringify({
        success: false,
        error: '食谱不存在'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      recipe
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPut(context) {
  const { env, params, request } = context;
  
  try {
    const recipeId = params.id;
    const data = await request.json();
    
    await env.DB.prepare(`
      UPDATE recipes 
      SET title = ?, description = ?, ingredients = ?, instructions = ?, 
          cooking_time = ?, servings = ?, difficulty = ?, category = ?, tags = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.title,
      data.description || null,
      data.ingredients,
      data.instructions,
      data.cooking_time || null,
      data.servings || null,
      data.difficulty || '简单',
      data.category || null,
      data.tags || null,
      recipeId
    ).run();
    
    return new Response(JSON.stringify({
      success: true,
      id: parseInt(recipeId)
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestDelete(context) {
  const { env, params } = context;
  
  try {
    const recipeId = params.id;
    
    await env.DB.prepare('DELETE FROM recipes WHERE id = ?').bind(recipeId).run();
    
    return new Response(JSON.stringify({
      success: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}