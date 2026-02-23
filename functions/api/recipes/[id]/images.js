export async function onRequestGet(context) {
  const { env, params } = context;
  
  try {
    const recipeId = params.id;
    
    const result = await env.DB.prepare(
      'SELECT * FROM images WHERE recipe_id = ? ORDER BY is_cover DESC, created_at ASC'
    ).bind(recipeId).all();
    
    return new Response(JSON.stringify({
      success: true,
      images: result.results
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
  const { env, params, request } = context;
  
  try {
    const recipeId = params.id;
    const formData = await request.formData();
    const file = formData.get('file');
    const isCover = formData.get('is_cover') === '1';
    
    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: '请选择图片文件'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({
        success: false,
        error: '图片大小不能超过5MB'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        success: false,
        error: '只支持 JPG、PNG、GIF、WebP 格式的图片'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const key = `recipes/${recipeId}/${Date.now()}-${file.name}`;
    await env.MY_BUCKET.put(key, file);
    
    const r2Url = `https://08202010.xyz/recipe-images/${key}`;
    
    if (isCover) {
      await env.DB.prepare(
        'UPDATE images SET is_cover = 0 WHERE recipe_id = ?'
      ).bind(recipeId).run();
    }
    
    const result = await env.DB.prepare(`
      INSERT INTO images (recipe_id, r2_key, r2_url, is_cover)
      VALUES (?, ?, ?, ?)
    `).bind(recipeId, key, r2Url, isCover ? 1 : 0).run();
    
    return new Response(JSON.stringify({
      success: true,
      image: {
        id: result.meta.last_row_id,
        r2_url: r2Url,
        is_cover: isCover
      }
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