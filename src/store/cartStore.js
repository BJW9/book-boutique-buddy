import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Ajouter un article au panier
      addItem: (product, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find(item => item.id === product.id)
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          set({
            items: [...items, { ...product, quantity }]
          })
        }
      },
      
      // Supprimer un article du panier
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId)
        })
      },
      
      // Mettre à jour la quantité d'un article
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },
      
      // Vider le panier
      clearCart: () => {
        set({ items: [] })
      },
      
      // Calculer le nombre total d'articles
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      // Calculer le prix total
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'cart-storage', // nom de la clé dans localStorage
      getStorage: () => localStorage, // utiliser localStorage pour la persistance
    }
  )
)

export default useCartStore
export { useCartStore }

