"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { CheckoutForm } from "./checkout-form";
import { useCounter } from "@/hooks/use-counter";
import { formatPrice } from "@/lib/utils/format";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { price, colorConfig } = useCounter();
  const [lockedPrice, setLockedPrice] = useState<number | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Lock the price when modal opens
  useEffect(() => {
    if (isOpen && lockedPrice === null) {
      setLockedPrice(price);
    }
    if (!isOpen) {
      setLockedPrice(null);
      setIsRedirecting(false);
    }
  }, [isOpen, price, lockedPrice]);

  const handleSuccess = (checkoutUrl: string) => {
    setIsRedirecting(true);
    // Redirect to Stripe Checkout
    window.location.href = checkoutUrl;
  };

  const handleCancel = () => {
    onClose();
  };

  const displayPrice = lockedPrice ?? price;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lock Your Price">
      {isRedirecting ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4" />
          <p className="text-white/70 font-mono">Redirecting to payment...</p>
        </div>
      ) : (
        <>
          {/* Current price display */}
          <div className="mb-6 text-center">
            <p className="text-white/50 font-mono text-sm mb-1">
              {lockedPrice ? "Price locked at" : "Current price"}
            </p>
            <p
              className="text-4xl font-mono font-bold"
              style={{ color: colorConfig.hex }}
            >
              {formatPrice(displayPrice)}
            </p>
            {!lockedPrice && (
              <p className="text-white/30 font-mono text-xs mt-1">
                (still going up while you fill the form)
              </p>
            )}
          </div>

          <CheckoutForm
            currentPrice={displayPrice}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </>
      )}
    </Modal>
  );
}
