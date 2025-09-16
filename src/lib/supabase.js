import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérification que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variables d\'environnement Supabase manquantes. Utilisation de valeurs par défaut pour le développement.')
}

// Configuration du client Supabase
export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Types d'utilisateur
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  VENDOR: 'vendor'
}

// Fonctions d'authentification
export const auth = {
  // Inscription
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Connexion
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Déconnexion
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Obtenir la session actuelle
  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Réinitialisation du mot de passe
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  },

  // Mise à jour du mot de passe
  updatePassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  }
}

// Fonctions pour les profils utilisateur
export const profiles = {
  // Créer un profil utilisateur
  create: async (userId, profileData) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        ...profileData
      }])
      .select()
      .single()
    return { data, error }
  },

  // Obtenir un profil utilisateur
  get: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Mettre à jour un profil utilisateur
  update: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Vérifier si l'utilisateur est admin
  isAdmin: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()
    
    if (error) return { isAdmin: false, error }
    return { isAdmin: data?.role === USER_ROLES.ADMIN, error: null }
  }
}

// Fonctions pour les produits
export const products = {
  // Obtenir tous les produits actifs
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        inventory(quantity)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Obtenir un produit par ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        inventory(quantity, reserved_quantity)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single()
    return { data, error }
  },

  // Rechercher des produits
  search: async (query) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        inventory(quantity)
      `)
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}

// Fonctions pour les catégories
export const categories = {
  // Obtenir toutes les catégories actives
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    return { data, error }
  }
}

// Fonctions pour les commandes
export const orders = {
  // Créer une nouvelle commande
  create: async (orderData) => {
    const { data, error } = await supabase.rpc('create_order', orderData)
    return { data, error }
  },

  // Obtenir les commandes de l'utilisateur
  getUserOrders: async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(title, author, images)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Obtenir une commande par ID
  getById: async (orderId) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(title, author, images)
        )
      `)
      .eq('id', orderId)
      .single()
    return { data, error }
  }
}

// Fonctions pour les adresses
export const addresses = {
  // Obtenir les adresses de l'utilisateur
  getUserAddresses: async (userId) => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
    return { data, error }
  },

  // Créer une nouvelle adresse
  create: async (addressData) => {
    const { data, error } = await supabase
      .from('addresses')
      .insert([addressData])
      .select()
      .single()
    return { data, error }
  },

  // Mettre à jour une adresse
  update: async (addressId, updates) => {
    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', addressId)
      .select()
      .single()
    return { data, error }
  },

  // Supprimer une adresse
  delete: async (addressId) => {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
    return { error }
  }
}

// Fonctions pour les avis
export const reviews = {
  // Obtenir les avis d'un produit
  getProductReviews: async (productId) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(first_name, last_name)
      `)
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Créer un nouvel avis
  create: async (reviewData) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single()
    return { data, error }
  }
}

export default supabase

