import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface TelegramAuthProps {
  onAuthSuccess: (user: any) => void;
}

declare global {
  interface Window {
    Telegram?: any;
  }
}

export const TelegramAuth = ({ onAuthSuccess }: TelegramAuthProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'YOUR_BOT_USERNAME');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '10');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    
    document.getElementById('telegram-login-container')?.appendChild(script);

    (window as any).onTelegramAuth = async (user: any) => {
      try {
        const authenticatedUser = await api.authenticateWithTelegram(user);
        localStorage.setItem('userId', authenticatedUser.id.toString());
        localStorage.setItem('userIsAdmin', authenticatedUser.is_admin.toString());
        onAuthSuccess(authenticatedUser);
        toast.success('Вы успешно авторизовались!');
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Ошибка авторизации');
      }
    };

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [onAuthSuccess]);

  const handleDemoAuth = async () => {
    try {
      const demoUser = {
        id: 999999,
        username: 'demo_user',
        first_name: 'Демо',
        last_name: 'Пользователь',
        photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
      };
      
      const authenticatedUser = await api.authenticateWithTelegram(demoUser);
      localStorage.setItem('userId', authenticatedUser.id.toString());
      localStorage.setItem('userIsAdmin', 'true');
      onAuthSuccess(authenticatedUser);
      toast.success('Демо-режим активирован!');
    } catch (error) {
      console.error('Demo auth error:', error);
      toast.error('Ошибка демо-входа');
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center animate-scale-in">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-3xl flex items-center justify-center">
          <Icon name="Shield" size={40} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">МАЯК</h1>
        <p className="text-muted-foreground mb-8">
          Войдите через Telegram, чтобы начать отслеживать обстановку на дороге
        </p>

        <div id="telegram-login-container" className="mb-4 flex justify-center"></div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">или</span>
          </div>
        </div>

        <Button 
          onClick={handleDemoAuth}
          variant="outline" 
          className="w-full h-12 rounded-xl"
        >
          <Icon name="Play" size={20} className="mr-2" />
          Демо-режим
        </Button>

        <p className="text-xs text-muted-foreground mt-6">
          После авторизации вы сможете добавлять инциденты и подтверждать сообщения других пользователей
        </p>
      </Card>
    </div>
  );
};
