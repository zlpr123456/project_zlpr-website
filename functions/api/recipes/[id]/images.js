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
    const thumbnail = formData.get('thumbnail');
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
    
    const r2Url = `https://image.08202010.xyz/${key}`;
    
    let thumbnailUrl = null;
    let thumbnailKey = null;
    
    if (thumbnail) {
      thumbnailKey = `recipes/${recipeId}/thumb-${Date.now()}-${file.name}`;
      await env.MY_BUCKET.put(thumbnailKey, thumbnail);
      thumbnailUrl = `https://image.08202010.xyz/${thumbnailKey}`;
    }
    
    if (isCover) {
      await env.DB.prepare(
        'UPDATE images SET is_cover = 0 WHERE recipe_id = ?'
      ).bind(recipeId).run();
    }
    
    const result = await env.DB.prepare(`
      INSERT INTO images (recipe_id, r2_key, r2_url, thumbnail_key, thumbnail_url, is_cover)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(recipeId, key, r2Url, thumbnailKey, thumbnailUrl, isCover ? 1 : 0).run();
    
    return new Response(JSON.stringify({
      success: true,
      image: {
        id: result.meta.last_row_id,
        r2_url: r2Url,
        thumbnail_url: thumbnailUrl,
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

export async function onRequestDELETE(context) {
  const { env, params, request } = context;
  
  try {
    const recipeId = params.id;
    const urlParts = request.url.split('/');
    const imageId = urlParts[urlParts.length - 1];
    
    if (!recipeId || !imageId) {
      return new Response(JSON.stringify({
        success: false,
        error: '缺少必要参数'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const image = await env.DB.prepare(
      'SELECT r2_key, thumbnail_key FROM images WHERE id = ? AND recipe_id = ?'
    ).bind(imageId, recipeId).first();
    
    if (!image) {
      return new Response(JSON.stringify({
        success: false,
        error: '图片不存在'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await env.DB.prepare(
      'DELETE FROM images WHERE id = ? AND recipe_id = ?'
    ).bind(imageId, recipeId).run();
    
    if (image.r2_key) {
      try {
        await env.MY_BUCKET.delete(image.r2_key);
      } catch (error) {
        console.error('删除原图失败:', error);
      }
    }
    
    if (image.thumbnail_key) {
      try {
        await env.MY_BUCKET.delete(image.thumbnail_key);
      } catch (error) {
        console.error('删除缩略图失败:', error);
      }
    }
    
    return new Response(null, {
      status: 204,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('删除图片失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
