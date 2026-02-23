-- 为现有images表添加缩略图字段
ALTER TABLE images ADD COLUMN thumbnail_key TEXT;
ALTER TABLE images ADD COLUMN thumbnail_url TEXT;
