import React, { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { 
  ShoppingCart, 
  User, 
  Search,
  Heart,
  Sparkles,
  Menu,
  X
} from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useMockAuth } from '../contexts/MockAuthContext'
import AuthModal from './auth/AuthModal'
import UserMenu from './auth/UserMenu'
import AdminLayout from './admin/AdminLayout'

const Header = ({ 
  currentPage, 
  onNavigate, 
  onOpenOrders, 
  onOpenSearch, 
  onOpenWishlist, 
  onOpenRecommendations 
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { items } = useCartStore()
  const { isAuthenticated, profile, mockSignOut } = useMockAuth()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleOpenAuth = () => {
    setShowAuthModal(true)
  }

  const handleCloseAuth = () => {
    setShowAuthModal(false)
  }

  const handleOpenAdmin = () => {
    setShowAdminPanel(true)
  }

  const handleCloseAdmin = () => {
    setShowAdminPanel(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onOpenSearch()
      setSearchQuery('')
      setShowMobileMenu(false)
    }
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case 'search':
        onOpenSearch()
        break
      case 'wishlist':
        onOpenWishlist()
        break
      case 'recommendations':
        onOpenRecommendations()
        break
      default:
        break
    }
    setShowMobileMenu(false)
  }

  const navigationItems = [
    { id: 'product', label: 'Notre Livre', color: 'bg-green-500' },
    { id: 'contact', label: 'Contact', color: 'bg-blue-500' }
  ]

  if (showAdminPanel) {
    return <AdminLayout onClose={handleCloseAdmin} />
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                Librairie Lumière
              </h1>
            </div>

            {/* Barre de recherche - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <Input
                  type="text"
                  placeholder="Rechercher des livres, auteurs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </form>
            </div>

            {/* Navigation principale - Desktop */}
            <nav className="hidden md:flex items-center space-x-4">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => onNavigate(item.id)}
                  className={currentPage === item.id ? item.color : ''}
                >
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Actions utilisateur - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Actions rapides */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction('search')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Search className="h-4 w-4" />
              </Button>
              
              {isAuthenticated() && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickAction('recommendations')}
                    className="text-gray-600 hover:text-purple-600"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickAction('wishlist')}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Panier */}
              <Button
                variant="ghost"
                onClick={() => onNavigate('cart')}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs">
                    {totalItems}
                  </Badge>
                )}
                <span className="ml-2 hidden lg:inline">
                  Panier ({totalItems} article{totalItems !== 1 ? 's' : ''})
                </span>
              </Button>

              {/* Authentification */}
              {isAuthenticated() ? (
                <UserMenu
                  profile={profile}
                  onOpenOrders={onOpenOrders}
                  onOpenAdmin={profile?.role === 'admin' ? handleOpenAdmin : null}
                  onSignOut={mockSignOut}
                />
              ) : (
                <Button onClick={handleOpenAuth} className="bg-purple-600 hover:bg-purple-700">
                  <User className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
              )}
            </div>

            {/* Menu mobile */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Panier mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('cart')}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs min-w-[1.25rem] h-5">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Bouton menu mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Menu mobile déroulant */}
          {showMobileMenu && (
            <div className="md:hidden border-t bg-white py-4">
              {/* Recherche mobile */}
              <form onSubmit={handleSearch} className="mb-4 relative">
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </form>

              {/* Navigation mobile */}
              <div className="space-y-2 mb-4">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    onClick={() => {
                      onNavigate(item.id)
                      setShowMobileMenu(false)
                    }}
                    className={`w-full justify-start ${currentPage === item.id ? item.color : ''}`}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>

              {/* Actions rapides mobile */}
              {isAuthenticated() && (
                <div className="space-y-2 mb-4 border-t pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleQuickAction('recommendations')}
                    className="w-full justify-start"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Recommandations
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleQuickAction('wishlist')}
                    className="w-full justify-start"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Liste de souhaits
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onOpenOrders()
                      setShowMobileMenu(false)
                    }}
                    className="w-full justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mes commandes
                  </Button>
                </div>
              )}

              {/* Authentification mobile */}
              <div className="border-t pt-4">
                {isAuthenticated() ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Connecté en tant que {profile?.first_name || 'Utilisateur'}
                    </div>
                    {profile?.role === 'admin' && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleOpenAdmin()
                          setShowMobileMenu(false)
                        }}
                        className="w-full justify-start"
                      >
                        Administration
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        mockSignOut()
                        setShowMobileMenu(false)
                      }}
                      className="w-full justify-start text-red-600"
                    >
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      handleOpenAuth()
                      setShowMobileMenu(false)
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modal d'authentification */}
      {showAuthModal && (
        <AuthModal onClose={handleCloseAuth} />
      )}
    </>
  )
}

export default Header

