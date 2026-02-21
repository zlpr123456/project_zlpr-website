export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    const { searchParams } = new URL(context.request.url);
    const category = searchParams.get('category');
    
    let query = 'SELECT * FROM recipes ORDER BY created_at DESC';
    const params = [];
    
    if (category) {
      query = 'SELECT * FROM recipes WHERE category = ? ORDER BY created_at DESC';
      params.push(category);
    }
    
    const result = await env.DB.prepare(query).bind(...params).all();
    
    const recipes = await Promise.all(result.results.map(async (recipe) => {
      const coverImage = await env.DB.prepare(
        'SELECT r2_url FROM images WHERE recipe_id = ? AND is_cover = 1 LIMIT 1'
      ).bind(recipe.id).first();
      
      return {
        ...recipe,
        cover_image: coverImage ? coverImage.r2_url : null
      };
    }));
    
    return new Response(JSON.stringify({
      success: true,
      recipes
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

export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const data = await request.json();
    
    const result = await env.DB.prepare(`
      INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, servings, difficulty, category, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.title,
      data.description || null,
      data.ingredients,
      data.instructions,
      data.cooking_time || null,
      data.servings || null,
      data.difficulty || '简单',
      data.category || null,
      data.tags || null
    ).run();
    
    return new Response(JSON.stringify({
      success: true,
      id: result.meta.last_row_id
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