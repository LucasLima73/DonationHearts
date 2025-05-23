import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Plus, Share2, BarChart3, Settings, Megaphone, Users } from 'lucide-react';
import { Link } from 'wouter';

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const quickActions = [
    {
      title: 'Nova Campanha',
      description: 'Crie uma nova campanha em minutos',
      icon: Plus,
      href: '/campaigns/new',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    },
    {
      title: 'Compartilhar',
      description: 'Divulgue suas campanhas nas redes sociais',
      icon: Share2,
      href: '/campaigns/my',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      title: 'Analytics',
      description: 'Veja métricas detalhadas das suas campanhas',
      icon: BarChart3,
      href: '/analytics',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      title: 'Configurações',
      description: 'Gerencie sua conta e preferências',
      icon: Settings,
      href: '/profile',
      color: 'from-gray-500 to-slate-600',
      bgColor: 'bg-gray-500/10',
      textColor: 'text-gray-400'
    }
  ];

  return (
    <div className={className}>
      <Card className="border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            <Megaphone className="h-5 w-5 mr-2 text-primary" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  asChild
                  variant="ghost"
                  className="h-auto p-4 w-full justify-start hover:bg-white/5 border border-white/5 rounded-lg group"
                >
                  <Link href={action.href}>
                    <div className="flex items-start space-x-3 w-full">
                      <div className={`h-10 w-10 rounded-lg ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon className={`h-5 w-5 ${action.textColor}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-white group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}