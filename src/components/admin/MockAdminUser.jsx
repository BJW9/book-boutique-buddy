import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Shield, User } from 'lucide-react'

const MockAdminUser = ({ onLoginAsAdmin, onLoginAsCustomer }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Mode Développement
          </CardTitle>
          <CardDescription className="text-xs">
            Connexion rapide pour tester l'interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={onLoginAsAdmin}
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Shield className="h-3 w-3 mr-2" />
            Se connecter en tant qu'Admin
          </Button>
          <Button
            onClick={onLoginAsCustomer}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <User className="h-3 w-3 mr-2" />
            Se connecter en tant que Client
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default MockAdminUser

