"use client";

import React from 'react';
import { Modal } from '@/components/shared/Modal';
import { RideFlow } from '@/components/booking/RideFlow';
import { useBookingStore } from '@/lib/store/useBookingStore';

export function GlobalBookingModal() {
  const { isModalOpen, setModalOpen } = useBookingStore();

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      title="Request a Ride"
      size="md"
    >
      <RideFlow />
    </Modal>
  );
}
