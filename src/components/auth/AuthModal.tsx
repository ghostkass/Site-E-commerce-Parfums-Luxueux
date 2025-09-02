import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AuthModalProps {
  trigger: React.ReactNode;
  onAuthSuccess?: () => void;
  onSignIn?: (email: string, password: string) => Promise<any>;
  onSignUp?: (email: string, password: string, name: string) => Promise<any>;
  useMockData?: boolean;
}

export function AuthModal({ trigger, onAuthSuccess, onSignIn, onSignUp, useMockData = false }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  // Form states
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!onSignIn) {
        toast.error('Erreur de configuration', {
          description: 'La méthode de connexion n\'est pas disponible.',
        });
        return;
      }

      const { data, error } = await onSignIn(signInData.email, signInData.password);
      
      if (error) {
        toast.error('Erreur de connexion', {
          description: error,
        });
        return;
      }

      toast.success('Connexion réussie', {
        description: useMockData 
          ? 'Vous êtes connecté en mode démonstration.' 
          : 'Vous êtes maintenant connecté à votre compte.',
      });

      setIsOpen(false);
      onAuthSuccess?.();
    } catch (error) {
      toast.error('Erreur de connexion', {
        description: 'Une erreur inattendue s\'est produite.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Erreur', {
        description: 'Les mots de passe ne correspondent pas.',
      });
      setIsLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      toast.error('Erreur', {
        description: 'Le mot de passe doit contenir au moins 6 caractères.',
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!onSignUp) {
        toast.error('Erreur de configuration', {
          description: 'La méthode d\'inscription n\'est pas disponible.',
        });
        return;
      }

      const { data, error } = await onSignUp(signUpData.email, signUpData.password, signUpData.name);
      
      if (error) {
        toast.error('Erreur d\'inscription', {
          description: error,
        });
        return;
      }

      toast.success('Inscription réussie', {
        description: useMockData 
          ? 'Votre compte de démonstration a été créé. Vous pouvez maintenant vous connecter.'
          : 'Votre compte a été créé. Vous pouvez maintenant vous connecter.',
      });

      // Switch to sign in tab
      setActiveTab('signin');
      setSignInData({
        email: signUpData.email,
        password: '',
      });
    } catch (error) {
      toast.error('Erreur d\'inscription', {
        description: 'Une erreur inattendue s\'est produite.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-serif text-luxury-black">
            Bienvenue chez LuxeScents
            {useMockData && (
              <span className="block text-sm text-orange-600 font-normal mt-1">
                Mode démonstration
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-6 mt-6">
            {useMockData && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-800">
                  <strong>Mode démonstration :</strong> Utilisez n'importe quel email et mot de passe pour vous connecter.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder={useMockData ? "demo@luxescents.fr" : "votre@email.com"}
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={useMockData ? "demo123" : "••••••••"}
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-luxury-gold hover:bg-luxury-dark-gold text-luxury-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-luxury-gold hover:text-luxury-dark-gold"
                onClick={() => toast.info('Fonctionnalité bientôt disponible')}
              >
                Mot de passe oublié ?
              </button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-6 mt-6">
            {useMockData && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-800">
                  <strong>Mode démonstration :</strong> Créez un compte temporaire pour tester les fonctionnalités.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signup-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-luxury-gold hover:bg-luxury-dark-gold text-luxury-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Inscription...' : 'Créer un compte'}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              En créant un compte, vous acceptez nos{' '}
              <button className="text-luxury-gold hover:text-luxury-dark-gold">
                conditions d'utilisation
              </button>{' '}
              et notre{' '}
              <button className="text-luxury-gold hover:text-luxury-dark-gold">
                politique de confidentialité
              </button>
              .
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}