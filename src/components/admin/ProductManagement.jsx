import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  EyeOff,
  Package,
  AlertTriangle
} from 'lucide-react'
import { products } from '../../lib/supabase'

const ProductManagement = () => {
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState('')

  // Données de démonstration (à remplacer par les vraies données Supabase)
  const demoProducts = [
    {
      id: 1,
      title: 'Les Murmures du Temps',
      author: 'Marie Dubois',
      price: 24.90,
      description: 'Une odyssée littéraire captivante qui nous emmène à travers les époques...',
      category: { name: 'Roman', slug: 'roman' },
      images: ['/assets/book-main.jpg'],
      is_active: true,
      inventory: { quantity: 47, reserved_quantity: 3 },
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Le Jardin des Secrets',
      author: 'Pierre Martin',
      price: 19.90,
      description: 'Un thriller psychologique haletant...',
      category: { name: 'Thriller', slug: 'thriller' },
      images: ['/assets/book-2.jpg'],
      is_active: true,
      inventory: { quantity: 23, reserved_quantity: 1 },
      created_at: '2024-02-01T14:30:00Z'
    },
    {
      id: 3,
      title: 'Histoire de France',
      author: 'Jean Leclerc',
      price: 35.00,
      description: 'Une histoire complète de la France...',
      category: { name: 'Histoire', slug: 'histoire' },
      images: ['/assets/book-3.jpg'],
      is_active: false,
      inventory: { quantity: 0, reserved_quantity: 0 },
      created_at: '2024-01-20T09:15:00Z'
    }
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      // Simulation de chargement des produits
      // const { data, error } = await products.getAll()
      // if (error) throw error
      // setProductList(data || [])
      
      // Utilisation des données de démonstration
      setTimeout(() => {
        setProductList(demoProducts)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError('Erreur lors du chargement des produits')
      setProductList(demoProducts) // Fallback sur les données de démo
      setLoading(false)
    }
  }

  const filteredProducts = productList.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleToggleActive = async (productId, currentStatus) => {
    try {
      // Simulation de mise à jour
      setProductList(prev => prev.map(p => 
        p.id === productId ? { ...p, is_active: !currentStatus } : p
      ))
    } catch (err) {
      setError('Erreur lors de la mise à jour du produit')
    }
  }

  const getStockStatus = (inventory) => {
    const available = inventory.quantity - inventory.reserved_quantity
    if (available <= 0) return { status: 'out', label: 'Rupture', color: 'bg-red-100 text-red-800' }
    if (available <= 5) return { status: 'low', label: 'Stock faible', color: 'bg-yellow-100 text-yellow-800' }
    return { status: 'good', label: 'En stock', color: 'bg-green-100 text-green-800' }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des produits...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
          <p className="text-gray-600">{productList.length} produit{productList.length !== 1 ? 's' : ''} au total</p>
        </div>
        <Button onClick={handleCreateProduct} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par titre ou auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      <div className="grid gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.inventory)
          return (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4">
                    <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Par {product.author}</p>
                      <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">€{product.price}</p>
                      <p className="text-sm text-gray-500">
                        Stock: {product.inventory.quantity - product.inventory.reserved_quantity} / {product.inventory.quantity}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(product.id, product.is_active)}
                      >
                        {product.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Aucun produit ne correspond à votre recherche.' : 'Commencez par ajouter votre premier produit.'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateProduct} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog pour créer/éditer un produit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct ? 'Modifiez les informations du produit.' : 'Ajoutez un nouveau produit à votre catalogue.'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            product={selectedProduct} 
            onClose={() => setIsDialogOpen(false)}
            onSave={loadProducts}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Composant formulaire de produit
const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    author: product?.author || '',
    price: product?.price || '',
    description: product?.description || '',
    category: product?.category?.name || '',
    quantity: product?.inventory?.quantity || '',
    is_active: product?.is_active ?? true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSave()
      onClose()
    } catch (err) {
      setError('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Auteur *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleChange('author', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Prix (€) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Stock</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </form>
  )
}

export default ProductManagement

