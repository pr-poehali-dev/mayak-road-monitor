import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface PendingPost {
  id: string;
  type: string;
  title: string;
  description: string;
  userName: string;
  timestamp: Date;
  location: string;
}

const mockPendingPosts: PendingPost[] = [
  {
    id: '1',
    type: 'accident',
    title: 'ДТП на проспекте',
    description: 'Авария с участием трёх машин',
    userName: 'Иван Петров',
    timestamp: new Date(Date.now() - 5 * 60000),
    location: 'Москва, Ленинский пр-т'
  },
  {
    id: '2',
    type: 'ice',
    title: 'Гололёд',
    description: 'Опасный участок дороги',
    userName: 'Мария Сидорова',
    timestamp: new Date(Date.now() - 10 * 60000),
    location: 'Москва, ул. Арбат'
  }
];

const getIncidentIcon = (type: string) => {
  switch (type) {
    case 'accident': return 'AlertTriangle';
    case 'ice': return 'Snowflake';
    case 'snow': return 'Cloud';
    case 'repair': return 'Construction';
    default: return 'MapPin';
  }
};

const getIncidentColor = (type: string) => {
  switch (type) {
    case 'accident': return 'bg-destructive';
    case 'ice': return 'bg-blue-500';
    case 'snow': return 'bg-slate-400';
    case 'repair': return 'bg-orange-500';
    default: return 'bg-primary';
  }
};

export const AdminPanel = () => {
  const [pendingPosts, setPendingPosts] = useState(mockPendingPosts);

  const handleApprove = (id: string) => {
    setPendingPosts(prev => prev.filter(post => post.id !== id));
    toast.success('Пост одобрен');
  };

  const handleReject = (id: string) => {
    setPendingPosts(prev => prev.filter(post => post.id !== id));
    toast.success('Пост отклонён');
  };

  const stats = {
    totalPosts: 156,
    activePosts: 89,
    totalUsers: 1234,
    pending: pendingPosts.length
  };

  return (
    <div className="h-full w-full bg-background p-4 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Icon name="Shield" size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Панель администратора</h1>
            <p className="text-sm text-muted-foreground">Управление контентом</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Icon name="List" size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <div className="text-xs text-muted-foreground">Всего постов</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <Icon name="CheckCircle" size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.activePosts}</div>
                <div className="text-xs text-muted-foreground">Активных</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Icon name="Users" size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-xs text-muted-foreground">Пользователей</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-xl">
                <Icon name="Clock" size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">На модерации</div>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              На модерации
              {pendingPosts.length > 0 && (
                <Badge className="ml-2">{pendingPosts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingPosts.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={32} className="text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Нет постов на модерации</h3>
                <p className="text-sm text-muted-foreground">
                  Все посты проверены
                </p>
              </Card>
            ) : (
              pendingPosts.map((post) => (
                <Card key={post.id} className="p-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className={`${getIncidentColor(post.type)} p-3 rounded-2xl flex-shrink-0`}>
                      <Icon name={getIncidentIcon(post.type)} size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{post.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Icon name="User" size={12} />
                          <span>{post.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="MapPin" size={12} />
                          <span>{post.location}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(post.id)}
                          className="flex-1 rounded-xl"
                        >
                          <Icon name="Check" size={16} className="mr-1" />
                          Одобрить
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReject(post.id)}
                          className="flex-1 rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5"
                        >
                          <Icon name="X" size={16} className="mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Users" size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Управление пользователями</h3>
              <p className="text-sm text-muted-foreground">
                Функция в разработке
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
