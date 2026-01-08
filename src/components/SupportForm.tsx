import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

export const SupportForm = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error('Заполните все поля');
      return;
    }
    toast.success('Сообщение отправлено в поддержку!');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="h-full w-full bg-background p-4 overflow-y-auto animate-fade-in">
      <div className="max-w-md mx-auto space-y-6 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Icon name="MessageCircle" size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Поддержка</h1>
            <p className="text-sm text-muted-foreground">Свяжитесь с нами</p>
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base font-semibold">
                Тема обращения
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Краткое описание проблемы"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-base font-semibold">
                Сообщение
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Подробно опишите вашу проблему или вопрос"
                className="min-h-40 text-base"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl">
              <Icon name="Send" size={20} className="mr-2" />
              Отправить сообщение
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Популярные вопросы</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-start gap-3">
                <Icon name="HelpCircle" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">Как добавить инцидент?</div>
                  <div className="text-sm text-muted-foreground">
                    Нажмите кнопку "Добавить" в нижнем меню
                  </div>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-start gap-3">
                <Icon name="HelpCircle" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">Как работают подтверждения?</div>
                  <div className="text-sm text-muted-foreground">
                    Другие пользователи могут подтвердить ваш инцидент
                  </div>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-start gap-3">
                <Icon name="HelpCircle" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">Радиус видимости инцидентов</div>
                  <div className="text-sm text-muted-foreground">
                    Вы видите инциденты в радиусе 59 км от вашего местоположения
                  </div>
                </div>
              </div>
            </button>
          </div>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium mb-1">Время ответа</div>
              <div className="text-muted-foreground">
                Мы отвечаем на все обращения в течение 24 часов
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
