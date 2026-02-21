export async function onRequestGet(context) {
  const { env, request } = context;
  
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return new Response(JSON.stringify({
        success: true,
        recipes: []
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await env.DB.prepare(`
      SELECT * FROM recipes 
      WHERE title LIKE ? OR description LIKE ? OR tags LIKE ? OR ingredients LIKE ?
      ORDER BY created_at DESC
    `).bind(
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`
    ).all();
    
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