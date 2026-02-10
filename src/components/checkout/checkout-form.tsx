"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";
import { calculateDepositAmount } from "@/lib/utils/deposit";
import type { CheckoutRequest, CheckoutResponse } from "@/types/shared";

interface CheckoutFormProps {
  currentPrice: number;
  onSuccess: (checkoutUrl: string) => void;
  onCancel: () => void;
}

export function CheckoutForm({ currentPrice, onSuccess, onCancel }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    projectDescription: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const depositAmount = calculateDepositAmount(currentPrice);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.customerName.length < 2) {
      newErrors.customerName = "Name must be at least 2 characters";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email";
    }

    if (formData.projectDescription.length < 10) {
      newErrors.projectDescription = "Please describe your project (min 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const payload: CheckoutRequest = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || undefined,
        projectDescription: formData.projectDescription,
        lockedPrice: currentPrice,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      const checkoutData = data as CheckoutResponse;
      onSuccess(checkoutData.checkoutUrl);
    } catch {
      setApiError("Failed to connect to server");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Price Summary */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/50 font-mono text-sm">Locked Price</span>
          <span className="text-white font-mono font-bold text-lg">
            {formatPrice(currentPrice)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/50 font-mono text-sm">Deposit (5%)</span>
          <span className="text-price-low font-mono font-bold">
            {formatPrice(depositAmount)}
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <Input
        label="Your Name"
        placeholder="John Doe"
        value={formData.customerName}
        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        error={errors.customerName}
        disabled={isLoading}
      />

      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        value={formData.customerEmail}
        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
        error={errors.customerEmail}
        disabled={isLoading}
      />

      <Input
        label="Phone (optional)"
        type="tel"
        placeholder="+1 234 567 8900"
        value={formData.customerPhone}
        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
        disabled={isLoading}
      />

      <Textarea
        label="Describe Your Project"
        placeholder="Tell me what you want to build. The more detail, the better..."
        rows={4}
        value={formData.projectDescription}
        onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
        error={errors.projectDescription}
        disabled={isLoading}
      />

      {/* API Error */}
      {apiError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 font-mono text-sm">{apiError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Processing..." : `Pay ${formatPrice(depositAmount)}`}
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-white/30 text-center font-mono">
        Deposit is non-refundable. We&apos;ll contact you within 24h to discuss your project.
      </p>
    </form>
  );
}
