import { useState } from 'react';
import { MapView } from '@/components/MapView';
import { AddIncidentForm } from '@/components/AddIncidentForm';
import { UserProfile } from '@/components/UserProfile';
import { UserPosts } from '@/components/UserPosts';
import { AdminPanel } from '@/components/AdminPanel';
import { SupportForm } from '@/components/SupportForm';
import { BottomNav } from '@/components/BottomNav';

export type Screen = 'map' | 'add' | 'profile' | 'posts' | 'admin' | 'support';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');
  const [isAdmin] = useState(true);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'map':
        return <MapView />;
      case 'add':
        return <AddIncidentForm onClose={() => setCurrentScreen('map')} />;
      case 'profile':
        return <UserProfile />;
      case 'posts':
        return <UserPosts />;
      case 'admin':
        return <AdminPanel />;
      case 'support':
        return <SupportForm />;
      default:
        return <MapView />;
    }
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {renderScreen()}
      </div>
      <BottomNav 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default Index;
