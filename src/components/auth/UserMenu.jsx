import React, { useState } from 'react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { User, Package, Settings, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const UserMenu = ({ onOpenProfile, onOpenOrders, onOpenAdmin, user, profile, isAdmin: isAdminProp }) => {
  const auth = useAuth()
  const [loading, setLoading] = useState(false)

  // Utiliser les props si fournis, sinon utiliser le contexte d'authentification
  const currentUser = user || auth.user
  const currentProfile = profile || auth.profile
  const currentIsAdmin = isAdminProp !== undefined ? isAdminProp : auth.isAdmin()

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await auth.signOut()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = () => {
    if (currentProfile?.first_name && currentProfile?.last_name) {
      return `${currentProfile.first_name[0]}${currentProfile.last_name[0]}`.toUpperCase()
    }
    if (currentUser?.email) {
      return currentUser.email[0].toUpperCase()
    }
    return 'U'
  }

  const getDisplayName = () => {
    if (currentProfile?.first_name && currentProfile?.last_name) {
      return `${currentProfile.first_name} ${currentProfile.last_name}`
    }
    if (currentProfile?.first_name) {
      return currentProfile.first_name
    }
    return currentUser?.email || 'Utilisateur'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-purple-600 text-white text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getDisplayName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onOpenProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Mon profil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onOpenOrders} className="cursor-pointer">
          <Package className="mr-2 h-4 w-4" />
          <span>Mes commandes</span>
        </DropdownMenuItem>
        
        {currentIsAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenAdmin} className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Administration</span>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="cursor-pointer text-red-600 focus:text-red-600"
          disabled={loading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading ? 'Déconnexion...' : 'Se déconnecter'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu

