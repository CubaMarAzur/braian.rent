'use client';

import {
  Plus,
  LogOut,
  DollarSign,
  Home,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from 'next-auth/react';
import type { PropertyWithDetails } from '@/types/property';

type DashboardData = {
  userName: string;
  rentPLN: number;
  propertiesCount: number;
  contractStatus: 'gotowe' | 'w toku' | 'brak';
  auditStatus: 'gotowe' | 'w toku' | 'brak';
};

interface BraianDashboardProps {
  data: DashboardData;
  properties: PropertyWithDetails[];
}

export default function BraianDashboard({
  data,
  properties,
}: BraianDashboardProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  const handleAddProperty = () => {
    alert('Funkcjonalność dodawania nieruchomości będzie dostępna wkrótce!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex justify-end items-center p-6 gap-4">
        <Button
          onClick={handleAddProperty}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj nieruchomość
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Wyloguj się
        </Button>
      </div>

      {/* Main Dashboard Card */}
      <div className="flex justify-center px-6">
        <Card className="w-full max-w-4xl shadow-xl ring-1 ring-black/5 rounded-2xl">
          <CardContent className="p-6">
            {/* Header with Avatar and User Info */}
            <div className="flex items-center gap-4 mb-8">
              <Avatar className="w-12 h-12 bg-indigo-600">
                <AvatarFallback className="bg-indigo-600 text-white font-bold text-lg">
                  B
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Braian Dashboard
                </h1>
                <p className="text-gray-600">Zalogowany jako {data.userName}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Czynsz Metric */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Czynsz
                      </h3>
                      <p className="text-3xl font-bold text-green-600">
                        {new Intl.NumberFormat('pl-PL').format(data.rentPLN)} zł
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nieruchomości Metric */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-slate-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Nieruchomości
                      </h3>
                      <p className="text-3xl font-bold text-gray-600">
                        {data.propertiesCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Rows */}
            <div className="space-y-4">
              {/* Umowa podpisana */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  {data.contractStatus === 'gotowe' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="font-medium text-gray-800">
                    Umowa podpisana
                  </span>
                </div>
                <Badge
                  variant={
                    data.contractStatus === 'gotowe' ? 'default' : 'secondary'
                  }
                  className={
                    data.contractStatus === 'gotowe'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }
                >
                  {data.contractStatus === 'gotowe'
                    ? 'Gotowe'
                    : data.contractStatus === 'w toku'
                      ? 'W toku'
                      : 'Brak'}
                </Badge>
              </div>

              {/* Audyt nieruchomości */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  {data.auditStatus === 'gotowe' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="font-medium text-gray-800">
                    Audyt nieruchomości
                  </span>
                </div>
                <Badge
                  variant={
                    data.auditStatus === 'gotowe' ? 'default' : 'secondary'
                  }
                  className={
                    data.auditStatus === 'gotowe'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }
                >
                  {data.auditStatus === 'gotowe'
                    ? 'Gotowe'
                    : data.auditStatus === 'w toku'
                      ? 'W toku'
                      : 'Brak'}
                </Badge>
              </div>
            </div>

            {/* Properties List (if any) */}
            {properties.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Lista nieruchomości
                </h3>
                <div className="space-y-3">
                  {properties.map((property, index) => (
                    <Card
                      key={property.id}
                      className="border border-gray-200 shadow-sm"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-indigo-600 font-bold text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {property.address}
                              </p>
                              <p className="text-sm text-gray-600">
                                {property.tenant
                                  ? property.tenant.name
                                  : 'Brak najemcy'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">
                              {property.currentPayment?.amountDue
                                ? `${new Intl.NumberFormat('pl-PL').format(property.currentPayment.amountDue)} zł`
                                : 'Brak danych'}
                            </p>
                            <Badge
                              variant={
                                property.currentPayment?.status === 'PAID'
                                  ? 'default'
                                  : 'destructive'
                              }
                              className={
                                property.currentPayment?.status === 'PAID'
                                  ? 'bg-green-500 hover:bg-green-600 text-white'
                                  : 'bg-red-500 hover:bg-red-600 text-white'
                              }
                            >
                              {property.currentPayment?.status === 'PAID'
                                ? 'Opłacone'
                                : property.currentPayment?.status === 'UNPAID'
                                  ? 'Nieopłacone'
                                  : 'Brak danych'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
