import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Map2GIS } from './Map2GIS';
import { api, Incident as APIIncident } from '@/lib/api';
import { toast } from 'sonner';

interface Incident {
  id: string | number;
  type: 'accident' | 'ice' | 'snow' | 'repair' | 'police';
  title: string;
  description: string;
  lat: number;
  lng: number;
  confirmations: number;
  timestamp: Date | string;
  userName: string;
}

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

const getTimeAgo = (date: Date | string) => {
  const timestamp = typeof date === 'string' ? new Date(date) : date;
  const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  return `${hours} ч назад`;
};

export const MapView = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          loadIncidents(location.lat, location.lng);
        },
        (error) => {
          console.log('Geolocation error:', error);
          const defaultLocation = { lat: 55.751244, lng: 37.618423 };
          setUserLocation(defaultLocation);
          loadIncidents(defaultLocation.lat, defaultLocation.lng);
        }
      );
    }
  }, []);

  const loadIncidents = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const data = await api.getIncidents({ 
        lat, 
        lng, 
        radius: 59, 
        status: 'active' 
      });
      
      const formattedIncidents = data.map((inc: APIIncident) => ({
        id: inc.id,
        type: inc.type,
        title: inc.title,
        description: inc.description,
        lat: inc.latitude,
        lng: inc.longitude,
        confirmations: inc.confirmations_count || 0,
        timestamp: inc.created_at,
        userName: inc.first_name && inc.last_name 
          ? `${inc.first_name} ${inc.last_name}` 
          : inc.username || 'Аноним'
      }));
      
      setIncidents(formattedIncidents);
    } catch (error) {
      console.error('Error loading incidents:', error);
      toast.error('Не удалось загрузить инциденты');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (incidentId: string | number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    try {
      await api.confirmIncident(Number(incidentId), Number(userId));
      toast.success('Инцидент подтверждён!');
      if (userLocation) {
        loadIncidents(userLocation.lat, userLocation.lng);
      }
    } catch (error) {
      toast.error('Ошибка подтверждения');
    }
  };

  const markers = incidents.map(inc => ({
    id: inc.id,
    coordinates: [inc.lng, inc.lat] as [number, number],
    type: inc.type,
    title: inc.title
  }));

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

      {userLocation ? (
        <Map2GIS
          center={[userLocation.lng, userLocation.lat]}
          zoom={12}
          markers={markers}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Map" size={40} className="text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              {loading ? 'Загрузка карты...' : 'Запрос местоположения...'}
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-24 left-0 right-0 z-10 px-4 pb-4 space-y-3 max-h-[50vh] overflow-y-auto">
        {incidents.map((incident) => (
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
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirm(incident.id);
                    }}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="ThumbsUp" size={18} />
                    Подтвердить инцидент
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
        {incidents.length === 0 && !loading && (
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="AlertCircle" size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Инцидентов нет</h3>
            <p className="text-sm text-muted-foreground">
              В вашем радиусе пока нет сообщений о проблемах на дороге
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
