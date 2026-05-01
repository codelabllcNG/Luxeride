import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { submitContactForm, ContactFormPayload } from '../../lib/api/contact'; 

export function MovingQuoteForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = {
    moveDate: '',
    moveSize: '',
    movingFrom: '',
    movingTo: '',
    specialItem: '',
    packingService: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formattedMessage = `Move date: ${formData.moveDate}
Move size: ${formData.moveSize}
Moving from: ${formData.movingFrom}
Moving to: ${formData.movingTo}
Special item: ${formData.specialItem}
Parcking service: ${formData.packingService}`;

    const payload: ContactFormPayload = {
      name: `${formData.firstName} ${formData.lastName}`,
      fullname: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      subject: "Get moving quote",
      inquiry_type: "Moving Quote",
      message: formattedMessage
    };

    const response = await submitContactForm(payload);

    if (response.status === 'success') {
      alert("The form has been submitted");
      setFormData(initialFormState); 
      setStep(1);                    
    } else {
      alert(response.message);
    }
    
    setIsSubmitting(false);
  };

  return <Card className="bg-dark-charcoal border-primary/30">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-grey-pastel">
          Get a Free Moving Quote
        </h3>
        <p className="text-sm text-grey-medium">
          Fill out the form to receive an estimate
        </p>
      </div>

      <div className="flex items-center mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-black' : 'bg-dark-lighter text-grey-medium'}`}>
          1
        </div>
        <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-dark-lighter'}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-black' : 'bg-dark-lighter text-grey-medium'}`}>
          2
        </div>
        <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-dark-lighter'}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-primary text-black' : 'bg-dark-lighter text-grey-medium'}`}>
          3
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {step === 1 && <>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Move Date" 
                type="date" 
                value={formData.moveDate}
                onChange={(e: any) => handleChange('moveDate', e.target.value)}
              />
              <Input 
                label="Move Size" 
                placeholder='e.g. 120' 
                value={formData.moveSize}
                onChange={(e: any) => handleChange('moveSize', e.target.value)}
              />
            </div>
            <Input 
              label="Moving From (Zip Code)" 
              placeholder="e.g. 20001" 
              value={formData.movingFrom}
              onChange={(e: any) => handleChange('movingFrom', e.target.value)}
            />
            <Input 
              label="Moving To (Zip Code)" 
              placeholder="e.g. 22202" 
              value={formData.movingTo}
              onChange={(e: any) => handleChange('movingTo', e.target.value)}
            />
            <Button variant="primary" fullWidth onClick={() => setStep(2)}>
              Next: Inventory
            </Button>
          </>}

        {step === 2 && <>
            <div className="space-y-2">
            <Input 
              label="Special Item?" 
              placeholder='e.g. Piano, safe, fragile items'
              value={formData.specialItem}
              onChange={(e: any) => handleChange('specialItem', e.target.value)}
            />
            </div>
            <Input 
              label="Packing Services Needed?" 
              placeholder='e.g. Full packing, fragile items only'
              value={formData.packingService}
              onChange={(e: any) => handleChange('packingService', e.target.value)}
            />
            <div className="flex space-x-4">
              <Button variant="secondary" fullWidth onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" fullWidth onClick={() => setStep(3)}>
                Next: Contact
              </Button>
            </div>
          </>}

        {step === 3 && <>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="First Name" 
                placeholder="John" 
                value={formData.firstName}
                onChange={(e: any) => handleChange('firstName', e.target.value)}
              />
              <Input 
                label="Last Name" 
                placeholder="Doe" 
                value={formData.lastName}
                onChange={(e: any) => handleChange('lastName', e.target.value)}
              />
            </div>
            <Input 
              label="Email" 
              type="email" 
              placeholder="john@example.com" 
              value={formData.email}
              onChange={(e: any) => handleChange('email', e.target.value)}
            />
            <Input 
              label="Phone" 
              type="tel" 
              placeholder="(555) 123-4567" 
              value={formData.phone}
              onChange={(e: any) => handleChange('phone', e.target.value)}
            />
            <div className="flex space-x-4">
              <Button variant="secondary" fullWidth onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Get Quote'}
              </Button>
            </div>
          </>}
      </form>
    </Card>;
}