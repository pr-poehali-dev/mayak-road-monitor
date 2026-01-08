import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export const UserProfile = () => {
  const user = {
    name: 'Александр Козлов',
    username: '@alex_driver',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    postsCount: 23,
    confirmations: 145,
    memberSince: 'Октябрь 2024'
  };

  return (
    <div className="h-full w-full bg-background p-4 overflow-y-auto animate-fade-in">
      <div className="max-w-md mx-auto space-y-6 pb-6">
        <h1 className="text-2xl font-bold">Профиль</h1>

        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-28 h-28 border-4 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground mt-1">{user.username}</p>
              <Badge variant="secondary" className="mt-2">
                <Icon name="Calendar" size={14} className="mr-1" />
                С нами с {user.memberSince}
              </Badge>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 pt-4">
              <div className="bg-primary/5 rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary">{user.postsCount}</div>
                <div className="text-sm text-muted-foreground mt-1">Публикаций</div>
              </div>
              <div className="bg-primary/5 rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary">{user.confirmations}</div>
                <div className="text-sm text-muted-foreground mt-1">Подтверждений</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Настройки</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-12 rounded-xl">
              <Icon name="Bell" size={20} className="mr-3" />
              Уведомления
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 rounded-xl">
              <Icon name="MapPin" size={20} className="mr-3" />
              Местоположение
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 rounded-xl">
              <Icon name="Shield" size={20} className="mr-3" />
              Приватность
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 rounded-xl">
              <Icon name="MessageCircle" size={20} className="mr-3" />
              Поддержка
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5">
            <Icon name="LogOut" size={20} className="mr-3" />
            Выйти из аккаунта
          </Button>
        </Card>
      </div>
    </div>
  );
};
