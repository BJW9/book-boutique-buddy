-- =====================================================
-- BOOK BOUTIQUE BUDDY - POLITIQUES ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Version: 1.0
-- Date: 2025-09-16
-- Description: Définition des politiques RLS pour chaque table

-- =====================================================
-- FONCTIONS RLS
-- =====================================================

-- Fonction pour vérifier si l'utilisateur est un administrateur
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
  BEGIN
    RETURN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
  END;
$$;

-- =====================================================
-- POLITIQUES RLS PAR TABLE
-- =====================================================

-- Table: users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all user profiles" ON users FOR SELECT USING (is_admin());
CREATE POLICY "Users can create their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can create user profiles" ON users FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all user profiles" ON users FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete user profiles" ON users FOR DELETE USING (is_admin());

-- Table: categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Table: products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Table: inventory
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage inventory" ON inventory FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Table: inventory_movements
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view inventory movements" ON inventory_movements FOR SELECT USING (is_admin());
CREATE POLICY "Prevent non-admin inventory movement changes" ON inventory_movements FOR ALL 
  USING (is_admin()) WITH CHECK (is_admin());

-- Table: orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "Authenticated users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can create orders" ON orders FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update all orders" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete orders" ON orders FOR DELETE USING (is_admin());

-- Table: order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage order items" ON order_items FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Table: addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all addresses" ON addresses FOR SELECT USING (is_admin());
CREATE POLICY "Users can manage their own addresses" ON addresses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all addresses" ON addresses FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Table: reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews are viewable by everyone" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view their own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all reviews" ON reviews FOR SELECT USING (is_admin());
CREATE POLICY "Authenticated users can create reviews for purchased products" ON reviews FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.product_id = reviews.product_id AND o.user_id = auth.uid() AND o.status = 'delivered')
);
CREATE POLICY "Admins can create reviews" ON reviews FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Users can update their own unapproved reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id AND is_approved = false);
CREATE POLICY "Admins can update all reviews" ON reviews FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete reviews" ON reviews FOR DELETE USING (is_admin());

