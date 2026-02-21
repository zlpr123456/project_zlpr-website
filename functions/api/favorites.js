export async function onRequestGet(context) {
  const { env, request } = context;
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        error: '缺少用户ID'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await env.DB.prepare(`
      SELECT r.*, i.r2_url as cover_image
      FROM recipes r
      INNER JOIN favorites f ON r.id = f.recipe_id
      LEFT JOIN images i ON r.id = i.recipe_id AND i.is_cover = 1
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `).bind(userId).all();
    
    return new Response(JSON.stringify({
      success: true,
      recipes: result.results
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
    
    await env.DB.prepare(`
      INSERT OR IGNORE INTO favorites (recipe_id, user_id)
      VALUES (?, ?)
    `).bind(data.recipe_id, data.user_id).run();
    
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