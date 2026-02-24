export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    const result = await env.DB.prepare(
      'SELECT id, name FROM categories WHERE is_active = 1 ORDER BY name ASC'
    ).all();
    
    return new Response(JSON.stringify({
      success: true,
      categories: result.results
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