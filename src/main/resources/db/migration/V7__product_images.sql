ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';

UPDATE products
SET images = CASE
                 WHEN image_url IS NOT NULL AND image_url <> ''
                     THEN to_jsonb(ARRAY[image_url])
                 ELSE '[]'::jsonb
    END;

ALTER TABLE products DROP COLUMN IF EXISTS image_url;
