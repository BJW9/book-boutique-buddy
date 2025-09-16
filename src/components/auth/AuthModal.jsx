import React, { useState } from 'react'
import { Dialog, DialogContent, DialogOverlay } from '../ui/dialog'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ResetPasswordForm from './ResetPasswordForm'

const AUTH_MODES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  RESET: 'reset'
}

const AuthModal = ({ isOpen, onClose, initialMode = AUTH_MODES.LOGIN }) => {
  const [mode, setMode] = useState(initialMode)

  const handleSuccess = () => {
    onClose()
  }

  const handleSwitchToLogin = () => {
    setMode(AUTH_MODES.LOGIN)
  }

  const handleSwitchToSignup = () => {
    setMode(AUTH_MODES.SIGNUP)
  }

  const handleSwitchToReset = () => {
    setMode(AUTH_MODES.RESET)
  }

  const renderForm = () => {
    switch (mode) {
      case AUTH_MODES.LOGIN:
        return (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToReset={handleSwitchToReset}
          />
        )
      case AUTH_MODES.SIGNUP:
        return (
          <SignupForm
            onSuccess={handleSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )
      case AUTH_MODES.RESET:
        return (
          <ResetPasswordForm
            onBack={handleSwitchToLogin}
          />
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
        {renderForm()}
      </DialogContent>
    </Dialog>
  )
}

export { AUTH_MODES }
export default AuthModal

