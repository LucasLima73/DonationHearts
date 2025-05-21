-- Adicionar campos para a funcionalidade de visualização de impacto emocional
ALTER TABLE campaigns 
  ADD COLUMN IF NOT EXISTS before_story TEXT,
  ADD COLUMN IF NOT EXISTS after_story TEXT,
  ADD COLUMN IF NOT EXISTS before_image_url TEXT,
  ADD COLUMN IF NOT EXISTS after_image_url TEXT,
  ADD COLUMN IF NOT EXISTS impact_description TEXT;