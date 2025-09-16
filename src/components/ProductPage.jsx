import { useState } from 'react'
import { Minus, Plus, Share2, Truck, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useCartStore from '@/store/cartStore'
import mainProductImage from '@/assets/main_product_image.jpeg'
import thumbnail1 from '@/assets/product_thumbnail_1.jpeg'
import thumbnail2 from '@/assets/product_thumbnail_2.jpeg'
import thumbnail3 from '@/assets/product_thumbnail_3.jpeg'

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(mainProductImage)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const product = {
    id: 1,
    title: 'Les Murmures du Temps',
    subtitle: 'Une odyssée littéraire captivante',
    price: 24.90,
    stock: 47,
    image: mainProductImage
  }

  const images = [
    { src: mainProductImage, alt: 'Les Murmures du Temps - Image principale' },
    { src: thumbnail1, alt: 'Les Murmures du Temps - Vue 1' },
    { src: thumbnail2, alt: 'Les Murmures du Temps - Vue 2' },
    { src: thumbnail3, alt: 'Les Murmures du Temps - Vue 3' }
  ]

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change))
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    // Optionnel: afficher une notification de succès
    alert(`${quantity} exemplaire(s) de "${product.title}" ajouté(s) au panier !`)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galerie d'images */}
        <div className="space-y-4">
          {/* Image principale */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt="Les Murmures du Temps"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Miniatures */}
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image.src)}
                className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                  selectedImage === image.src ? 'border-purple-600' : 'border-transparent'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Informations produit */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Les Murmures du Temps
            </h1>
            <p className="text-lg text-gray-600">
              Une odyssée littéraire captivante
            </p>
          </div>

          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            47 en stock
          </Badge>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">24.90 €</div>
            <p className="text-sm text-gray-600">TTC, livraison incluse</p>
          </div>

          {/* Sélecteur de quantité */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quantité
            </label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleAddToCart}
            >
              Ajouter au panier
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              Payer avec PayPal
            </Button>
          </div>

          {/* Informations de livraison */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Truck className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Livraison Mondial Relay</span>
            </div>
            <p className="text-sm text-gray-600">Locker • Point Relais • Domicile</p>
            <p className="text-sm text-gray-600 mt-2">
              Pour les commandes en gros, <a href="/contact" className="text-purple-600 hover:underline">nous contacter</a>
            </p>
          </div>

          {/* Partage */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Partager</h3>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex items-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copier le lien</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Onglets d'information */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="shipping">Livraison & Retours</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">👤</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Auteur</p>
                    <p className="font-medium">Claire Montagne</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm">📄</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pages</p>
                    <p className="font-medium">342</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">📏</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Format</p>
                    <p className="font-medium">14 x 20 cm</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">📖</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reliure</p>
                    <p className="font-medium">Souple</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">#</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ISBN</p>
                    <p className="font-medium">978-2-123456-78-9</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">🏢</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Éditeur</p>
                    <p className="font-medium">Éditions Lumière</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <Badge variant="secondary">Livre neuf</Badge>
              <Badge variant="secondary">Expédition rapide</Badge>
              <Badge variant="secondary">Satisfaction garantie</Badge>
            </div>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Délais de livraison ?</h3>
                <p className="text-gray-600">
                  2-3 jours pour Point Relais et Locker, 3-5 jours pour domicile.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Frais de port ?</h3>
                <p className="text-gray-600">
                  Livraison gratuite incluse dans le prix affiché.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Retours</h3>
                <p className="text-gray-600">
                  Retour gratuit sous 14 jours. Le livre doit être en parfait état.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Section "Vous aimerez aussi" */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Vous aimerez aussi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-32 bg-gray-200 rounded-lg mx-auto mb-4"></div>
              <h3 className="font-medium text-gray-900 mb-2">Livre à venir</h3>
              <p className="text-sm text-gray-600">D'autres ouvrages seront bientôt disponibles...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductPage

