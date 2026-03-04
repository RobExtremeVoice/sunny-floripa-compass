-- Adiciona as 12 praias faltantes para completar as 42 praias de Florianópolis
-- Regiões: Norte (+2), Leste (+2), Oeste (+4), Sul (+4)

INSERT INTO beaches (name, slug, description, region, latitude, longitude, photo_url, photos, characteristics, infrastructure, wave_intensity, sand_type, best_season, difficulty_access, length_meters)
VALUES

-- ============================================================
-- NORTE (+2)
-- ============================================================
(
  'Capivari',
  'capivari',
  'Praia pequena e tranquila encravada entre Ponta das Canas e os Ingleses. Poucas ondas, ótima para famílias com crianças e pescadores artesanais que ainda habitam a orla.',
  'Norte',
  -27.4551, -48.3795,
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
  '{}',
  ARRAY['calm','family','fishing'],
  ARRAY['parking'],
  'calm',
  'fine_white',
  'summer',
  'easy',
  600
),
(
  'Pererequê',
  'perequeque',
  'Praia recuada e praticamente selvagem próxima à Cachoeira do Bom Jesus. Acesso por trilha curta entre restinga; ideal para quem busca sossego longe das multidões do Norte da ilha.',
  'Norte',
  -27.4340, -48.4082,
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
  '{}',
  ARRAY['calm','nature','wild'],
  ARRAY[],
  'calm',
  'fine_white',
  'summer',
  'moderate',
  400
),

-- ============================================================
-- LESTE (+2)
-- ============================================================
(
  'Rio Vermelho',
  'rio-vermelho',
  'Praia extensa e ventosa no Distrito de Rio Vermelho, bastante frequentada por surfistas e kitesurfistas. A Lagoa do Peri fica por perto; a orla tem bares e quiosques animados.',
  'Leste',
  -27.5706, -48.4343,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  '{}',
  ARRAY['surf','urban','sports'],
  ARRAY['parking','restaurants'],
  'strong',
  'fine_white',
  'all_year',
  'easy',
  3200
),
(
  'Costa da Lagoa',
  'costa-da-lagoa',
  'Comunidade isolada às margens da Lagoa da Conceição, acessível apenas de barco ou por trilha. Restaurantes de frutos do mar à beira d''água e natureza exuberante de Mata Atlântica fazem desta praia um destino único.',
  'Leste',
  -27.5910, -48.4680,
  'https://images.unsplash.com/photo-1535530992830-e25d07cfa780?w=800',
  '{}',
  ARRAY['calm','nature','gastronomy','culture'],
  ARRAY['restaurants'],
  'calm',
  'coarse',
  'all_year',
  'hard',
  1200
),

-- ============================================================
-- OESTE (+4)
-- ============================================================
(
  'Sambaqui',
  'sambaqui',
  'Vila açoriana preservada às margens da Baía Norte. Águas calmas e esverdeadas, cais de madeira e restaurantes de ostras criadas no local. Um dos destinos gastronômicos mais charmosos da ilha.',
  'Oeste',
  -27.4843, -48.5381,
  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800',
  '{}',
  ARRAY['calm','culture','gastronomy','history'],
  ARRAY['parking','restaurants'],
  'calm',
  'coarse',
  'all_year',
  'easy',
  900
),
(
  'Santo Antônio de Lisboa',
  'santo-antonio-de-lisboa',
  'O mais histórico dos balneários da costa oeste. A freguesia açoriana é tombada pelo patrimônio histórico: casarões coloniais, igrejas do século XVIII e ateliers de artesanato cercam uma praia tranquila voltada para o pôr do sol.',
  'Oeste',
  -27.5041, -48.5356,
  'https://images.unsplash.com/photo-1573408250919-62fb3c0a9c00?w=800',
  '{}',
  ARRAY['calm','culture','history','sunset','gastronomy'],
  ARRAY['parking','restaurants'],
  'calm',
  'coarse',
  'all_year',
  'easy',
  700
),
(
  'Saco Grande',
  'saco-grande',
  'Praia urbana tranquila no bairro de Saco Grande, com águas rasas e calmas da Baía Norte. Popular entre moradores locais para banhos matinais e caminhadas pela orla arborizada.',
  'Oeste',
  -27.5131, -48.5272,
  'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=800',
  '{}',
  ARRAY['calm','family','urban'],
  ARRAY['parking'],
  'calm',
  'coarse',
  'summer',
  'easy',
  800
),
(
  'Barra do Sambaqui',
  'barra-do-sambaqui',
  'Pequena praia logo ao norte de Sambaqui, no ponto onde um riacho deságua na Baía Norte. Ambiente bucólico, barcos de pesca atracados e vista para o continente fazem dela um recanto raro na costa oeste.',
  'Oeste',
  -27.4910, -48.5351,
  'https://images.unsplash.com/photo-1520626919672-f4fe928f4da9?w=800',
  '{}',
  ARRAY['calm','fishing','nature'],
  ARRAY[],
  'calm',
  'coarse',
  'all_year',
  'easy',
  350
),

-- ============================================================
-- SUL (+4)
-- ============================================================
(
  'Retiro',
  'retiro',
  'Praia selvagem entre o Pântano do Sul e a Armação, acessível por trilha de cerca de 20 minutos. Sem infraestrutura, com ondas fortes e cenário de mata atlântica descendo até a areia — destino preferido de surfistas e naturistas.',
  'Sul',
  -27.7571, -48.4904,
  'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800',
  '{}',
  ARRAY['surf','wild','nature','adventure'],
  ARRAY[],
  'strong',
  'fine_white',
  'all_year',
  'moderate',
  900
),
(
  'Caieira da Barra do Sul',
  'caieira-da-barra-do-sul',
  'Comunidade pesqueira no extremo sul da ilha, próxima ao Naufragados. Acesso de barco ou trilha pelo Parque Estadual da Serra do Tabuleiro. Paisagem de tirar o fôlego com falésias, pedras e mata nativa.',
  'Sul',
  -27.7773, -48.5449,
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800',
  '{}',
  ARRAY['wild','nature','fishing','adventure','trails'],
  ARRAY[],
  'moderate',
  'coarse',
  'all_year',
  'hard',
  600
),
(
  'Caiacanga-Açu',
  'caiacanga-acu',
  'Praia isolada no extremo sul da Ilha de Santa Catarina, dentro de área de proteção ambiental. Acessível apenas por trilha ou caiaque. Areia grossa, pedras e mar agitado criam um cenário primitivo e deslumbrante.',
  'Sul',
  -27.7843, -48.5231,
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
  '{}',
  ARRAY['wild','nature','adventure','trails'],
  ARRAY[],
  'strong',
  'coarse',
  'all_year',
  'hard',
  500
),
(
  'Carioca',
  'carioca',
  'Praia pequeníssima e quase secreta encravada entre rochedos no sul da ilha, acessível por trilha a partir de Naufragados. Poça natural de água cristalina formada pelas pedras é o grande atrativo — verdadeiro paraíso escondido.',
  'Sul',
  -27.7854, -48.5163,
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  '{}',
  ARRAY['wild','nature','adventure','snorkeling'],
  ARRAY[],
  'moderate',
  'coarse',
  'all_year',
  'hard',
  200
)

ON CONFLICT (slug) DO NOTHING;
