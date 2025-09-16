import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingCart,
  Grid,
  List,
  ArrowUpDown,
  X
} from 'lucide-react'
import { useCartStore } from '../../store/cartStore'

const SearchPage = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' ou 'list'
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 100],
    rating: 0,
    inStock: false,
    author: ''
  })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [wishlist, setWishlist] = useState(new Set())

  const { addItem } = useCartStore()

  // Données de démonstration pour les produits
  const demoProducts = [
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
      tags: ['Romance']
    },
    {
      id: 3,
      title: 'Histoire de France',
      author: 'Jean Leclerc',
      price: 35.00,
      rating: 4.8,
      reviewCount: 203,
      category: 'Histoire',
      description: 'Une histoire complète et accessible de la France.',
      inStock: true,
      stockCount: 15,
      image: '/api/placeholder/200/280',
      tags: ['Éducation', 'Référence']
    },
    {
      id: 4,
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
      tags: ['Cuisine', 'Voyage']
    },
    {
      id: 5,
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
      tags: ['Technique', 'Programmation']
    },
    {
      id: 6,
      title: 'Méditation et Bien-être',
      author: 'Luna Wellness',
      price: 16.90,
      rating: 4.3,
      reviewCount: 78,
      category: 'Bien-être',
      description: 'Techniques de méditation pour une vie plus sereine.',
      inStock: true,
      stockCount: 42,
      image: '/api/placeholder/200/280',
      tags: ['Bien-être', 'Spiritualité']
    }
  ]

  const categories = ['Fiction', 'Romance', 'Histoire', 'Cuisine', 'Informatique', 'Bien-être']
  const sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'newest', label: 'Plus récents' }
  ]

  useEffect(() => {
    performSearch()
  }, [searchQuery, filters, sortBy])

  const performSearch = () => {
    setLoading(true)
    
    // Simulation de recherche
    setTimeout(() => {
      let filteredResults = demoProducts.filter(product => {
        const matchesQuery = !searchQuery || 
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesCategory = !filters.category || product.category === filters.category
        const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
        const matchesRating = product.rating >= filters.rating
        const matchesStock = !filters.inStock || product.inStock
        const matchesAuthor = !filters.author || 
          product.author.toLowerCase().includes(filters.author.toLowerCase())

        return matchesQuery && matchesCategory && matchesPrice && matchesRating && matchesStock && matchesAuthor
      })

      // Tri des résultats
      switch (sortBy) {
        case 'price-asc':
          filteredResults.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filteredResults.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filteredResults.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          filteredResults.sort((a, b) => b.id - a.id)
          break
        default:
          // Pertinence (ordre par défaut)
          break
      }

      setResults(filteredResults)
      setLoading(false)
    }, 500)
  }

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      title: product.title,
      author: product.author,
      price: product.price,
      description: product.description,
      quantity: 1
    })
  }

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
    } else {
      newWishlist.add(productId)
    }
    setWishlist(newWishlist)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 100],
      rating: 0,
      inStock: false,
      author: ''
    })
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

  const renderProductCard = (product) => {
    const isInWishlist = wishlist.has(product.id)
    
    if (viewMode === 'list') {
      return (
        <Card key={product.id} className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-24 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-500">Image</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Par {product.author}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                        <span className="text-sm text-gray-600">({product.reviewCount})</span>
                      </div>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {product.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-gray-900">€{product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          €{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {product.inStock ? (
                      <p className="text-sm text-green-600 mb-3">{product.stockCount} en stock</p>
                    ) : (
                      <p className="text-sm text-red-600 mb-3">Rupture de stock</p>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWishlist(product.id)}
                        className={isInWishlist ? 'text-red-600' : ''}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
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
      <Card key={product.id} className="group hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="relative mb-4">
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-500">Image</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'text-red-600 fill-current' : 'text-gray-600'}`} />
            </Button>
            {product.tags.includes('Bestseller') && (
              <Badge className="absolute top-2 left-2 bg-orange-500">Bestseller</Badge>
            )}
            {product.tags.includes('Nouveau') && (
              <Badge className="absolute top-2 left-2 bg-green-500">Nouveau</Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
            <p className="text-sm text-gray-600">Par {product.author}</p>
            
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
              <span className="text-xs text-gray-500">({product.reviewCount})</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">€{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through ml-1">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-xs">{product.category}</Badge>
            </div>
            
            {product.inStock ? (
              <p className="text-xs text-green-600">{product.stockCount} en stock</p>
            ) : (
              <p className="text-xs text-red-600">Rupture de stock</p>
            )}
            
            <Button
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header de recherche */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher des livres, auteurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </Button>
        </div>

        {/* Barre de résultats et contrôles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              {loading ? 'Recherche...' : `${results.length} résultat${results.length !== 1 ? 's' : ''}`}
              {searchQuery && ` pour "${searchQuery}"`}
            </p>
            
            {(filters.category || filters.rating > 0 || filters.inStock || filters.author) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Effacer les filtres
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
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
        </div>
      </div>

      <div className="flex gap-6">
        {/* Panneau de filtres */}
        {showFilters && (
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Catégorie */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Catégorie</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full text-sm border rounded px-3 py-2"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Prix */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Prix: €{filters.priceRange[0]} - €{filters.priceRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Note minimale */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Note minimale</label>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filters.rating === rating}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            rating: parseInt(e.target.value) 
                          }))}
                        />
                        <div className="flex items-center space-x-1">
                          {renderStars(rating)}
                          <span className="text-sm">et plus</span>
                        </div>
                      </label>
                    ))}
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="rating"
                        value={0}
                        checked={filters.rating === 0}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          rating: parseInt(e.target.value) 
                        }))}
                      />
                      <span className="text-sm">Toutes les notes</span>
                    </label>
                  </div>
                </div>

                {/* Disponibilité */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        inStock: e.target.checked 
                      }))}
                    />
                    <span className="text-sm">En stock uniquement</span>
                  </label>
                </div>

                {/* Auteur */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">Auteur</label>
                  <Input
                    placeholder="Nom de l'auteur"
                    value={filters.author}
                    onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Résultats */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Recherche en cours...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600 mb-4">
                Essayez de modifier vos critères de recherche ou vos filtres.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Effacer tous les filtres
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }>
              {results.map(renderProductCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage

