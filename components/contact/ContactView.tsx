'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContactForm } from '@/lib/api/contact';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Card } from '@/components/shared/Card';
import { ContactPageData } from '@/lib/api/contact';
import { 
  PhoneIcon, 
  MailIcon, 
  MapPinIcon, 
  ClockIcon, 
  SendIcon, 
  CheckCircleIcon 
} from 'lucide-react';
const inquiryTypes = [
  { value: 'booking', label: 'Booking Inquiry' },
  { value: 'quote', label: 'Quote Request' },
  { value: 'partnership', label: 'Partnership Inquiry' },
  { value: 'support', label: 'Customer Support' },
  { value: 'other', label: 'Other' }
];

interface ContactViewProps {
  data: ContactPageData;
}

export default function ContactView({ data }: ContactViewProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: ''
  });

  const { hero, contact_section } = data;
  const serviceArea = data["our service area section"][0];

  const contactInfoCards = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: ["(202) 335-1410"],
      action: "tel:2023551410"
    },
    {
      icon: MailIcon,
      title: 'Email',
      details: ["Info@luxridex.com"],
      action: "mailto:Info@luxridex.com"
    },
    {
      icon: MapPinIcon,
      title: 'Service Area',
      details: [contact_section?.service_area?.address || "Washington D.C. Area"]
    },
    {
      icon: ClockIcon,
      title: 'Hours',
      details: [
        contact_section?.hours?.days || "24/7", 
        contact_section?.hours?.time || ""
      ].filter(Boolean)
    }
  ];

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    const payload = {
      name: formData.name.split(' ')[0],
      fullname: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      inquiry_type: formData.inquiryType,
      message: formData.message
    };
    const result = await submitContactForm(payload);

    setIsLoading(false);

    if (result.status === 'success') {
      setIsSubmitted(true);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <main className="min-h-screen bg-dark pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-grey-pastel mb-6">
              {hero?.title || "Get in Touch"}
            </h1>
            <p className="text-xl text-grey-medium">
              {hero?.description || "Contact us for inquiries."}
            </p>
          </motion.div>
        </div>
      </section>

      {/*  INFO CARDS (Dynamic) */}
      <section className="py-12 bg-dark-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfoCards.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-grey-pastel mb-2">
                    {info.title}
                  </h3>
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-grey-medium text-sm">
                      {info.action ? (
                        <a href={info.action} className="hover:text-primary transition-colors">
                          {detail}
                        </a>
                      ) : (
                        detail
                      )}
                    </p>
                  ))}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/*  CONTACT FORM  */}
     <section className="py-24 bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card padding="lg">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <CheckCircleIcon className="w-24 h-24 text-primary mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-grey-pastel mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-grey-medium mb-8 max-w-md mx-auto">
                    Thank you for reaching out. Our team will review your
                    message and get back to you within 24 hours.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '', email: '', phone: '', inquiryType: '', subject: '', message: ''
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-grey-pastel mb-2">
                      Send Us a Message
                    </h2>
                    <p className="text-grey-medium">
                      Fill out the form below and we'll get back to you shortly.
                    </p>
                    {/* Display Error Message if any */}
                    {errorMessage && (
                      <p className="text-red-500 mt-4 bg-red-500/10 p-2 rounded">
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Your Name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="(202) 555-1234"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isLoading}
                      />
                      <Input
                        label="Inquiry Type"
                        as="select"
                        options={inquiryTypes}
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        placeholder="Select type"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <Input
                      label="Subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      disabled={isLoading}
                    />

                    <Input
                      label="Message"
                      as="textarea"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      required
                      disabled={isLoading}
                    />

                    <Button 
                      type="submit" 
                      variant="primary" 
                      fullWidth 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">Sending...</span>
                      ) : (
                        <>
                          <SendIcon className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/*  MAP & SERVICE AREA (Dynamic) */}
      <section className="py-16 bg-dark-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-grey-pastel mb-2">
              {serviceArea?.heading || "Our Service Area"}
            </h2>
            <p className="text-grey-medium whitespace-pre-line">
              {serviceArea?.description}
            </p>
          </motion.div>

          <div className="aspect-21/9 rounded-2xl overflow-hidden bg-dark-lighter border border-dark-lighter">
            <div className="w-full min-h-full flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-grey-pastel font-semibold">
                  Washington D.C. Metropolitan Area
                </p>
                <p className="text-grey-medium text-sm">
                  DC • Maryland • Virginia
                </p>
                {serviceArea?.map && serviceArea.map.length > 0 && (
                  <p className="text-xs text-grey-dark mt-2 mb-8">
                    Lat: {serviceArea.map[0].lat}, Long: {serviceArea.map[0].long}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}