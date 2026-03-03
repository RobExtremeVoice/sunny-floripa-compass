-- Blog Photos & SEO Migration
-- Adds real Unsplash cover photos to all 42 posts missing them
-- Unpublishes 6 confirmed thin duplicate posts to avoid SEO duplicate content penalty

-- ===========================
-- UNPUBLISH DUPLICATE POSTS
-- ===========================
-- These are confirmed thin duplicates (< 900 chars) of longer, higher-quality posts
UPDATE blog_posts SET is_published = false WHERE slug IN (
  'como-chegar-florianopolis-guia-transporte-completo',   -- dup of como-chegar-deslocar-florianopolis-transporte
  'guia-praias-norte-florianopolis-jurere-daniela',        -- dup of guia-praias-norte-florianopolis
  'melhor-epoca-visitar-florianopolis-guia-mensal',        -- dup of quando-visitar-florianopolis-melhor-epoca
  'praias-surfar-florianopolis-ondas-perfeitas',           -- dup of praias-surfe-florianopolis-melhores-ondas
  'o-que-levar-mala-florianopolis-checklist-estacao',      -- dup of o-que-levar-florianopolis-lista-completa
  'seguranca-florianopolis-dicas-essenciais-turistas'      -- dup of seguranca-florianopolis-dicas-turistas
);

-- ===========================
-- COVER PHOTOS — AVENTURA
-- ===========================
UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1541625602538-5f4e338fec9d?w=1200&q=80'
  WHERE slug = 'ciclismo-florianopolis-roteiros-bikes' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=1200&q=80'
  WHERE slug = 'melhores-trilhas-florianopolis-aventureiros' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&q=80'
  WHERE slug = 'mergulho-florianopolis-mundo-submarino' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1559827291-72b2e42b0f77?w=1200&q=80'
  WHERE slug = 'mergulho-florianopolis-pontos-cursos' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&q=80'
  WHERE slug = 'parapente-florianopolis-voando-sobre-ilha' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1474449213430-a99ecf3b83a1?w=1200&q=80'
  WHERE slug = 'parapente-florianopolis-voo-livre' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80'
  WHERE slug = 'stand-up-paddle-florianopolis-guia' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=1200&q=80'
  WHERE slug = 'stand-up-paddle-florianopolis-melhores-locais' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80'
  WHERE slug = 'trilhas-florianopolis-caminhos-imperdiveis-aventureiros' AND cover_image IS NULL;

-- ===========================
-- COVER PHOTOS — DICAS
-- ===========================
UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80'
  WHERE slug = 'como-chegar-deslocar-florianopolis-transporte' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80'
  WHERE slug = 'como-chegar-florianopolis-guia-transporte-completo' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80'
  WHERE slug = 'florianopolis-economica-dicas-economizar' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
  WHERE slug = 'melhor-epoca-visitar-florianopolis-guia-mensal' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'
  WHERE slug = 'o-que-levar-florianopolis-lista-completa' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'
  WHERE slug = 'o-que-levar-mala-florianopolis-checklist-estacao' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
  WHERE slug = 'quando-visitar-florianopolis-melhor-epoca' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80'
  WHERE slug = 'seguranca-florianopolis-dicas-essenciais-turistas' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80'
  WHERE slug = 'seguranca-florianopolis-dicas-turistas' AND cover_image IS NULL;

-- ===========================
-- COVER PHOTOS — GASTRONOMIA
-- ===========================
UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&q=80'
  WHERE slug = 'cafeterias-especiais-florianopolis-coffee-lovers' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80'
  WHERE slug = 'comida-de-rua-florianopolis-melhores-petiscos' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80'
  WHERE slug = 'melhores-cafeterias-cafe-manha-florianopolis' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80'
  WHERE slug = 'melhores-restaurantes-frutos-do-mar-florianopolis' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80'
  WHERE slug = 'onde-comer-ostras-florianopolis-guia-definitivo' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80'
  WHERE slug = 'restaurantes-vista-mar-florianopolis-ceias' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80'
  WHERE slug = 'roteiro-gastronomico-florianopolis-5-dias' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80'
  WHERE slug = 'street-food-florianopolis-melhor-comida-rua' AND cover_image IS NULL;

-- ===========================
-- COVER PHOTOS — PRAIAS
-- ===========================
UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
  WHERE slug = 'guia-praias-norte-florianopolis' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80'
  WHERE slug = 'guia-praias-norte-florianopolis-jurere-daniela' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80'
  WHERE slug = 'praias-mais-bonitas-florianopolis-2026' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'
  WHERE slug = 'praias-piscinas-naturais-florianopolis' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80'
  WHERE slug = 'praias-secretas-florianopolis-7-tesouros-escondidos' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80'
  WHERE slug = 'praias-secretas-florianopolis-tesouros-escondidos' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&q=80'
  WHERE slug = 'praias-surfar-florianopolis-ondas-perfeitas' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&q=80'
  WHERE slug = 'praias-surfe-florianopolis-melhores-ondas' AND cover_image IS NULL;

-- ===========================
-- COVER PHOTOS — ROTEIROS
-- ===========================
UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80'
  WHERE slug = 'florianopolis-casais-roteiro-romantico' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1536746803623-cef87080bfc8?w=1200&q=80'
  WHERE slug = 'florianopolis-criancas-roteiro-familiar' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1663001899005-a76fd718e2bf?w=1200&q=80'
  WHERE slug = 'roteiro-3-dias-florianopolis-essencial' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1601826387819-231bf0c7d477?w=1200&q=80'
  WHERE slug = 'roteiro-7-dias-florianopolis-completo' AND cover_image IS NULL;

-- ===========================
-- COVER PHOTOS — VIDA NOTURNA
-- ===========================
UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80'
  WHERE slug = 'bares-lagoa-conceicao-noite-animada-floripa' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=1200&q=80'
  WHERE slug = 'cervejarias-artesanais-florianopolis-rota-cerveja' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80'
  WHERE slug = 'festas-reveillon-florianopolis-fim-ano' AND cover_image IS NULL;

UPDATE blog_posts
  SET cover_image = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80'
  WHERE slug = 'shows-eventos-culturais-florianopolis-agenda' AND cover_image IS NULL;
