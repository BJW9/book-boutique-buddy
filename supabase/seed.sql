-- =====================================================
-- BOOK BOUTIQUE BUDDY - DONNÉES DE TEST
-- =====================================================
-- Version: 1.0
-- Date: 2025-09-16
-- Description: Jeu de données complet pour le développement et les tests

-- =====================================================
-- CATÉGORIES
-- =====================================================

INSERT INTO categories (id, name, slug, description, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Romans', 'romans', 'Romans et littérature contemporaine', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Sciences', 'sciences', 'Livres scientifiques et techniques', 2),
('550e8400-e29b-41d4-a716-446655440003', 'Histoire', 'histoire', 'Livres d''histoire et biographies', 3),
('550e8400-e29b-41d4-a716-446655440004', 'Jeunesse', 'jeunesse', 'Livres pour enfants et adolescents', 4),
('550e8400-e29b-41d4-a716-446655440005', 'Essais', 'essais', 'Essais et documents', 5),
('550e8400-e29b-41d4-a716-446655440006', 'Policier', 'policier', 'Romans policiers et thrillers', 6),
('550e8400-e29b-41d4-a716-446655440007', 'Fantasy', 'fantasy', 'Fantasy et science-fiction', 7),
('550e8400-e29b-41d4-a716-446655440008', 'Biographies', 'biographies', 'Biographies et mémoires', 8);

-- Sous-catégories
INSERT INTO categories (id, name, slug, description, parent_id, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'Romans contemporains', 'romans-contemporains', 'Littérature contemporaine', '550e8400-e29b-41d4-a716-446655440001', 1),
('550e8400-e29b-41d4-a716-446655440012', 'Classiques', 'classiques', 'Grands classiques de la littérature', '550e8400-e29b-41d4-a716-446655440001', 2),
('550e8400-e29b-41d4-a716-446655440013', 'Mathématiques', 'mathematiques', 'Livres de mathématiques', '550e8400-e29b-41d4-a716-446655440002', 1),
('550e8400-e29b-41d4-a716-446655440014', 'Physique', 'physique', 'Livres de physique', '550e8400-e29b-41d4-a716-446655440002', 2);

-- =====================================================
-- PRODUITS
-- =====================================================

-- Produit principal (celui du site original)
INSERT INTO products (
    id, title, subtitle, author, publisher, isbn, price, category_id, 
    description, pages, format, publication_date, language, 
    images, is_featured, seo_title, seo_description
) VALUES (
    '550e8400-e29b-41d4-a716-446655440101',
    'Les Murmures du Temps',
    'Une odyssée littéraire captivante',
    'Claire Montagne',
    'Éditions Lumière',
    '978-2-123456-78-9',
    24.90,
    '550e8400-e29b-41d4-a716-446655440001',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
    342,
    'Broché',
    '2024-03-15',
    'fr',
    '["main_product_image.jpeg", "product_thumbnail_1.jpeg", "product_thumbnail_2.jpeg", "product_thumbnail_3.jpeg"]'::JSONB,
    true,
    'Les Murmures du Temps - Une odyssée littéraire captivante | Librairie Lumière',
    'Découvrez "Les Murmures du Temps" de Claire Montagne, une odyssée littéraire captivante. Roman contemporain de 342 pages aux Éditions Lumière.'
);

-- Autres produits pour enrichir le catalogue
INSERT INTO products (
    id, title, subtitle, author, publisher, isbn, price, category_id, 
    description, pages, format, publication_date, language, is_active
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440102',
    'Le Mystère de la Bibliothèque',
    'Un thriller littéraire haletant',
    'Jean Dubois',
    'Éditions Mystère',
    '978-2-123456-79-0',
    19.90,
    '550e8400-e29b-41d4-a716-446655440006',
    'Un bibliothécaire découvre un manuscrit ancien qui révèle des secrets troublants sur l''histoire de sa ville. Une enquête palpitante à travers les siècles.',
    298,
    'Broché',
    '2024-01-20',
    'fr',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440103',
    'Voyage au Cœur des Étoiles',
    'Science et poésie de l''univers',
    'Marie Cosmos',
    'Éditions Scientifiques',
    '978-2-123456-80-6',
    29.90,
    '550e8400-e29b-41d4-a716-446655440002',
    'Une exploration fascinante de l''astronomie moderne, alliant rigueur scientifique et beauté poétique pour comprendre notre place dans l''univers.',
    456,
    'Relié',
    '2024-02-10',
    'fr',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440104',
    'Histoire de France Illustrée',
    'Des Gaulois à nos jours',
    'Pierre Historien',
    'Éditions Patrimoine',
    '978-2-123456-81-3',
    39.90,
    '550e8400-e29b-41d4-a716-446655440003',
    'Une histoire complète de la France richement illustrée, accessible à tous et documentée par les dernières recherches historiques.',
    612,
    'Relié',
    '2023-11-15',
    'fr',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440105',
    'Les Aventures de Petit Renard',
    'Contes pour les 3-6 ans',
    'Sophie Enfantine',
    'Éditions Jeunesse',
    '978-2-123456-82-0',
    12.90,
    '550e8400-e29b-41d4-a716-446655440004',
    'Les aventures amusantes et éducatives de Petit Renard qui découvre la forêt et se fait de nouveaux amis. Illustrations colorées incluses.',
    32,
    'Cartonné',
    '2024-04-01',
    'fr',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440106',
    'Réflexions sur le Temps Moderne',
    'Essai philosophique',
    'Antoine Penseur',
    'Éditions Réflexion',
    '978-2-123456-83-7',
    22.90,
    '550e8400-e29b-41d4-a716-446655440005',
    'Une réflexion profonde sur les enjeux de notre époque : technologie, société, environnement et humanité dans un monde en mutation.',
    278,
    'Broché',
    '2024-03-01',
    'fr',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440107',
    'Le Royaume des Dragons',
    'Fantasy épique - Tome 1',
    'Élise Fantastique',
    'Éditions Imaginaire',
    '978-2-123456-84-4',
    16.90,
    '550e8400-e29b-41d4-a716-446655440007',
    'Dans un monde où les dragons règnent encore, une jeune héroïne découvre qu''elle possède un don unique qui pourrait changer le destin de tous.',
    387,
    'Broché',
    '2024-02-28',
    'fr',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440108',
    'Napoléon : L''Homme et la Légende',
    'Biographie complète',
    'Michel Biographe',
    'Éditions Histoire',
    '978-2-123456-85-1',
    34.90,
    '550e8400-e29b-41d4-a716-446655440008',
    'La biographie définitive de Napoléon Bonaparte, de sa jeunesse corse à son exil à Sainte-Hélène, basée sur des archives inédites.',
    523,
    'Relié',
    '2023-12-05',
    'fr',
    true
);

-- =====================================================
-- INVENTAIRE
-- =====================================================

INSERT INTO inventory (product_id, quantity, reorder_level, reorder_quantity) VALUES
('550e8400-e29b-41d4-a716-446655440101', 47, 10, 25),  -- Les Murmures du Temps
('550e8400-e29b-41d4-a716-446655440102', 23, 5, 15),   -- Le Mystère de la Bibliothèque
('550e8400-e29b-41d4-a716-446655440103', 15, 3, 10),   -- Voyage au Cœur des Étoiles
('550e8400-e29b-41d4-a716-446655440104', 8, 2, 5),     -- Histoire de France Illustrée
('550e8400-e29b-41d4-a716-446655440105', 35, 10, 20),  -- Les Aventures de Petit Renard
('550e8400-e29b-41d4-a716-446655440106', 18, 5, 12),   -- Réflexions sur le Temps Moderne
('550e8400-e29b-41d4-a716-446655440107', 28, 8, 15),   -- Le Royaume des Dragons
('550e8400-e29b-41d4-a716-446655440108', 12, 3, 8);    -- Napoléon : L'Homme et la Légende

-- =====================================================
-- UTILISATEURS DE TEST
-- =====================================================
-- Note: Les utilisateurs seront créés via l'authentification Supabase
-- Ici nous préparons les profils étendus qui seront liés après inscription

-- =====================================================
-- COMMANDES DE TEST
-- =====================================================
-- Ces données seront ajoutées après la création des utilisateurs via l'interface

-- Exemple de structure pour les commandes de test (à adapter selon les UUID utilisateurs réels)
/*
INSERT INTO orders (id, user_id, status, subtotal, total_amount, billing_address, shipping_address) VALUES
('550e8400-e29b-41d4-a716-446655440201', 
 'user-uuid-here', 
 'delivered', 
 44.80, 
 44.80,
 '{"first_name": "Jean", "last_name": "Dupont", "address_line_1": "123 Rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "FR"}'::JSONB,
 '{"first_name": "Jean", "last_name": "Dupont", "address_line_1": "123 Rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "FR"}'::JSONB
);

INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, product_snapshot) VALUES
('550e8400-e29b-41d4-a716-446655440201',
 '550e8400-e29b-41d4-a716-446655440101',
 1,
 24.90,
 24.90,
 '{"title": "Les Murmures du Temps", "author": "Claire Montagne", "price": 24.90}'::JSONB
),
('550e8400-e29b-41d4-a716-446655440201',
 '550e8400-e29b-41d4-a716-446655440102',
 1,
 19.90,
 19.90,
 '{"title": "Le Mystère de la Bibliothèque", "author": "Jean Dubois", "price": 19.90}'::JSONB
);
*/

-- =====================================================
-- AVIS DE TEST
-- =====================================================
-- Ces données seront ajoutées après la création des utilisateurs

-- Exemple de structure pour les avis de test
/*
INSERT INTO reviews (product_id, user_id, rating, title, content, is_approved, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440101',
 'user-uuid-here',
 5,
 'Un livre extraordinaire !',
 'J''ai été complètement captivé par cette histoire. L''écriture de Claire Montagne est sublime et l''intrigue parfaitement menée. Je recommande vivement !',
 true,
 true
),
('550e8400-e29b-41d4-a716-446655440101',
 'user-uuid-2-here',
 4,
 'Très bon roman',
 'Une belle découverte littéraire. Quelques longueurs par moments mais dans l''ensemble une lecture très agréable.',
 true,
 true
);
*/

-- =====================================================
-- MOUVEMENTS D'INVENTAIRE INITIAUX
-- =====================================================

INSERT INTO inventory_movements (product_id, movement_type, quantity, reference_type, notes) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'purchase', 50, 'initial_stock', 'Stock initial - Les Murmures du Temps'),
('550e8400-e29b-41d4-a716-446655440102', 'purchase', 25, 'initial_stock', 'Stock initial - Le Mystère de la Bibliothèque'),
('550e8400-e29b-41d4-a716-446655440103', 'purchase', 15, 'initial_stock', 'Stock initial - Voyage au Cœur des Étoiles'),
('550e8400-e29b-41d4-a716-446655440104', 'purchase', 10, 'initial_stock', 'Stock initial - Histoire de France Illustrée'),
('550e8400-e29b-41d4-a716-446655440105', 'purchase', 40, 'initial_stock', 'Stock initial - Les Aventures de Petit Renard'),
('550e8400-e29b-41d4-a716-446655440106', 'purchase', 20, 'initial_stock', 'Stock initial - Réflexions sur le Temps Moderne'),
('550e8400-e29b-41d4-a716-446655440107', 'purchase', 30, 'initial_stock', 'Stock initial - Le Royaume des Dragons'),
('550e8400-e29b-41d4-a716-446655440108', 'purchase', 15, 'initial_stock', 'Stock initial - Napoléon : L''Homme et la Légende');

-- Quelques ventes simulées pour Les Murmures du Temps
INSERT INTO inventory_movements (product_id, movement_type, quantity, reference_type, notes) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'sale', -2, 'manual_sale', 'Vente en magasin'),
('550e8400-e29b-41d4-a716-446655440101', 'sale', -1, 'manual_sale', 'Vente en ligne'),
('550e8400-e29b-41d4-a716-446655440102', 'sale', -2, 'manual_sale', 'Vente en magasin'),
('550e8400-e29b-41d4-a716-446655440104', 'sale', -2, 'manual_sale', 'Vente spéciale'),
('550e8400-e29b-41d4-a716-446655440105', 'sale', -5, 'manual_sale', 'Commande école');

-- =====================================================
-- RAFRAÎCHISSEMENT DES VUES MATÉRIALISÉES
-- =====================================================

REFRESH MATERIALIZED VIEW product_stats;

-- =====================================================
-- VÉRIFICATIONS
-- =====================================================

-- Vérifier que les données ont été insérées correctement
SELECT 'Catégories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Produits' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Inventaire' as table_name, COUNT(*) as count FROM inventory
UNION ALL
SELECT 'Mouvements inventaire' as table_name, COUNT(*) as count FROM inventory_movements;

-- Vérifier les stocks actuels
SELECT 
    p.title,
    p.author,
    p.price,
    i.quantity as stock,
    i.reserved_quantity as reserved
FROM products p
JOIN inventory i ON p.id = i.product_id
ORDER BY p.title;

-- Vérifier les statistiques produit
SELECT 
    title,
    stock_quantity,
    total_sold,
    total_revenue
FROM product_stats
ORDER BY title;

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE categories IS 'Données de test : 8 catégories principales + 4 sous-catégories';
COMMENT ON TABLE products IS 'Données de test : 8 produits incluant le produit principal du site';
COMMENT ON TABLE inventory IS 'Données de test : stocks initiaux pour tous les produits';
COMMENT ON TABLE inventory_movements IS 'Données de test : mouvements d''inventaire simulés';

-- =====================================================
-- FIN DES DONNÉES DE TEST
-- =====================================================

