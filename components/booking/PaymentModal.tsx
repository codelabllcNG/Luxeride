import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Shield, Loader2, CreditCard, Lock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { createPaymentIntent, verifyPayment, confirmTrip, getSavedCards } from '@/lib/api/payments';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

interface CheckoutFormProps {
  tripId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ tripId, amount, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | 'new'>('new');
  const [saveCard, setSaveCard] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoadingCards(true);
      const res = await getSavedCards();
      if (res.status === 'success' && res.data.length > 0) {
        setSavedCards(res.data);
        setSelectedCardId(res.data[0].id);
      }
      setIsLoadingCards(false);
    };
    fetchCards();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || (selectedCardId === 'new' && !elements)) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create/Initialize Payment Intent
      const intentRes = await createPaymentIntent(
        tripId.toString(), 
        selectedCardId === 'new' ? saveCard : false,
        selectedCardId !== 'new' ? selectedCardId : undefined
      );

      if (intentRes.status !== 'success') throw new Error(intentRes.message);

      let paymentIntent;

      if (selectedCardId === 'new') {
        // Flow B: Confirm with New Card
        const cardElement = elements!.getElement(CardElement);
        if (!cardElement) throw new Error("Card element not found");

        const result = await stripe.confirmCardPayment(intentRes.client_secret, {
          payment_method: { card: cardElement },
        });
        
        if (result.error) throw new Error(result.error.message);
        paymentIntent = result.paymentIntent;
      } else {
        // Flow A: One-Click (might require SCA)
        if (intentRes.client_secret) {
          // SCA Required
          const result = await stripe.confirmCardPayment(intentRes.client_secret);
          if (result.error) throw new Error(result.error.message);
          paymentIntent = result.paymentIntent;
        } else {
          // Success directly (Authorized)
          paymentIntent = { id: intentRes.payment_intent_id, status: 'requires_capture' };
        }
      }

      if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture')) {
        // 3. Verify and Confirm
        const verifyRes = await verifyPayment(paymentIntent.id, tripId.toString());
        if (verifyRes.status !== 'success') throw new Error(verifyRes.message);

        const confirmRes = await confirmTrip(tripId.toString());
        if (confirmRes.status !== 'success') throw new Error(confirmRes.message);

        toast.success("Payment successful!");
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Saved Cards Selection */}
      {!isLoadingCards && savedCards.length > 0 && (
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-grey-dark uppercase tracking-widest">
            Select Payment Method
          </label>
          <div className="grid gap-2">
            {savedCards.map((card) => (
              <div 
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedCardId === card.id 
                    ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${selectedCardId === card.id ? 'bg-primary/20' : 'bg-dark-lighter'}`}>
                    <CreditCard className={`w-4 h-4 ${selectedCardId === card.id ? 'text-primary' : 'text-grey-dark'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-grey-pastel uppercase">
                      {card.brand} •••• {card.last4}
                    </p>
                    <p className="text-[10px] text-grey-medium">Expires {card.exp_month}/{card.exp_year}</p>
                  </div>
                </div>
                {selectedCardId === card.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
            ))}
            <div 
              onClick={() => setSelectedCardId('new')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedCardId === 'new' 
                  ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${selectedCardId === 'new' ? 'bg-primary/20' : 'bg-dark-lighter'}`}>
                  <Plus className={`w-4 h-4 ${selectedCardId === 'new' ? 'text-primary' : 'text-grey-dark'}`} />
                </div>
                <p className="text-xs font-bold text-grey-pastel uppercase">Use a New Card</p>
              </div>
              {selectedCardId === 'new' && <CheckCircle2 className="w-4 h-4 text-primary" />}
            </div>
          </div>
        </div>
      )}

      {/* New Card Input */}
      <AnimatePresence>
        {selectedCardId === 'new' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <label className="text-[10px] font-bold text-grey-dark uppercase tracking-widest mb-3 block">
                Card Details
              </label>
              <div className="p-4 bg-dark-lighter rounded-lg border border-white/5">
                <CardElement 
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#F5F5F5',
                        '::placeholder': { color: '#666666' },
                      },
                      invalid: { color: '#ef4444' },
                    },
                  }}
                />
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="save-card" 
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20"
                />
                <label htmlFor="save-card" className="text-xs text-grey-medium cursor-pointer">
                  Save this card for future bookings
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
        <div>
          <p className="text-[10px] uppercase font-bold text-grey-dark">Total Amount</p>
          <p className="text-xl font-bold text-primary">${amount}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-grey-dark flex items-center justify-end">
            <Lock className="w-3 h-3 mr-1" /> SSL Secure
          </p>
          <p className="text-[10px] text-grey-medium">Powered by Stripe</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="ghost" 
          className="flex-1" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-primary text-black hover:bg-primary/90" 
          disabled={!stripe || isProcessing || (selectedCardId === 'new' && isLoadingCards)}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              {selectedCardId === 'new' ? 'Pay Now' : 'Confirm Payment'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Add Plus icon import to Lucide
import { Plus } from 'lucide-react';

export function PaymentModal({ 
  isOpen, 
  onClose, 
  tripId, 
  amount, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  tripId: string; 
  amount: number;
  onSuccess: () => void;
}) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Secure Checkout"
    >
      <div className="p-1">
        <div className="flex items-center space-x-3 mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-grey-pastel">Complete your Payment</h3>
            <p className="text-xs text-grey-medium">Safe & encrypted transaction</p>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm 
            tripId={tripId} 
            amount={amount} 
            onSuccess={onSuccess} 
            onCancel={onClose}
          />
        </Elements>
      </div>
    </Modal>
  );
}
