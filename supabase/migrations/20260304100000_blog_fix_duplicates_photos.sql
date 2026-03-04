-- ============================================================
-- Blog Fix: despublicar artigos duplicados + corrigir fotos
-- ============================================================

-- ------------------------------------------------------------
-- PARTE 1: Despublicar artigos duplicados (mesmos temas/títulos)
-- Critério: manter o artigo com slug mais descritivo e atualizado
-- ------------------------------------------------------------

-- Mergulho (duplicado — manter 'pontos-cursos')
UPDATE blog_posts SET is_published = false
WHERE slug = 'mergulho-florianopolis-mundo-submarino';

-- Parapente (duplicado — manter 'voando-sobre-ilha')
UPDATE blog_posts SET is_published = false
WHERE slug = 'parapente-florianopolis-voo-livre';

-- Stand-up Paddle (duplicado — manter 'melhores-locais')
UPDATE blog_posts SET is_published = false
WHERE slug = 'stand-up-paddle-florianopolis-guia';

-- Trilhas (duplicado — manter 'caminhos-imperdiveis-aventureiros')
UPDATE blog_posts SET is_published = false
WHERE slug = 'trilhas-florianopolis-guia-completo';

-- Como Chegar (duplicado — manter 'deslocar', mais completo)
UPDATE blog_posts SET is_published = false
WHERE slug = 'como-chegar-florianopolis-transporte';

-- Praias Secretas (títulos idênticos — manter '7-tesouros-escondidos')
UPDATE blog_posts SET is_published = false
WHERE slug = 'praias-secretas-florianopolis-tesouros-escondidos';

-- ------------------------------------------------------------
-- PARTE 2: Corrigir fotos duplicadas e contextualmente erradas
-- ------------------------------------------------------------

-- 'praias-imperdiveis-florianopolis-2026'
-- Era: mesma foto de 'quando-visitar' (praia genérica)
-- Agora: vista aérea costeira (liberada de parapente-voo-livre)
UPDATE blog_posts
SET cover_image = 'https://images.unsplash.com/photo-1474449213430-a99ecf3b83a1?w=1200&q=80'
WHERE slug = 'praias-imperdiveis-florianopolis-2026';

-- 'guia-praias-norte-florianopolis'
-- Era: mesma foto de 'quando-visitar' (praia genérica)
-- Agora: praia com água cristalina/SUP (liberada de stand-up-paddle-guia)
UPDATE blog_posts
SET cover_image = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80'
WHERE slug = 'guia-praias-norte-florianopolis';

-- 'restaurantes-vista-mar-florianopolis-ceias'
-- Era: mesma foto de 'melhores-restaurantes-frutos-do-mar' (restaurante genérico)
-- Agora: ambiente de restaurante sofisticado com vista
UPDATE blog_posts
SET cover_image = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80'
WHERE slug = 'restaurantes-vista-mar-florianopolis-ceias';

-- 'praias-piscinas-naturais-florianopolis'
-- Era: foto de paisagem montanhosa/costeira aérea (incorreta para piscinas naturais)
-- Agora: mergulho/águas cristalinas subaquáticas (liberada de mergulho-mundo-submarino)
UPDATE blog_posts
SET cover_image = 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&q=80'
WHERE slug = 'praias-piscinas-naturais-florianopolis';

-- 'vida-noturna-florianopolis'
-- Era: mesma foto de 'bares-lagoa-conceicao' (bar genérico)
-- Agora: vida noturna/luzes neon de bar
UPDATE blog_posts
SET cover_image = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80'
WHERE slug = 'vida-noturna-florianopolis';

-- 'seguranca-florianopolis-dicas-turistas'
-- Era: foto de onda do mar (sem relação com segurança)
-- Agora: aeroporto/chegada (viagem segura, deslocamento)
UPDATE blog_posts
SET cover_image = 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1200&q=80'
WHERE slug = 'seguranca-florianopolis-dicas-turistas';

-- ------------------------------------------------------------
-- Verificação final
-- ------------------------------------------------------------
SELECT slug, title, category, cover_image, is_published
FROM blog_posts
WHERE is_published = true
ORDER BY category, title;
