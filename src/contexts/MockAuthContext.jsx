import React, { createContext, useContext, useState } from 'react'

const MockAuthContext = createContext({})

export const useMockAuth = () => {
  const context = useContext(MockAuthContext)
  if (!context) {
    throw new Error('useMockAuth must be used within a MockAuthProvider')
  }
  return context
}

export const MockAuthProvider = ({ children }) => {
  const [mockUser, setMockUser] = useState(null)
  const [mockProfile, setMockProfile] = useState(null)

  const mockSignInAsAdmin = () => {
    const adminUser = {
      id: 'admin-demo',
      email: 'admin@librairie-lumiere.com'
    }
    const adminProfile = {
      id: 'admin-demo',
      first_name: 'Admin',
      last_name: 'Demo',
      email: 'admin@librairie-lumiere.com',
      role: 'admin'
    }
    setMockUser(adminUser)
    setMockProfile(adminProfile)
  }

  const mockSignInAsCustomer = () => {
    const customerUser = {
      id: 'customer-demo',
      email: 'client@email.com'
    }
    const customerProfile = {
      id: 'customer-demo',
      first_name: 'Client',
      last_name: 'Demo',
      email: 'client@email.com',
      role: 'customer'
    }
    setMockUser(customerUser)
    setMockProfile(customerProfile)
  }

  const mockSignOut = () => {
    setMockUser(null)
    setMockProfile(null)
  }

  const isAuthenticated = () => !!mockUser
  const isAdmin = () => mockProfile?.role === 'admin'

  const value = {
    user: mockUser,
    profile: mockProfile,
    loading: false,
    isAuthenticated,
    isAdmin,
    mockSignInAsAdmin,
    mockSignInAsCustomer,
    signOut: mockSignOut
  }

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  )
}

export default MockAuthContext

