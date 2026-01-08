import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Incident {
  id: string;
  type: 'accident' | 'ice' | 'snow' | 'repair' | 'police';
  title: string;
  description: string;
  lat: number;
  lng: number;
  confirmations: number;
  timestamp: Date;
  userName: string;
}

const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'accident',
    title: 'ДТП на перекрёстке',
    description: 'Столкновение двух автомобилей, левая полоса перекрыта',
    lat: 55.751244,
    lng: 37.618423,
    confirmations: 12,
    timestamp: new Date(Date.now() - 15 * 60000),
    userName: 'Александр К.'
  },
  {
    id: '2',
    type: 'ice',
    title: 'Гололёд',
    description: 'Участок дороги покрыт льдом, будьте осторожны',
    lat: 55.755826,
    lng: 37.617299,
    confirmations: 8,
    timestamp: new Date(Date.now() - 30 * 60000),
    userName: 'Мария П.'
  },
  {
    id: '3',
    type: 'repair',
    title: 'Ремонт дороги',
    description: 'Дорожные работы, движение по одной полосе',
    lat: 55.748212,
    lng: 37.615643,
    confirmations: 5,
    timestamp: new Date(Date.now() - 45 * 60000),
    userName: 'Дмитрий С.'
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
  return `${hours} ч назад`;
};

export const MapView = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          setUserLocation({ lat: 55.751244, lng: 37.618423 });
        }
      );
    }
  }, []);

  return (
    <div className="h-full w-full relative bg-slate-50">
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Icon name="MapPin" size={16} className="text-primary" />
              <span>Радиус: 59 км</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">МАЯК</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Обстановка на дороге в реальном времени
            </p>
          </div>
        </Card>
      </div>

      <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Map" size={40} className="text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            {userLocation ? 'Карта загружается...' : 'Запрос местоположения...'}
          </p>
        </div>
      </div>

      <div className="absolute bottom-24 left-0 right-0 z-10 px-4 pb-4 space-y-3 max-h-[50vh] overflow-y-auto">
        {mockIncidents.map((incident) => (
          <Card
            key={incident.id}
            className="bg-white/95 backdrop-blur-sm shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-200 animate-fade-in"
            onClick={() => setSelectedIncident(selectedIncident?.id === incident.id ? null : incident)}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`${getIncidentColor(incident.type)} p-3 rounded-2xl flex-shrink-0`}>
                  <Icon name={getIncidentIcon(incident.type)} size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{incident.title}</h3>
                    <Badge variant="secondary" className="flex-shrink-0 text-xs">
                      {getTimeAgo(incident.timestamp)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">от {incident.userName}</span>
                    <div className="flex items-center gap-1 text-primary">
                      <Icon name="ThumbsUp" size={14} />
                      <span className="font-medium">{incident.confirmations}</span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedIncident?.id === incident.id && (
                <div className="mt-4 pt-4 border-t animate-slide-up">
                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Icon name="ThumbsUp" size={18} />
                    Подтвердить инцидент
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
