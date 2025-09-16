-- =====================================================
-- BOOK BOUTIQUE BUDDY - SCHEMA DE BASE DE DONNÉES
-- =====================================================
-- Version: 1.0
-- Date: 2025-09-16
-- Description: Schéma complet pour la plateforme e-commerce

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================================
-- TYPES ÉNUMÉRÉS
-- =====================================================

CREATE TYPE user_role AS ENUM ('customer', 'admin', 'vendor');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'partially_paid', 'refunded', 'partially_refunded', 'failed');
CREATE TYPE fulfillment_status AS ENUM ('unfulfilled', 'partially_fulfilled', 'fulfilled', 'shipped', 'delivered');
CREATE TYPE address_type AS ENUM ('billing', 'shipping', 'both');
CREATE TYPE movement_type AS ENUM ('purchase', 'sale', 'adjustment', 'return', 'damage');

-- =====================================================
-- TABLES PRINCIPALES
-- =====================================================

-- Table des utilisateurs (étend auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  role user_role DEFAULT 'customer',
  preferences JSONB DEFAULT '{}',
  marketing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  image_url VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300),
  description TEXT,
  isbn VARCHAR(20) UNIQUE,
  author VARCHAR(200),
  publisher VARCHAR(200),
  publication_date DATE,
  pages INTEGER,
  format VARCHAR(50),
  language VARCHAR(10) DEFAULT 'fr',
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  weight DECIMAL(8,2),
  dimensions JSONB,
  category_id UUID REFERENCES categories(id),
  tags TEXT[],
  images JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  seo_title VARCHAR(200),
  seo_description VARCHAR(300),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de l'inventaire
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER DEFAULT 5,
  reorder_quantity INTEGER DEFAULT 20,
  location VARCHAR(100),
  last_counted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des mouvements d'inventaire
CREATE TABLE inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) NOT NULL,
  movement_type movement_type NOT NULL,
  quantity INTEGER NOT NULL,
  reference_id UUID,
  reference_type VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  fulfillment_status fulfillment_status DEFAULT 'unfulfilled',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  billing_address JSONB,
  shipping_address JSONB,
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(100),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de commande
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  product_snapshot JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des adresses
CREATE TABLE addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  type address_type NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(200),
  address_line_1 VARCHAR(200) NOT NULL,
  address_line_2 VARCHAR(200),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  state_province VARCHAR(100),
  country VARCHAR(2) NOT NULL DEFAULT 'FR',
  phone VARCHAR(20),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des avis
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  order_id UUID REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id, order_id)
);

-- =====================================================
-- CONTRAINTES DE VALIDATION
-- =====================================================

-- Contraintes sur les produits
ALTER TABLE products ADD CONSTRAINT check_price_positive CHECK (price > 0);
ALTER TABLE products ADD CONSTRAINT check_compare_price CHECK (compare_at_price IS NULL OR compare_at_price >= price);

-- Contraintes sur les commandes
ALTER TABLE orders ADD CONSTRAINT check_amounts_positive CHECK (
    subtotal >= 0 AND tax_amount >= 0 AND shipping_amount >= 0 AND total_amount >= 0
);

-- Contraintes sur l'inventaire
ALTER TABLE inventory ADD CONSTRAINT check_quantities_positive CHECK (
    quantity >= 0 AND reserved_quantity >= 0 AND reserved_quantity <= quantity
);

-- Contraintes d'unicité
ALTER TABLE inventory ADD CONSTRAINT unique_product_inventory UNIQUE (product_id);

-- Index unique conditionnel pour les adresses par défaut
CREATE UNIQUE INDEX unique_default_address ON addresses (user_id, type) 
WHERE is_default = true;

-- Index unique conditionnel pour les ISBN actifs
CREATE UNIQUE INDEX unique_active_isbn ON products (isbn) 
WHERE is_active = true AND isbn IS NOT NULL;

-- =====================================================
-- INDEX DE PERFORMANCE
-- =====================================================

-- Index pour les requêtes produit
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Index pour les commandes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Index pour les articles de commande
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Index pour l'inventaire
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(movement_type);

-- Index pour les avis
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- Index composites pour les requêtes complexes
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_products_active_featured ON products(is_active, is_featured);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_reviews_product_approved ON reviews(product_id, is_approved);

-- Index trigram pour la recherche textuelle
CREATE INDEX idx_products_search ON products USING gin (
    (title || ' ' || COALESCE(subtitle, '') || ' ' || COALESCE(author, '')) gin_trgm_ops
);

-- =====================================================
-- FONCTIONS ET TRIGGERS
-- =====================================================

-- Fonction de mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour les timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction de gestion automatique des stocks
CREATE OR REPLACE FUNCTION handle_order_inventory()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Réserver le stock lors de l'ajout d'un article
        UPDATE inventory 
        SET reserved_quantity = reserved_quantity + NEW.quantity
        WHERE product_id = NEW.product_id;
        
        -- Enregistrer le mouvement
        INSERT INTO inventory_movements (product_id, movement_type, quantity, reference_id, reference_type)
        VALUES (NEW.product_id, 'sale', -NEW.quantity, NEW.order_id, 'order');
        
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        -- Libérer le stock lors de la suppression
        UPDATE inventory 
        SET reserved_quantity = reserved_quantity - OLD.quantity
        WHERE product_id = OLD.product_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER order_items_inventory_trigger
    AFTER INSERT OR DELETE ON order_items
    FOR EACH ROW EXECUTE FUNCTION handle_order_inventory();

-- Fonction de génération automatique des numéros de commande
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    next_number INTEGER;
    year_suffix VARCHAR(2);
BEGIN
    -- Obtenir l'année courante sur 2 chiffres
    year_suffix := TO_CHAR(NOW(), 'YY');
    
    -- Obtenir le prochain numéro pour cette année
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 3) AS INTEGER)), 0) + 1
    INTO next_number
    FROM orders
    WHERE order_number LIKE year_suffix || '%';
    
    -- Générer le numéro de commande
    NEW.order_number := year_suffix || LPAD(next_number::TEXT, 6, '0');
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- VUES MATÉRIALISÉES
-- =====================================================

-- Vue des statistiques produit
CREATE MATERIALIZED VIEW product_stats AS
SELECT 
    p.id,
    p.title,
    p.price,
    i.quantity as stock_quantity,
    COALESCE(r.avg_rating, 0) as average_rating,
    COALESCE(r.review_count, 0) as review_count,
    COALESCE(s.total_sold, 0) as total_sold,
    COALESCE(s.revenue, 0) as total_revenue
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
LEFT JOIN (
    SELECT 
        product_id,
        AVG(rating) as avg_rating,
        COUNT(*) as review_count
    FROM reviews 
    WHERE is_approved = true
    GROUP BY product_id
) r ON p.id = r.product_id
LEFT JOIN (
    SELECT 
        oi.product_id,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status NOT IN ('cancelled', 'refunded')
    GROUP BY oi.product_id
) s ON p.id = s.product_id;

-- Index sur la vue matérialisée
CREATE INDEX idx_product_stats_id ON product_stats(id);
CREATE INDEX idx_product_stats_stock ON product_stats(stock_quantity);
CREATE INDEX idx_product_stats_rating ON product_stats(average_rating);

-- =====================================================
-- PROCÉDURES STOCKÉES
-- =====================================================

-- Procédure de création de commande
CREATE OR REPLACE FUNCTION create_order(
    p_user_id UUID,
    p_items JSONB,
    p_billing_address JSONB,
    p_shipping_address JSONB,
    p_shipping_method VARCHAR(100)
)
RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_product RECORD;
    v_subtotal DECIMAL(10,2) := 0;
    v_total DECIMAL(10,2) := 0;
BEGIN
    -- Créer la commande
    INSERT INTO orders (user_id, billing_address, shipping_address, shipping_method, subtotal, total_amount)
    VALUES (p_user_id, p_billing_address, p_shipping_address, p_shipping_method, 0, 0)
    RETURNING id INTO v_order_id;
    
    -- Traiter chaque article
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        -- Vérifier le produit et le stock
        SELECT * INTO v_product 
        FROM products p 
        JOIN inventory i ON p.id = i.product_id
        WHERE p.id = (v_item->>'product_id')::UUID 
        AND p.is_active = true
        AND i.quantity >= (v_item->>'quantity')::INTEGER;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Produit indisponible ou stock insuffisant: %', v_item->>'product_id';
        END IF;
        
        -- Ajouter l'article à la commande
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, product_snapshot)
        VALUES (
            v_order_id,
            v_product.id,
            (v_item->>'quantity')::INTEGER,
            v_product.price,
            v_product.price * (v_item->>'quantity')::INTEGER,
            row_to_json(v_product)::JSONB
        );
        
        v_subtotal := v_subtotal + (v_product.price * (v_item->>'quantity')::INTEGER);
    END LOOP;
    
    -- Calculer les frais (livraison gratuite pour ce projet)
    v_total := v_subtotal;
    
    -- Mettre à jour les totaux de la commande
    UPDATE orders 
    SET subtotal = v_subtotal, total_amount = v_total
    WHERE id = v_order_id;
    
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VUES DE MONITORING
-- =====================================================

-- Vue des métriques de performance
CREATE VIEW performance_metrics AS
SELECT 
    'orders_today' as metric,
    COUNT(*)::TEXT as value
FROM orders 
WHERE created_at >= CURRENT_DATE

UNION ALL

SELECT 
    'revenue_today' as metric,
    COALESCE(SUM(total_amount), 0)::TEXT as value
FROM orders 
WHERE created_at >= CURRENT_DATE 
AND status NOT IN ('cancelled', 'refunded')

UNION ALL

SELECT 
    'low_stock_products' as metric,
    COUNT(*)::TEXT as value
FROM inventory 
WHERE quantity <= reorder_level;

-- =====================================================
-- FONCTIONS DE MAINTENANCE
-- =====================================================

-- Fonction de nettoyage des données expirées
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Supprimer les mouvements d'inventaire anciens (> 2 ans)
    DELETE FROM inventory_movements 
    WHERE created_at < NOW() - INTERVAL '2 years';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Rafraîchir les vues matérialisées
    REFRESH MATERIALIZED VIEW product_stats;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DONNÉES DE TEST
-- =====================================================

-- Insertion des catégories de base
INSERT INTO categories (name, slug, description) VALUES
('Romans', 'romans', 'Romans et littérature contemporaine'),
('Sciences', 'sciences', 'Livres scientifiques et techniques'),
('Histoire', 'histoire', 'Livres d''histoire et biographies'),
('Jeunesse', 'jeunesse', 'Livres pour enfants et adolescents'),
('Essais', 'essais', 'Essais et documents');

-- Insertion du produit principal
INSERT INTO products (title, subtitle, author, publisher, isbn, price, category_id, description, images) VALUES
('Les Murmures du Temps', 
 'Une odyssée littéraire captivante', 
 'Claire Montagne', 
 'Éditions Lumière', 
 '978-2-123456-78-9', 
 24.90, 
 (SELECT id FROM categories WHERE slug = 'romans'),
 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
 '["main_product_image.jpeg", "product_thumbnail_1.jpeg", "product_thumbnail_2.jpeg", "product_thumbnail_3.jpeg"]'::JSONB
);

-- Insertion du stock
INSERT INTO inventory (product_id, quantity) VALUES
((SELECT id FROM products WHERE isbn = '978-2-123456-78-9'), 47);

-- =====================================================
-- COMMENTAIRES ET DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Profils utilisateur étendant auth.users de Supabase';
COMMENT ON TABLE categories IS 'Catégories de produits avec support hiérarchique';
COMMENT ON TABLE products IS 'Catalogue des produits avec métadonnées complètes';
COMMENT ON TABLE inventory IS 'Gestion des stocks avec réservations';
COMMENT ON TABLE orders IS 'Commandes avec workflow complet';
COMMENT ON TABLE order_items IS 'Détail des commandes avec snapshot produit';
COMMENT ON TABLE addresses IS 'Adresses utilisateur normalisées';
COMMENT ON TABLE reviews IS 'Avis clients avec modération';

COMMENT ON FUNCTION create_order IS 'Création atomique de commande avec validation des stocks';
COMMENT ON FUNCTION handle_order_inventory IS 'Gestion automatique des réservations de stock';
COMMENT ON FUNCTION generate_order_number IS 'Génération automatique des numéros de commande';

-- =====================================================
-- FIN DU SCHÉMA
-- =====================================================

