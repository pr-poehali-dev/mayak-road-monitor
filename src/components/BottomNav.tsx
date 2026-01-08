import { Screen } from '@/pages/Index';
import Icon from '@/components/ui/icon';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isAdmin: boolean;
}

export const BottomNav = ({ currentScreen, onNavigate, isAdmin }: BottomNavProps) => {
  const navItems = [
    { id: 'map' as Screen, icon: 'Map', label: 'Карта' },
    { id: 'add' as Screen, icon: 'Plus', label: 'Добавить' },
    { id: 'posts' as Screen, icon: 'List', label: 'Посты' },
    { id: 'profile' as Screen, icon: 'User', label: 'Профиль' },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin' as Screen, icon: 'Shield', label: 'Админ' });
  }

  return (
    <nav className="bg-white border-t border-border shadow-lg">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
              currentScreen === item.id
                ? 'text-primary scale-110'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={item.icon} size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
