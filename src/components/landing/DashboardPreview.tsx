import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DollarSign, Home, CheckCircle2, Clock } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-4xl rounded-2xl shadow-2xl ring-1 ring-black/5 backdrop-blur-sm animate-fadeIn">
        <CardHeader className="flex items-center gap-3 px-8 pt-8">
          <Avatar className="bg-indigo-600 text-white">
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">Braian Dashboard</CardTitle>
            <p className="text-sm text-slate-500">
              Zalogowany jako Marek Właściciel
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Czynsz najmu Metric */}
            <div className="rounded-xl bg-emerald-50 p-6">
              <div className="flex items-center gap-3 text-sm text-emerald-700">
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Czynsz najmu</span>
              </div>
              <div className="mt-2 text-3xl font-bold text-emerald-900">
                2 400 zł
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-600">
                    Opłata administracyjna
                  </span>
                  <span className="font-semibold text-emerald-800">800 zł</span>
                </div>
              </div>
            </div>

            {/* Nieruchomość Metric */}
            <div className="rounded-xl bg-slate-100 p-6">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Home className="h-5 w-5" />
                <span className="font-medium">Nieruchomość</span>
              </div>
              <div className="mt-2 text-lg font-bold text-slate-900 leading-tight">
                Al. Jana Pawła II 32a/5
                <br />
                <span className="text-sm font-medium text-slate-600">
                  Warszawa
                </span>
              </div>
            </div>
          </div>

          {/* Status Rows */}
          <div className="space-y-4">
            {/* Umowa podpisana */}
            <div className="flex items-center justify-between rounded-xl border bg-white p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-gray-800">
                  Umowa podpisana
                </span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">Gotowe</Badge>
            </div>

            {/* Audyt nieruchomości */}
            <div className="flex items-center justify-between rounded-xl border bg-white p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-800">
                  Audyt nieruchomości
                </span>
              </div>
              <Badge className="bg-blue-100 text-blue-700">W toku</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
