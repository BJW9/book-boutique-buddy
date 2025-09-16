import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Clock,
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  RefreshCw,
  Eye,
  ThumbsUp,
  BookOpen,
  AlertTriangle
} from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useMockAuth } from '../../contexts/MockAuthContext'

const RecommendationsPage = ({ onBack }) => {
  const [recommendations, setRecommendations] = useState({
    personalized: [],
    trending: [],
    similar: [],
    newReleases: []
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personalized')
  const [wishlist, setWishlist] = useState(new Set())

  const { addItem } = useCartStore()
  const { isAuthenticated, profile } = useMockAuth()

  // Données de démonstration pour les recommandations
  const demoRecommendations = {
    personalized: [
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
        reason: 'Basé sur vos lectures de fiction contemporaine',
        confidence: 95,
        tags: ['Bestseller', 'Nouveau']
      },
      {
        id: 2,
        title: 'L\'Art de la Méditation',
        author: 'Zen Master',
        price: 18.90,
        rating: 4.7,
        reviewCount: 89,
        category: 'Bien-être',
        description: 'Guide pratique pour débuter la méditation au quotidien.',
        reason: 'Recommandé pour votre intérêt pour le développement personnel',
        confidence: 87,
        tags: ['Bien-être']
      },
      {
        id: 3,
        title: 'Cuisine Végétarienne Moderne',
        author: 'Chef Verde',
        price: 32.00,
        rating: 4.4,
        reviewCount: 156,
        category: 'Cuisine',
        description: 'Recettes innovantes pour une cuisine végétarienne savoureuse.',
        reason: 'Basé sur vos achats récents en cuisine',
        confidence: 78,
        tags: ['Cuisine', 'Végétarien']
      }
    ],
    trending: [
      {
        id: 4,
        title: 'Le Phénomène TikTok',
        author: 'Digital Expert',
        price: 22.50,
        rating: 4.2,
        reviewCount: 234,
        category: 'Technologie',
        description: 'Analyse du succès des réseaux sociaux modernes.',
        trendScore: 98,
        tags: ['Tendance', 'Réseaux sociaux']
      },
      {
        id: 5,
        title: 'Investir en 2024',
        author: 'Finance Pro',
        price: 28.90,
        rating: 4.6,
        reviewCount: 178,
        category: 'Finance',
        description: 'Stratégies d\'investissement pour l\'année en cours.',
        trendScore: 94,
        tags: ['Finance', 'Investissement']
      }
    ],
    similar: [
      {
        id: 6,
        title: 'Chroniques Temporelles',
        author: 'Time Writer',
        price: 26.50,
        rating: 4.3,
        reviewCount: 92,
        category: 'Fiction',
        description: 'Une saga épique à travers les époques.',
        similarTo: 'Les Murmures du Temps',
        tags: ['Fiction', 'Saga']
      },
      {
        id: 7,
        title: 'Secrets du Temps',
        author: 'Mystery Author',
        price: 21.90,
        rating: 4.1,
        reviewCount: 67,
        category: 'Mystère',
        description: 'Un thriller captivant mêlant science et mystère.',
        similarTo: 'Les Murmures du Temps',
        tags: ['Mystère', 'Thriller']
      }
    ],
    newReleases: [
      {
        id: 8,
        title: 'IA et Créativité',
        author: 'Tech Visionary',
        price: 35.00,
        rating: 4.8,
        reviewCount: 45,
        category: 'Technologie',
        description: 'L\'impact de l\'intelligence artificielle sur la créativité humaine.',
        releaseDate: '2024-09-15',
        tags: ['IA', 'Créativité', 'Nouveau']
      },
      {
        id: 9,
        title: 'Recettes d\'Automne',
        author: 'Seasonal Chef',
        price: 24.50,
        rating: 4.5,
        reviewCount: 23,
        category: 'Cuisine',
        description: 'Saveurs et couleurs de la saison automnale.',
        releaseDate: '2024-09-10',
        tags: ['Cuisine', 'Saisonnier', 'Nouveau']
      }
    ]
  }

  const tabs = [
    { id: 'personalized', label: 'Pour vous', icon: Sparkles, description: 'Recommandations personnalisées' },
    { id: 'trending', label: 'Tendances', icon: TrendingUp, description: 'Les plus populaires' },
    { id: 'similar', label: 'Similaires', icon: Users, description: 'Basé sur vos goûts' },
    { id: 'newReleases', label: 'Nouveautés', icon: Clock, description: 'Dernières sorties' }
  ]

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = () => {
    setLoading(true)
    // Simulation de chargement des recommandations
    setTimeout(() => {
      setRecommendations(demoRecommendations)
      setLoading(false)
    }, 1500)
  }

  const refreshRecommendations = () => {
    loadRecommendations()
  }

  const addToCart = (product) => {
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

  const renderProductCard = (product, showReason = false) => {
    const isInWishlist = wishlist.has(product.id)
    
    return (
      <Card key={product.id} className="group hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="relative mb-4">
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'text-red-600 fill-current' : 'text-gray-600'}`} />
            </Button>
            
            {/* Badges spéciaux */}
            {product.confidence && product.confidence > 90 && (
              <Badge className="absolute top-2 left-2 bg-purple-500">
                <Sparkles className="h-3 w-3 mr-1" />
                Recommandé
              </Badge>
            )}
            {product.trendScore && product.trendScore > 95 && (
              <Badge className="absolute top-2 left-2 bg-orange-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                Tendance
              </Badge>
            )}
            {product.releaseDate && (
              <Badge className="absolute top-2 left-2 bg-green-500">
                <Clock className="h-3 w-3 mr-1" />
                Nouveau
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
            <p className="text-sm text-gray-600">Par {product.author}</p>
            
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
              <span className="text-xs text-gray-500">({product.reviewCount})</span>
            </div>
            
            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
            
            {/* Raison de la recommandation */}
            {showReason && (product.reason || product.similarTo) && (
              <div className="bg-purple-50 rounded-lg p-2">
                <p className="text-xs text-purple-700">
                  {product.reason || `Similaire à "${product.similarTo}"`}
                </p>
                {product.confidence && (
                  <div className="flex items-center mt-1">
                    <div className="flex-1 bg-purple-200 rounded-full h-1">
                      <div 
                        className="bg-purple-600 h-1 rounded-full" 
                        style={{ width: `${product.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-purple-600 ml-2">{product.confidence}%</span>
                  </div>
                )}
              </div>
            )}
            
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
            
            <div className="flex items-center space-x-2">
              {product.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <Button
              onClick={() => addToCart(product)}
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

  if (!isAuthenticated()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous devez être connecté pour voir vos recommandations personnalisées.
          </AlertDescription>
        </Alert>
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
            <h1 className="text-2xl font-bold text-gray-900">Recommandations</h1>
            <p className="text-gray-600">
              Découvrez des livres sélectionnés spécialement pour vous, {profile?.first_name || 'Client'}
            </p>
          </div>
        </div>
        
        <Button variant="outline" onClick={refreshRecommendations} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistiques personnalisées */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">127</div>
            <div className="text-sm text-gray-600">Livres vus</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">23</div>
            <div className="text-sm text-gray-600">Achats effectués</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">15</div>
            <div className="text-sm text-gray-600">Favoris</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ThumbsUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-gray-900">4.6</div>
            <div className="text-sm text-gray-600">Note moyenne</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Contenu des onglets */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Génération de vos recommandations personnalisées...</p>
        </div>
      ) : (
        <div>
          {/* Description de l'onglet actuel */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>

          {/* Grille de produits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations[activeTab]?.map(product => 
              renderProductCard(product, activeTab === 'personalized' || activeTab === 'similar')
            )}
          </div>

          {/* Message si aucune recommandation */}
          {recommendations[activeTab]?.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune recommandation disponible
              </h3>
              <p className="text-gray-600 mb-4">
                Continuez à explorer notre catalogue pour recevoir des recommandations personnalisées.
              </p>
              <Button onClick={onBack} className="bg-purple-600 hover:bg-purple-700">
                Explorer le catalogue
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Section d'aide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
            Comment fonctionnent nos recommandations ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recommandations personnalisées</h4>
              <p className="text-sm text-gray-600">
                Basées sur vos achats précédents, vos notes et vos préférences de lecture.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tendances</h4>
              <p className="text-sm text-gray-600">
                Les livres les plus populaires et les mieux notés par notre communauté.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Livres similaires</h4>
              <p className="text-sm text-gray-600">
                Suggestions basées sur les livres que vous avez aimés et les goûts d'autres lecteurs.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Nouveautés</h4>
              <p className="text-sm text-gray-600">
                Les dernières sorties et les livres récemment ajoutés à notre catalogue.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RecommendationsPage

