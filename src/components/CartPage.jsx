import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useMockAuth } from '../contexts/MockAuthContext'

const CartPage = ({ onCheckout }) => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const { isAuthenticated } = useMockAuth()

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout()
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6">
            Découvrez notre sélection de livres et ajoutez vos favoris au panier.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Découvrir nos livres
          </Button>
        </div>
      </div>
    )
  }

  const shippingCost = 4.90
  const totalWithShipping = getTotalPrice() + shippingCost

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier</h1>
        <p className="text-gray-600">{items.length} article{items.length !== 1 ? 's' : ''} dans votre panier</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Articles du panier */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Image du produit */}
                  <div className="w-20 h-28 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>

                  {/* Informations du produit */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Par {item.author}</p>
                    <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      {/* Contrôles de quantité */}
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Prix et suppression */}
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              €{item.price.toFixed(2)} chacun
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Actions du panier */}
          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Vider le panier
            </Button>
            <Button variant="outline">
              Continuer les achats
            </Button>
          </div>
        </div>

        {/* Résumé de commande */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Résumé de commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Détail des prix */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total ({items.length} article{items.length !== 1 ? 's' : ''})</span>
                  <span>€{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span>€{shippingCost.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>€{totalWithShipping.toFixed(2)}</span>
                </div>
              </div>

              {/* Informations de livraison */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Livraison Mondial Relay</h4>
                <p className="text-xs text-gray-600">
                  Livraison en 2-3 jours ouvrés • Point Relais ou Domicile
                </p>
              </div>

              {/* Bouton de commande */}
              <div className="space-y-3">
                {isAuthenticated() ? (
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    Passer commande
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="lg"
                    >
                      Se connecter pour commander
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Vous devez être connecté pour passer commande
                    </p>
                  </div>
                )}
                
                <Button variant="outline" className="w-full" size="lg">
                  Payer avec PayPal
                </Button>
              </div>

              {/* Badges de confiance */}
              <div className="pt-4 space-y-2">
                <Badge variant="outline" className="w-full justify-center">
                  🔒 Paiement sécurisé
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  📦 Livraison rapide
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  ↩️ Retours gratuits
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CartPage

