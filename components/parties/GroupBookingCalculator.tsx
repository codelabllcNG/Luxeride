import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Input } from '../shared/Input';
import { UsersIcon, CalculatorIcon } from 'lucide-react';
export function GroupBookingCalculator() {
  const [guests, setGuests] = useState(15);
  const [hours, setHours] = useState(4);
  const [rate, setRate] = useState(200); // hourly rate
  const total = guests * 0 + hours * rate; // simplified logic
  const perPerson = total / (guests || 1);
  return <Card className="bg-dark-charcoal border-primary/30">
      <div className="flex items-center space-x-2 mb-6">
        <CalculatorIcon className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-grey-pastel">
          Split Cost Calculator
        </h3>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-grey-pastel mb-2">
            Group Size
          </label>
          <div className="relative">
            <UsersIcon className="absolute left-3 top-3.5 w-5 h-5 text-grey-medium" />
            <input type="range" min="5" max="50" value={guests} onChange={e => setGuests(parseInt(e.target.value))} className="w-full h-2 bg-dark-lighter rounded-lg appearance-none cursor-pointer accent-primary mb-2" />
            <div className="flex justify-between text-xs text-grey-medium">
              <span>5</span>
              <span className="font-bold text-primary text-lg">
                {guests} people
              </span>
              <span>50</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Hours" type="number" value={hours.toString()} onChange={e => setHours(parseInt(e.target.value) || 0)} />
          <Input label="Hourly Rate ($)" type="number" value={rate.toString()} onChange={e => setRate(parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <div className="bg-dark-lighter rounded-xl p-4 text-center">
        <div className="text-sm text-grey-medium mb-1">
          Estimated Cost Per Person
        </div>
        <div className="text-3xl font-bold text-primary">
          ${perPerson.toFixed(2)}
        </div>
        <div className="text-xs text-grey-muted mt-2">Total: ${total}</div>
      </div>
    </Card>;
}