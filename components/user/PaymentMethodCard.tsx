import React from 'react';
import { Card } from '../shared/Card';
import { CreditCardIcon, TrashIcon } from 'lucide-react';
type PaymentMethodCardProps = {
  brand: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
  onDelete: () => void;
};
export function PaymentMethodCard({
  brand,
  last4,
  expiry,
  isDefault,
  onDelete
}: PaymentMethodCardProps) {
  return <Card className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-lg bg-dark-lighter text-grey-pastel border border-grey-muted">
          <CreditCardIcon className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-3">
            <h4 className="font-semibold text-grey-pastel capitalize">
              {brand} •••• {last4}
            </h4>
            {isDefault && <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary font-medium">
                Default
              </span>}
          </div>
          <p className="text-sm text-grey-medium">Expires {expiry}</p>
        </div>
      </div>
      <button onClick={onDelete} className="p-2 text-grey-medium hover:text-red-400 hover:bg-dark-lighter rounded-lg transition-colors">
        <TrashIcon className="w-4 h-4" />
      </button>
    </Card>;
}