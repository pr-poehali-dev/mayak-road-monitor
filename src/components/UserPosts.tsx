import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Post {
  id: string;
  type: string;
  title: string;
  description: string;
  confirmations: number;
  timestamp: Date;
  status: 'active' | 'resolved';
}

const mockPosts: Post[] = [
  {
    id: '1',
    type: 'accident',
    title: 'ДТП на перекрёстке',
    description: 'Столкновение двух автомобилей, левая полоса перекрыта',
    confirmations: 12,
    timestamp: new Date(Date.now() - 15 * 60000),
    status: 'active'
  },
  {
    id: '2',
    type: 'repair',
    title: 'Ремонт дороги',
    description: 'Дорожные работы на шоссе',
    confirmations: 5,
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    status: 'resolved'
  },
  {
    id: '3',
    type: 'ice',
    title: 'Гололёд на мосту',
    description: 'Скользкое покрытие, будьте осторожны',
    confirmations: 8,
    timestamp: new Date(Date.now() - 30 * 60000),
    status: 'active'
  }
];

const getIncidentIcon = (type: string) => {
  switch (type) {
    case 'accident': return 'AlertTriangle';
    case 'ice': return 'Snowflake';
    case 'snow': return 'Cloud';
    case 'repair': return 'Construction';
    case 'police': return 'ShieldAlert';
    default: return 'MapPin';
  }
};

const getIncidentColor = (type: string) => {
  switch (type) {
    case 'accident': return 'bg-destructive';
    case 'ice': return 'bg-blue-500';
    case 'snow': return 'bg-slate-400';
    case 'repair': return 'bg-orange-500';
    case 'police': return 'bg-indigo-600';
    default: return 'bg-primary';
  }
};

const getTimeAgo = (date: Date) => {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} д назад`;
};

export const UserPosts = () => {
  return (
    <div className="h-full w-full bg-background p-4 overflow-y-auto animate-fade-in">
      <div className="max-w-md mx-auto space-y-6 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Мои посты</h1>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {mockPosts.length}
          </Badge>
        </div>

        <div className="space-y-4">
          {mockPosts.map((post) => (
            <Card key={post.id} className="p-4 hover:shadow-lg transition-shadow animate-fade-in">
              <div className="flex items-start gap-3">
                <div className={`${getIncidentColor(post.type)} p-3 rounded-2xl flex-shrink-0`}>
                  <Icon name={getIncidentIcon(post.type)} size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    <Badge 
                      variant={post.status === 'active' ? 'default' : 'secondary'}
                      className="flex-shrink-0"
                    >
                      {post.status === 'active' ? 'Активно' : 'Решено'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{post.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{getTimeAgo(post.timestamp)}</span>
                    <div className="flex items-center gap-1 text-primary">
                      <Icon name="ThumbsUp" size={14} />
                      <span className="font-medium">{post.confirmations}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {mockPosts.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="List" size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Пока нет постов</h3>
            <p className="text-sm text-muted-foreground">
              Добавьте первый инцидент, чтобы он появился здесь
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
