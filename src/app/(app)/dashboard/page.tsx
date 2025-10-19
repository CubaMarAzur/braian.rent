'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Home, DollarSign, Plus, LogOut } from 'lucide-react';

type DashboardData = {
  userName: string;
  rentPLN: number;
  propertiesCount: number;
  contractStatus: 'gotowe' | 'w toku' | 'brak';
  auditStatus: 'gotowe' | 'w toku' | 'brak';
};

const data: DashboardData = {
  userName: 'Marek Właściciel',
  rentPLN: 2500,
  propertiesCount: 1,
  contractStatus: 'gotowe',
  auditStatus: 'brak',
};

function StatusBadge({ state }: { state: DashboardData['contractStatus'] }) {
  if (state === 'gotowe')
    return <Badge className="bg-emerald-100 text-emerald-700">Gotowe</Badge>;
  if (state === 'w toku')
    return <Badge className="bg-blue-100 text-blue-700">W toku</Badge>;
  return <Badge className="bg-slate-100 text-slate-700">Brak</Badge>;
}

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16">
      <header className="flex items-center justify-end gap-3 py-4">
        <Button className="bg-white hover:bg-slate-50">
          <Plus className="h-4 w-4" /> Dodaj nieruchomość
        </Button>
        <Button className="bg-transparent hover:bg-slate-100">
          <LogOut className="h-4 w-4" /> Wyloguj się
        </Button>
      </header>

      <Card>
        <CardHeader className="flex items-center gap-3">
          <Avatar className="bg-indigo-600 text-white">
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Braian Dashboard</CardTitle>
            <p className="text-sm text-slate-500">
              Zalogowany jako {data.userName}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <DollarSign className="h-4 w-4" /> Czynsz
              </div>
              <div className="mt-1 text-2xl font-semibold text-emerald-900">
                {data.rentPLN.toLocaleString('pl-PL')} zł
              </div>
            </div>
            <div className="rounded-xl bg-slate-100 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Home className="h-4 w-4" /> Nieruchomości
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {data.propertiesCount}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="flex items-center justify-between border-b p-4">
              <span className="text-slate-700">Umowa podpisana</span>
              <StatusBadge state={data.contractStatus} />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-slate-700">Audyt nieruchomości</span>
              <StatusBadge state={data.auditStatus} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
