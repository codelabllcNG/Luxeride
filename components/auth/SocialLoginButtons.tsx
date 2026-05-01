'use client';
import { Button } from '../shared/Button'; 
import { FacebookIcon, ChromeIcon } from 'lucide-react';

export function SocialLoginButtons() {
  const handleSocialLogin = (provider: string) => {
    console.log(`Attempting login with ${provider}`);
   
  };

  return (
    <div className="space-y-3">
      {/* Google */}
      <Button 
        variant="outline" 
        fullWidth 
        className="relative"
        onClick={() => handleSocialLogin('google')}
      >
        <ChromeIcon className="w-5 h-5 absolute left-4" />
        Continue with Google
      </Button>

      {/* Facebook */}
      <Button 
        variant="outline" 
        fullWidth 
        className="relative"
        onClick={() => handleSocialLogin('facebook')}
      >
        <FacebookIcon className="w-5 h-5 absolute left-4 text-blue-600" />
        Continue with Facebook
      </Button>

      {/* Apple */}
      <Button 
        variant="outline" 
        fullWidth 
        className="relative"
        onClick={() => handleSocialLogin('apple')}
      >
        {/* Apple Logo Fallback (Lucide doesn't usually include brand logos) */}
        <span className="w-5 h-5 absolute left-4 flex items-center justify-center font-bold text-lg leading-none pb-1">
          
        </span>
        Continue with Apple
      </Button>
    </div>
  );
}