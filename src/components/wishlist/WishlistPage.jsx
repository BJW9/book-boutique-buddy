import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  Heart, 
  ShoppingCart, 
  Star,
  Trash2,
  ArrowLeft,
  Share2,
  Filter,
  Grid,
  List,
  AlertTriangle
} from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useMockAuth } from '../../contexts/MockAuthContext'

const WishlistPage = ({ onBack }) => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('date-added')
  const [filterCategory, setFilterCategory] = useState('')
  const [loading, setLoading] = useState(true)

  const { addItem } = useCartStore()
  const { isAuthenticated, profile } = useMockAuth()

  // Données de démonstration pour la wishlist
  const demoWishlistItems = [
    {
      id: 1,
      title: 'Les Murmures du Temps',
      author: 'Marie Dubois',
      price: 24.90,
      originalPrice: 29.90,
      rating: 4.5,
      reviewCount: 127,
      category: 'Fiction',
      description: 'Une odyssée littéraire captivante qui explore les mystères du temps.',
      inStock: true,
      stockCount: 47,
      image: '/api/placeholder/200/280',
      dateAdded: '2024-09-15',
      tags: ['Bestseller', 'Nouveau']
    },
    {
      id: 2,
      title: 'Le Jardin des Secrets',
      author: 'Pierre Martin',
      price: 19.90,
      rating: 4.2,
      reviewCount: 89,
      category: 'Romance',
      description: 'Un roman touchant sur l\'amour et les secrets de famille.',
      inStock: true,
      stockCount: 23,
      image: '/api/placeholder/200/280',
      dateAdded: '2024-09-10',
      tags: ['Romance']
    },
    {
      id: 3,
      title: 'Cuisine du Monde',
      author: 'Sophie Chen',
      price: 28.50,
      rating: 4.6,
      reviewCount: 156,
      category: 'Cuisine',
      description: 'Découvrez les saveurs du monde entier avec ces recettes authentiques.',
      inStock: false,
      stockCount: 0,
      image: '/api/placeholder/200/280',
      dateAdded: '2024-09-08',
      tags: ['Cuisine', 'Voyage']
    },
    {
      id: 4,
      title: 'Guide du Développeur',
      author: 'Alex Johnson',
      price: 42.00,
      rating: 4.7,
      reviewCount: 94,
      category: 'Informatique',
      description: 'Le guide complet pour devenir un développeur web moderne.',
      inStock: true,
      stockCount: 31,
      image: '/api/placeholder/200/280',
      dateAdded: '2024-09-05',
      tags: ['Technique', 'Programmation']
    }
  ]

  const categories = ['Fiction', 'Romance', 'Cuisine', 'Informatique']
  const sortOptions = [
    { value: 'date-added', label: 'Date d\'ajout' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'title', label: 'Titre A-Z' }
  ]

  useEffect(() => {
    loadWishlist()
  }, [])

  useEffect(() => {
    sortWishlist()
  }, [sortBy, filterCategory])

  const loadWishlist = () => {
    setLoading(true)
    // Simulation de chargement
    setTimeout(() => {
      setWishlistItems(demoWishlistItems)
      setLoading(false)
    }, 1000)
  }

  const sortWishlist = () => {
    let sortedItems = [...wishlistItems]

    // Filtrage par catégorie
    if (filterCategory) {
      sortedItems = sortedItems.filter(item => item.category === filterCategory)
    }

    // Tri
    switch (sortBy) {
      case 'price-asc':
        sortedItems.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sortedItems.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        sortedItems.sort((a, b) => b.rating - a.rating)
        break
      case 'title':
        sortedItems.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'date-added':
      default:
        sortedItems.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        break
    }

    setWishlistItems(sortedItems)
  }

  const removeFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
  }

  const addToCart = (item) => {
    addItem({
      id: item.id,
      title: item.title,
      author: item.author,
      price: item.price,
      description: item.description,
      quantity: 1
    })
  }

  const addAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock)
    inStockItems.forEach(item => addToCart(item))
  }

  const shareWishlist = () => {
    // Simulation du partage
    navigator.clipboard.writeText(window.location.href)
    alert('Lien de la wishlist copié dans le presse-papiers!')
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const renderItemCard = (item) => {
    if (viewMode === 'list') {
      return (
        <Card key={item.id} className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-28 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-500">Image</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Par {item.author}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(item.rating)}
                        <span className="text-sm text-gray-600">({item.reviewCount})</span>
                      </div>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Ajouté le {new Date(item.dateAdded).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="mb-3">
                      <span className="text-xl font-bold text-gray-900">€{item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          €{item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {item.inStock ? (
                      <p className="text-sm text-green-600 mb-3">{item.stockCount} en stock</p>
                    ) : (
                      <p className="text-sm text-red-600 mb-3">Rupture de stock</p>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => addToCart(item)}
                        disabled={!item.inStock}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card key={item.id} className="group hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="relative mb-4">
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-500">Image</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeFromWishlist(item.id)}
            >
              <Heart className="h-4 w-4 text-red-600 fill-current" />
            </Button>
            {item.tags.includes('Bestseller') && (
              <Badge className="absolute top-2 left-2 bg-orange-500">Bestseller</Badge>
            )}
            {!item.inStock && (
              <Badge className="absolute bottom-2 left-2 bg-red-500">Rupture de stock</Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
            <p className="text-sm text-gray-600">Par {item.author}</p>
            
            <div className="flex items-center space-x-1">
              {renderStars(item.rating)}
              <span className="text-xs text-gray-500">({item.reviewCount})</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">€{item.price.toFixed(2)}</span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-500 line-through ml-1">
                    €{item.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-xs">{item.category}</Badge>
            </div>
            
            <p className="text-xs text-gray-500">
              Ajouté le {new Date(item.dateAdded).toLocaleDateString('fr-FR')}
            </p>
            
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFromWishlist(item.id)}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Retirer
              </Button>
              <Button
                onClick={() => addToCart(item)}
                disabled={!item.inStock}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Panier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthenticated()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous devez être connecté pour voir votre liste de souhaits.
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de votre liste de souhaits...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ma liste de souhaits</h1>
            <p className="text-gray-600">
              {profile?.first_name || 'Client'}, vous avez {wishlistItems.length} article{wishlistItems.length !== 1 ? 's' : ''} dans votre liste
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={shareWishlist}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          {wishlistItems.some(item => item.inStock) && (
            <Button onClick={addAllToCart} className="bg-purple-600 hover:bg-purple-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Tout ajouter au panier
            </Button>
          )}
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Votre liste de souhaits est vide</h3>
            <p className="text-gray-600 mb-4">
              Parcourez notre catalogue et ajoutez vos livres favoris à votre liste de souhaits.
            </p>
            <Button onClick={onBack} className="bg-purple-600 hover:bg-purple-700">
              Découvrir nos livres
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Contrôles */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-sm border rounded px-3 py-2"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border rounded px-3 py-2"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Trier par {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex border rounded">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{wishlistItems.length}</div>
                <div className="text-sm text-gray-600">Articles total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {wishlistItems.filter(item => item.inStock).length}
                </div>
                <div className="text-sm text-gray-600">En stock</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  €{wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Valeur totale</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {wishlistItems.filter(item => item.originalPrice && item.originalPrice > item.price).length}
                </div>
                <div className="text-sm text-gray-600">En promotion</div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des articles */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {wishlistItems.map(renderItemCard)}
          </div>
        </>
      )}
    </div>
  )
}

export default WishlistPage

