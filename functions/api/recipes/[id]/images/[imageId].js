export async function onRequestDELETE(context) {
  const { env, params } = context;
  
  try {
    const recipeId = params.id;
    const imageId = params.imageId;
    
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
    
    return new Response(JSON.stringify({
      success: true,
      message: '图片删除成功'
    }), {
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