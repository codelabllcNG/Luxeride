import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { Input } from '../shared/Input';
import { CalendarCheckIcon, MessageSquareIcon, PhoneIcon, CheckCircleIcon } from 'lucide-react';
import { useBookingStore } from '@/lib/store/useBookingStore';

type EnquiryButtonsProps = {
  isCompanyOwned: boolean;
  vehicleName: string;
};
export function EnquiryButtons({
  isCompanyOwned,
  vehicleName
}: EnquiryButtonsProps) {
  const { setModalOpen } = useBookingStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'availability' | 'booking' | 'contact'>('availability');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: ''
  });
  const openModal = (type: 'availability' | 'booking' | 'contact') => {
    setModalType(type);
    setIsModalOpen(true);
    setIsSubmitted(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${modalType} request for ${vehicleName}:`, formData);
    setIsSubmitted(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      message: ''
    });
  };
  const getModalTitle = () => {
    switch (modalType) {
      case 'availability':
        return 'Check Availability';
      case 'booking':
        return 'Book Now';
      case 'contact':
        return 'Contact Owner';
    }
  };
  return <>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5,
      delay: 0.3
    }} className="bg-dark-charcoal rounded-xl p-6 border border-dark-lighter space-y-4">
        <h2 className="text-xl font-semibold text-grey-pastel mb-4">
          Ready to Book?
        </h2>

        <Button variant="primary" fullWidth size="lg" onClick={() => openModal('availability')}>
          <CalendarCheckIcon className="w-5 h-5 mr-2" />
          Check Availability
        </Button>

        {isCompanyOwned ? <Button variant="outline" fullWidth size="lg" onClick={() => setModalOpen(true)}>
            <PhoneIcon className="w-5 h-5 mr-2" />
            Book Now
          </Button> : <Button variant="outline" fullWidth size="lg" onClick={() => openModal('contact')}>
            <MessageSquareIcon className="w-5 h-5 mr-2" />
            Contact Owner
          </Button>}

        <p className="text-xs text-grey-medium text-center pt-2">
          {isCompanyOwned ? 'Direct booking with Luxeridex' : 'This is a marketplace listing. You will be connected with the vehicle owner.'}
        </p>
      </motion.div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={getModalTitle()} size="md">
        {isSubmitted ? <div className="text-center py-8">
            <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          type: 'spring',
          duration: 0.5
        }}>
              <CheckCircleIcon className="w-20 h-20 text-primary mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-grey-pastel mb-4">
              Request Sent!
            </h3>
            <p className="text-grey-medium mb-8">
              {isCompanyOwned ? 'Our team will contact you within 24 hours to confirm your booking.' : 'The vehicle owner has been notified and will respond to your inquiry soon.'}
            </p>
            <Button variant="primary" onClick={closeModal}>
              Close
            </Button>
          </div> : <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-grey-medium mb-4">
              {modalType === 'availability' ? `Check if "${vehicleName}" is available for your desired date.` : modalType === 'booking' ? `Complete your booking request for "${vehicleName}".` : `Send a message to the owner of "${vehicleName}".`}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Your Name" placeholder="Full name" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} required />
              <Input label="Email" type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} required />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Phone" type="tel" placeholder="(202) 555-1234" value={formData.phone} onChange={e => setFormData({
            ...formData,
            phone: e.target.value
          })} required />
              <Input label="Preferred Date" type="date" value={formData.date} onChange={e => setFormData({
            ...formData,
            date: e.target.value
          })} required />
            </div>

            <Input label="Message" as="textarea" placeholder="Tell us about your event or any special requirements..." value={formData.message} onChange={e => setFormData({
          ...formData,
          message: e.target.value
        })} rows={3} />

            <Button type="submit" variant="primary" fullWidth size="lg">
              {modalType === 'availability' ? 'Check Availability' : modalType === 'booking' ? 'Submit Booking Request' : 'Send Message'}
            </Button>
          </form>}
      </Modal>
    </>;
}