import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { 
  CreditCard, 
  MapPin, 
  Package, 
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Truck
} from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useMockAuth } from '../../contexts/MockAuthContext'

const CheckoutPage = ({ onBack, onOrderComplete }) => {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user, profile, isAuthenticated } = useMockAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  const [shippingInfo, setShippingInfo] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France'
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  const steps = [
    { id: 1, title: 'Livraison', icon: MapPin },
    { id: 2, title: 'Paiement', icon: CreditCard },
    { id: 3, title: 'Confirmation', icon: CheckCircle }
  ]

  const shippingCost = 4.90
  const totalWithShipping = getTotalPrice() + shippingCost

  useEffect(() => {
    if (!isAuthenticated()) {
      setError('Vous devez être connecté pour passer commande')
    }
  }, [isAuthenticated])

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    // Validation des champs obligatoires
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'postalCode']
    const missingFields = requiredFields.filter(field => !shippingInfo[field])
    
    if (missingFields.length > 0) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    setCurrentStep(2)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation du paiement
      if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.cardName) {
        throw new Error('Veuillez remplir toutes les informations de paiement')
      }

      // Simulation du traitement de paiement
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Génération du numéro de commande
      const orderNum = `CMD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
      setOrderNumber(orderNum)

      // Vider le panier
      clearCart()
      
      setCurrentStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (section, field, value) => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }))
    } else if (section === 'payment') {
      setPaymentInfo(prev => ({ ...prev, [field]: value }))
    }
  }

  if (!isAuthenticated()) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous devez être connecté pour passer commande. Veuillez vous connecter ou créer un compte.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h2>
        <p className="text-gray-600 mb-4">Ajoutez des articles à votre panier pour passer commande.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux achats
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Finaliser la commande</h1>
        </div>
      </div>

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : isActive 
                    ? 'bg-purple-600 border-purple-600 text-white' 
                    : 'border-gray-300 text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire principal */}
        <div className="lg:col-span-2">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Étape 1: Informations de livraison */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Informations de livraison
                </CardTitle>
                <CardDescription>
                  Où souhaitez-vous recevoir votre commande ?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street">Adresse *</Label>
                    <Input
                      id="street"
                      value={shippingInfo.street}
                      onChange={(e) => handleInputChange('shipping', 'street', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleInputChange('shipping', 'country', e.target.value)}
                      disabled
                    />
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Continuer vers le paiement
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Étape 2: Paiement */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Informations de paiement
                </CardTitle>
                <CardDescription>
                  Vos informations de paiement sont sécurisées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nom sur la carte *</Label>
                    <Input
                      id="cardName"
                      value={paymentInfo.cardName}
                      onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Numéro de carte *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Date d'expiration *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/AA"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Retour
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? 'Traitement...' : `Payer €${totalWithShipping.toFixed(2)}`}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Étape 3: Confirmation */}
          {currentStep === 3 && (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
                <p className="text-gray-600 mb-4">
                  Votre commande <span className="font-semibold">{orderNumber}</span> a été traitée avec succès.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                    <Truck className="h-4 w-4 mr-2" />
                    Livraison estimée : 2-3 jours ouvrés
                  </div>
                  <p className="text-sm text-gray-500">
                    Un email de confirmation a été envoyé à {shippingInfo.email}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" onClick={onBack} className="flex-1">
                    Continuer les achats
                  </Button>
                  <Button onClick={onOrderComplete} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Voir mes commandes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Résumé de commande */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Résumé de commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Articles */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totaux */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
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

              {/* Badges de confiance */}
              <div className="pt-4 space-y-2">
                <Badge variant="outline" className="w-full justify-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Paiement sécurisé
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  <Truck className="h-3 w-3 mr-1" />
                  Livraison rapide
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

