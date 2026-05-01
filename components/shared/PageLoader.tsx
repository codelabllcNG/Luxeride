'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export function PageLoader() {
  return (
          <div className="min-h-screen flex items-center justify-center bg-dark text-grey-pastel">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
  );
}