import { CheckCircle2 } from 'lucide-react';

export default function Benefits() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
      <div className="flex items-center gap-2 text-gray-700">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <span className="font-medium">Weryfikacja najemcy</span>
      </div>

      <div className="flex items-center gap-2 text-gray-700">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <span className="font-medium">Oszczędność czasu</span>
      </div>
    </div>
  );
}
