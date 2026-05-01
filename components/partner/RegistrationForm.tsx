import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Card } from '../shared/Card';
import { CheckCircleIcon, UploadIcon } from 'lucide-react';
const vehicleTypes = [{
  value: 'stretch',
  label: 'Stretch Limousine'
}, {
  value: 'suv',
  label: 'Luxury SUV'
}, {
  value: 'party-bus',
  label: 'Party Bus'
}, {
  value: 'sedan',
  label: 'Luxury Sedan'
}, {
  value: 'vintage',
  label: 'Vintage/Classic Car'
}];
const cityOptions = [{
  value: 'dc',
  label: 'Washington D.C.'
}, {
  value: 'bethesda',
  label: 'Bethesda, MD'
}, {
  value: 'arlington',
  label: 'Arlington, VA'
}, {
  value: 'alexandria',
  label: 'Alexandria, VA'
}, {
  value: 'silver-spring',
  label: 'Silver Spring, MD'
}, {
  value: 'rockville',
  label: 'Rockville, MD'
}];
export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Details
    name: '',
    email: '',
    phone: '',
    company: '',
    // Vehicle Details
    vehicleType: '',
    make: '',
    model: '',
    year: '',
    seats: '',
    city: '',
    description: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      console.log('Partner Registration:', formData);
      setIsSubmitted(true);
    }
  };
  if (isSubmitted) {
    return <Card className="max-w-2xl mx-auto text-center py-12">
      <motion.div initial={{
        scale: 0
      }} animate={{
        scale: 1
      }} transition={{
        type: 'spring',
        duration: 0.5
      }}>
        <CheckCircleIcon className="w-24 h-24 text-primary mx-auto mb-6" />
      </motion.div>
      <h3 className="text-3xl font-bold text-grey-pastel mb-4">
        Application Submitted!
      </h3>
      <p className="text-grey-medium mb-8 max-w-md mx-auto">
        Thank you for your interest in partnering with Luxeridex. Our team
        will review your application and contact you within 2-3 business days.
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/'}>
        Return to Home
      </Button>
    </Card>;
  }
  return <Card className="max-w-2xl mx-auto">
    {/* Progress Indicator */}
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-semibold
            ${step >= 1 ? 'bg-primary text-black' : 'bg-dark-lighter text-grey-medium'}
          `}>
          1
        </div>
        <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-dark-lighter'}`} />
        <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-semibold
            ${step >= 2 ? 'bg-primary text-black' : 'bg-dark-lighter text-grey-medium'}
          `}>
          2
        </div>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 ? <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-grey-pastel mb-2">
            Basic Information
          </h3>
          <p className="text-grey-medium">Tell us about yourself</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="John Doe" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} required />
          <Input label="Email Address" type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Phone Number" type="tel" placeholder="(202) 555-1234" value={formData.phone} onChange={e => setFormData({
            ...formData,
            phone: e.target.value
          })} required />
          <Input label="Company Name (Optional)" placeholder="Your company name" value={formData.company} onChange={e => setFormData({
            ...formData,
            company: e.target.value
          })} />
        </div>

        <Button type="submit" variant="primary" fullWidth size="lg">
          Continue to Vehicle Details
        </Button>
      </motion.div> : <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-grey-pastel mb-2">
            Vehicle Details
          </h3>
          <p className="text-grey-medium">Tell us about your vehicle</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Vehicle Type" as="select" options={vehicleTypes} value={formData.vehicleType} onChange={e => setFormData({
            ...formData,
            vehicleType: e.target.value
          })} placeholder="Select type" required />
          <Input label="Year" type="number" placeholder="2023" value={formData.year} onChange={e => setFormData({
            ...formData,
            year: e.target.value
          })} required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Make" placeholder="Lincoln, Mercedes, etc." value={formData.make} onChange={e => setFormData({
            ...formData,
            make: e.target.value
          })} required />
          <Input label="Model" placeholder="Continental, Sprinter, etc." value={formData.model} onChange={e => setFormData({
            ...formData,
            model: e.target.value
          })} required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Number of Seats" type="number" placeholder="8" value={formData.seats} onChange={e => setFormData({
            ...formData,
            seats: e.target.value
          })} required />
          <Input label="Pickup City" as="select" options={cityOptions} value={formData.city} onChange={e => setFormData({
            ...formData,
            city: e.target.value
          })} placeholder="Select city" required />
        </div>

        <Input label="Vehicle Description" as="textarea" placeholder="Describe your vehicle, its features, and amenities..." value={formData.description} onChange={e => setFormData({
          ...formData,
          description: e.target.value
        })} rows={3} required />

        {/* Image Upload Placeholder */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-grey-pastel">
            Vehicle Images
          </label>
          <div className="border-2 border-dashed border-grey-muted rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <UploadIcon className="w-10 h-10 text-grey-medium mx-auto mb-3" />
            <p className="text-grey-medium text-sm">
              Click to upload or drag and drop
            </p>
            <p className="text-grey-muted text-xs mt-1">
              PNG, JPG up to 10MB (Max 5 images)
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="secondary" fullWidth size="lg" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button type="submit" variant="primary" fullWidth size="lg">
            Submit Application
          </Button>
        </div>
      </motion.div>}
    </form>
  </Card>;
}