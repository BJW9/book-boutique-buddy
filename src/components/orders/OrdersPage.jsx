import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  Package, 
  ArrowLeft,
  Eye,
  Download,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { useMockAuth } from '../../contexts/MockAuthContext'

const OrdersPage = ({ onBack }) => {
  const { user, profile, isAuthenticated } = useMockAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Données de démonstration pour les commandes utilisateur
  const demoOrders = [
    {
      id: 1,
      order_number: 'CMD-2024-001',
      status: 'delivered',
      total_amount: 24.90,
      created_at: '2024-09-10T10:30:00Z',
      updated_at: '2024-09-12T14:20:00Z',
      shipping_address: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postal_code: '75001',
        country: 'France'
      },
      order_items: [
        {
          id: 1,
          quantity: 1,
          unit_price: 24.90,
          product: {
            title: 'Les Murmures du Temps',
            author: 'Marie Dubois'
          }
        }
      ]
    },
    {
      id: 2,
      order_number: 'CMD-2024-002',
      status: 'shipped',
      total_amount: 44.80,
      created_at: '2024-09-14T16:45:00Z',
      updated_at: '2024-09-15T09:30:00Z',
      shipping_address: {
        street: '456 Avenue des Champs',
        city: 'Lyon',
        postal_code: '69001',
        country: 'France'
      },
      order_items: [
        {
          id: 2,
          quantity: 1,
          unit_price: 24.90,
          product: {
            title: 'Les Murmures du Temps',
            author: 'Marie Dubois'
          }
        },
        {
          id: 3,
          quantity: 1,
          unit_price: 19.90,
          product: {
            title: 'Le Jardin des Secrets',
            author: 'Pierre Martin'
          }
        }
      ]
    },
    {
      id: 3,
      order_number: 'CMD-2024-003',
      status: 'processing',
      total_amount: 35.00,
      created_at: '2024-09-16T08:15:00Z',
      updated_at: '2024-09-16T08:15:00Z',
      shipping_address: {
        street: '789 Boulevard Saint-Germain',
        city: 'Marseille',
        postal_code: '13001',
        country: 'France'
      },
      order_items: [
        {
          id: 4,
          quantity: 1,
          unit_price: 35.00,
          product: {
            title: 'Histoire de France',
            author: 'Jean Leclerc'
          }
        }
      ]
    }
  ]

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      // Simulation de chargement des commandes
      setTimeout(() => {
        setOrders(demoOrders)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError('Erreur lors du chargement des commandes')
      setOrders(demoOrders)
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      },
      processing: {
        label: 'En cours',
        color: 'bg-blue-100 text-blue-800',
        icon: Package
      },
      shipped: {
        label: 'Expédiée',
        color: 'bg-purple-100 text-purple-800',
        icon: Truck
      },
      delivered: {
        label: 'Livrée',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      cancelled: {
        label: 'Annulée',
        color: 'bg-red-100 text-red-800',
        icon: XCircle
      }
    }
    return configs[status] || configs.pending
  }

  const getStatusMessage = (status) => {
    const messages = {
      pending: 'Votre commande est en attente de traitement.',
      processing: 'Votre commande est en cours de préparation.',
      shipped: 'Votre commande a été expédiée et est en route.',
      delivered: 'Votre commande a été livrée avec succès.',
      cancelled: 'Cette commande a été annulée.'
    }
    return messages[status] || ''
  }

  if (!isAuthenticated()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous devez être connecté pour voir vos commandes.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chargement de vos commandes...</p>
          </div>
        </div>
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes commandes</h1>
            <p className="text-gray-600">
              Bonjour {profile?.first_name || 'Client'}, voici l'historique de vos commandes
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Liste des commandes */}
      <div className="space-y-6">
        {orders.map((order) => {
          const statusConfig = getStatusConfig(order.status)
          const StatusIcon = statusConfig.icon
          
          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-3">
                      <span>Commande {order.order_number}</span>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} • Total: €{order.total_amount.toFixed(2)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Facture
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Articles commandés */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Articles commandés</h4>
                    <div className="space-y-3">
                      {order.order_items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.product.title}</p>
                            <p className="text-xs text-gray-500">Par {item.product.author}</p>
                            <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            €{(item.unit_price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Informations de livraison */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Livraison</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.shipping_address.street}</p>
                      <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                      <p>{order.shipping_address.country}</p>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <StatusIcon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {getStatusMessage(order.status)}
                      </p>
                      {order.status === 'shipped' && (
                        <p className="text-xs text-gray-500 mt-1">
                          Livraison estimée: 1-2 jours ouvrés
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions selon le statut */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {order.status === 'pending' && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Vous pouvez annuler cette commande tant qu'elle n'est pas en cours de traitement.
                      </p>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Annuler la commande
                      </Button>
                    </div>
                  )}
                  
                  {order.status === 'delivered' && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Votre commande a été livrée. Vous avez 30 jours pour retourner vos articles.
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Retourner un article
                        </Button>
                        <Button variant="outline" size="sm">
                          Laisser un avis
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore passé de commande.
            </p>
            <Button onClick={onBack} className="bg-purple-600 hover:bg-purple-700">
              Commencer mes achats
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default OrdersPage

