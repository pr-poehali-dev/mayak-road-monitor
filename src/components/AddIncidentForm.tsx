import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AddIncidentFormProps {
  onClose: () => void;
}

const incidentTypes = [
  { id: 'accident', icon: 'AlertTriangle', label: 'ДТП', color: 'bg-destructive' },
  { id: 'ice', icon: 'Snowflake', label: 'Гололёд', color: 'bg-blue-500' },
  { id: 'snow', icon: 'Cloud', label: 'Снег', color: 'bg-slate-400' },
  { id: 'repair', icon: 'Construction', label: 'Ремонт', color: 'bg-orange-500' },
  { id: 'police', icon: 'ShieldAlert', label: 'ДПС', color: 'bg-indigo-600' },
];

export const AddIncidentForm = ({ onClose }: AddIncidentFormProps) => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !title || !description) {
      toast.error('Заполните все поля');
      return;
    }
    toast.success('Инцидент добавлен!');
    onClose();
  };

  return (
    <div className="h-full w-full bg-background p-4 overflow-y-auto animate-fade-in">
      <div className="max-w-md mx-auto space-y-6 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Добавить инцидент</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Тип инцидента</Label>
              <div className="grid grid-cols-3 gap-3">
                {incidentTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      selectedType === type.id
                        ? 'border-primary bg-primary/5 scale-105'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`${type.color} p-3 rounded-xl`}>
                      <Icon name={type.icon} size={24} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Заголовок
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Краткое описание"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Описание
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Подробности инцидента"
                className="min-h-32 text-base"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">
              <Icon name="MapPin" size={16} className="text-primary flex-shrink-0" />
              <span>Ваше местоположение будет определено автоматически</span>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl">
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить инцидент
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
