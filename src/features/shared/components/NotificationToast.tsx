import React from 'react';
import type { ToastNotification } from '../types/shared.types.ts';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface NotificationToastProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onDismiss,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {notifications.map(notif => {
        const icon = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          warning: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-[#FF6B35] shrink-0" />,
        }[notif.type];

        return (
          <div
            key={notif.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#0A1128] text-white border border-[#1A2D61] rounded-xl shadow-xl animate-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              {icon}
              <span>{notif.message}</span>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(notif.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
