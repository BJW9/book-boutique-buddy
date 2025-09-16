import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import ProductPage from './components/ProductPage'
import ContactPage from './components/ContactPage'
import CartPage from './components/CartPage'
import CheckoutPage from './components/checkout/CheckoutPage'
import OrdersPage from './components/orders/OrdersPage'
import SearchPage from './components/search/SearchPage'
import WishlistPage from './components/wishlist/WishlistPage'
import RecommendationsPage from './components/recommendations/RecommendationsPage'
import MockAdminUser from './components/admin/MockAdminUser'
import { AuthProvider } from './contexts/AuthContext'
import { MockAuthProvider, useMockAuth } from './contexts/MockAuthContext'
import './App.css'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('product')
  const { mockSignInAsAdmin, mockSignInAsCustomer } = useMockAuth()

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleCheckout = () => {
    setCurrentPage('checkout')
  }

  const handleOrderComplete = () => {
    setCurrentPage('orders')
  }

  const handleBackToShopping = () => {
    setCurrentPage('product')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'product':
        return <ProductPage />
      case 'contact':
        return <ContactPage />
      case 'cart':
        return <CartPage onCheckout={handleCheckout} />
      case 'checkout':
        return (
          <CheckoutPage 
            onBack={() => setCurrentPage('cart')}
            onOrderComplete={handleOrderComplete}
          />
        )
      case 'orders':
        return <OrdersPage onBack={handleBackToShopping} />
      case 'search':
        return <SearchPage onBack={handleBackToShopping} />
      case 'wishlist':
        return <WishlistPage onBack={handleBackToShopping} />
      case 'recommendations':
        return <RecommendationsPage onBack={handleBackToShopping} />
      default:
        return <ProductPage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        onOpenOrders={() => setCurrentPage('orders')}
        onOpenSearch={() => setCurrentPage('search')}
        onOpenWishlist={() => setCurrentPage('wishlist')}
        onOpenRecommendations={() => setCurrentPage('recommendations')}
      />
      <main>
        {renderCurrentPage()}
      </main>
      
      {/* Composant de test pour l'administration */}
      <MockAdminUser 
        onLoginAsAdmin={mockSignInAsAdmin}
        onLoginAsCustomer={mockSignInAsCustomer}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <MockAuthProvider>
        <AppContent />
      </MockAuthProvider>
    </AuthProvider>
  )
}

export default App

