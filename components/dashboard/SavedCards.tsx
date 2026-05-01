"use client";

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { getSetupIntent, getSavedCards, deleteSavedCard } from '@/lib/api/payments';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { 
  CreditCard, 
  Trash2, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
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

export function SavedCards() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const res = await getSavedCards();
      if (res.status === 'success') {
        setCards(res.data);
      }
    } catch (error) {
      toast.error("Failed to load saved cards");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this card?")) return;
    
    try {
      const res = await deleteSavedCard(id);
      if (res.status === 'success') {
        toast.success("Card removed successfully");
        setCards(cards.filter(c => c.id !== id));
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to delete card");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Payment <span className="text-primary">Methods</span></h2>
          <p className="text-sm text-grey-medium mt-1">Manage your saved cards for one-click bookings.</p>
        </div>
        <Button 
          variant={isAddingNew ? "ghost" : "primary"}
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex items-center gap-2"
        >
          {isAddingNew ? "Cancel" : <><Plus className="w-4 h-4" /> Add Card</>}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isAddingNew ? (
          <motion.div
            key="add-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Elements stripe={stripePromise}>
              <AddCardForm 
                onSuccess={() => {
                  setIsAddingNew(false);
                  fetchCards();
                }} 
              />
            </Elements>
          </motion.div>
        ) : (
          <motion.div
            key="card-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {isLoading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-grey-medium animate-pulse">Loading your cards...</p>
              </div>
            ) : cards.length > 0 ? (
              cards.map((card) => (
                <Card 
                  key={card.id} 
                  className="bg-white/5 border-white/10 hover:border-primary/30 transition-all group overflow-hidden"
                >
                  <div className="p-6 relative">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDelete(card.id)}
                        className="p-2 text-grey-medium hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-grey-dark tracking-widest">Brand</p>
                        <p className="text-white font-bold uppercase">{card.brand}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-grey-dark tracking-widest mb-1">Card Number</p>
                        <p className="text-xl font-mono text-white tracking-wider">
                          •••• •••• •••• <span className="text-primary">{card.last4}</span>
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-grey-dark tracking-widest mb-1">Expiry</p>
                          <p className="text-sm text-grey-pastel">{card.exp_month.toString().padStart(2, '0')}/{card.exp_year}</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                          <ShieldCheck className="w-3 h-3 text-green-500" />
                          <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-16 bg-white/5 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-grey-dark" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">No cards saved</h3>
                <p className="text-grey-medium text-sm max-w-xs mb-6">
                  Save a card to your profile for faster, one-click bookings in the future.
                </p>
                <Button onClick={() => setIsAddingNew(true)} variant="outline" size="sm">
                  Add Your First Card
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddCardForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const res = await getSetupIntent();
      if (res.status !== 'success') throw new Error(res.message);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card input not found");

      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
        res.client_secret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (setupIntent.status === 'succeeded') {
        toast.success("Card added securely!");
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Failed to add card");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <Card className="bg-dark-charcoal border-white/10 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-white font-bold">Secure Card Collection</h3>
              <p className="text-xs text-grey-medium">Your data is encrypted and handled by Stripe.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 focus-within:border-primary/50 transition-colors">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#FFFFFF',
                      fontFamily: 'Inter, sans-serif',
                      '::placeholder': { color: '#666666' },
                    },
                    invalid: { color: '#EF4444' },
                  },
                }}
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isProcessing}
              isLoading={isProcessing}
            >
              Securely Save Card
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 opacity-40 grayscale pointer-events-none">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Stripe" className="h-4" />
          </div>
        </div>
      </Card>
    </form>
  );
}
