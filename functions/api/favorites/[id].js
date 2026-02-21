export async function onRequestGet(context) {
  const { env, request } = context;
  
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipe_id');
    const userId = searchParams.get('user_id');
    
    if (!recipeId || !userId) {
      return new Response(JSON.stringify({
        success: false,
        error: '缺少必要参数'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM favorites WHERE recipe_id = ? AND user_id = ?'
    ).bind(recipeId, userId).first();
    
    return new Response(JSON.stringify({
      success: true,
      is_favorite: result.count > 0
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
  const { env, params, request } = context;
  
  try {
    const recipeId = params.id;
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
    
    await env.DB.prepare(
      'DELETE FROM favorites WHERE recipe_id = ? AND user_id = ?'
    ).bind(recipeId, userId).run();
    
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