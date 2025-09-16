import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  Search, 
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download
} from 'lucide-react'
import { orders } from '../../lib/supabase'

const OrderManagement = () => {
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [error, setError] = useState('')

  // Données de démonstration
  const demoOrders = [
    {
      id: 1,
      order_number: 'CMD-2024-001',
      user_id: 'user1',
      status: 'pending',
      total_amount: 24.90,
      shipping_address: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postal_code: '75001',
        country: 'France'
      },
      created_at: '2024-09-16T10:30:00Z',
      updated_at: '2024-09-16T10:30:00Z',
      customer: {
        first_name: 'Marie',
        last_name: 'Dupont',
        email: 'marie.dupont@email.com'
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
      user_id: 'user2',
      status: 'processing',
      total_amount: 44.80,
      shipping_address: {
        street: '456 Avenue des Champs',
        city: 'Lyon',
        postal_code: '69001',
        country: 'France'
      },
      created_at: '2024-09-16T09:15:00Z',
      updated_at: '2024-09-16T11:00:00Z',
      customer: {
        first_name: 'Pierre',
        last_name: 'Martin',
        email: 'pierre.martin@email.com'
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
      user_id: 'user3',
      status: 'shipped',
      total_amount: 35.00,
      shipping_address: {
        street: '789 Boulevard Saint-Germain',
        city: 'Marseille',
        postal_code: '13001',
        country: 'France'
      },
      created_at: '2024-09-15T14:20:00Z',
      updated_at: '2024-09-16T08:30:00Z',
      customer: {
        first_name: 'Sophie',
        last_name: 'Leroy',
        email: 'sophie.leroy@email.com'
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
    },
    {
      id: 4,
      order_number: 'CMD-2024-004',
      user_id: 'user4',
      status: 'delivered',
      total_amount: 24.90,
      shipping_address: {
        street: '321 Rue de Rivoli',
        city: 'Paris',
        postal_code: '75004',
        country: 'France'
      },
      created_at: '2024-09-14T16:45:00Z',
      updated_at: '2024-09-15T10:15:00Z',
      customer: {
        first_name: 'Jean',
        last_name: 'Dubois',
        email: 'jean.dubois@email.com'
      },
      order_items: [
        {
          id: 5,
          quantity: 1,
          unit_price: 24.90,
          product: {
            title: 'Les Murmures du Temps',
            author: 'Marie Dubois'
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
        setOrderList(demoOrders)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError('Erreur lors du chargement des commandes')
      setOrderList(demoOrders)
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setOrderList(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ))
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut')
    }
  }

  const filteredOrders = orderList.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getOrderStats = () => {
    const stats = {
      total: orderList.length,
      pending: orderList.filter(o => o.status === 'pending').length,
      processing: orderList.filter(o => o.status === 'processing').length,
      shipped: orderList.filter(o => o.status === 'shipped').length,
      delivered: orderList.filter(o => o.status === 'delivered').length
    }
    return stats
  }

  const stats = getOrderStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des commandes</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des commandes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des commandes</h1>
          <p className="text-gray-600">{stats.total} commande{stats.total !== 1 ? 's' : ''} au total</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">En attente</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
              <div className="text-sm text-gray-600">En cours</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
              <div className="text-sm text-gray-600">Expédiées</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
              <div className="text-sm text-gray-600">Livrées</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par numéro, client ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="processing">En cours</option>
              <option value="shipped">Expédiées</option>
              <option value="delivered">Livrées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des commandes */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status)
          const StatusIcon = statusConfig.icon
          
          return (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.order_number}
                      </h3>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">Client</p>
                        <p className="text-gray-600">
                          {order.customer.first_name} {order.customer.last_name}
                        </p>
                        <p className="text-gray-500">{order.customer.email}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">Adresse de livraison</p>
                        <p className="text-gray-600">
                          {order.shipping_address.street}
                        </p>
                        <p className="text-gray-600">
                          {order.shipping_address.postal_code} {order.shipping_address.city}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">Articles</p>
                        {order.order_items.map((item, index) => (
                          <p key={index} className="text-gray-600">
                            {item.quantity}x {item.product.title}
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Créée le {new Date(order.created_at).toLocaleDateString('fr-FR')} à {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>
                        Mise à jour le {new Date(order.updated_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-6 text-right">
                    <div className="text-xl font-bold text-gray-900 mb-4">
                      €{order.total_amount.toFixed(2)}
                    </div>
                    
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      
                      {order.status === 'pending' && (
                        <div className="space-y-1">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'processing')}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            Traiter
                          </Button>
                        </div>
                      )}
                      
                      {order.status === 'processing' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'shipped')}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          Expédier
                        </Button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Marquer livrée
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucune commande ne correspond à vos critères de recherche.' 
                : 'Aucune commande n\'a encore été passée.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default OrderManagement

