import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Shield
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import ProductManagement from './ProductManagement'
import OrderManagement from './OrderManagement'

const AdminLayout = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { profile } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'customers', label: 'Clients', icon: Users },
    { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au site
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-semibold text-gray-900">Administration</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Connecté en tant que <span className="font-medium">{profile?.first_name} {profile?.last_name}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation par onglets */}
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-none lg:flex lg:space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="flex items-center space-x-2 px-4 py-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Contenu des onglets */}
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomersContent />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsContent />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Composant Tableau de bord
const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre librairie</p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes du jour</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€247.50</div>
            <p className="text-xs text-muted-foreground">+12% par rapport à hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 en attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+5 nouveaux cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock faible</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Produits à réapprovisionner</p>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>Les 5 dernières commandes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Commande #{1000 + i}</p>
                    <p className="text-xs text-gray-500">Client {i}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">€{(Math.random() * 50 + 10).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">En cours</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
            <CardDescription>Les mieux vendus cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Les Murmures du Temps</p>
                  <p className="text-xs text-gray-500">Roman</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">8 vendus</p>
                  <p className="text-xs text-gray-500">€24.90</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Composants placeholder pour les autres sections
const ProductsContent = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestion des produits</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Interface de gestion des produits à implémenter...</p>
      </CardContent>
    </Card>
  </div>
)

const OrdersContent = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestion des commandes</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Interface de gestion des commandes à implémenter...</p>
      </CardContent>
    </Card>
  </div>
)

const CustomersContent = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestion des clients</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Interface de gestion des clients à implémenter...</p>
      </CardContent>
    </Card>
  </div>
)

const AnalyticsContent = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Statistiques et analyses</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Tableaux de bord analytiques à implémenter...</p>
      </CardContent>
    </Card>
  </div>
)

const SettingsContent = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Paramètres</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Configuration de la librairie à implémenter...</p>
      </CardContent>
    </Card>
  </div>
)

export default AdminLayout

