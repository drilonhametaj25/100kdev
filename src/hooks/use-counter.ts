"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculateCurrentPrice, getPriceColor } from "@/lib/counter/calculator";
import { COUNTER_CONFIG, COUNTER_ID } from "@/lib/counter/constants";
import type { CounterStateRow, CounterApiResponse } from "@/types/shared";

interface UseCounterResult {
  price: number;
  formattedPrice: string;
  lastResetAt: string | null;
  lastPurchasePrice: number | null;
  lastPurchaseAt: string | null;
  isDropActive: boolean;
  dropPrice: number | null;
  incrementPerSecond: number;
  isLoading: boolean;
  error: string | null;
  colorConfig: ReturnType<typeof getPriceColor>;
}

export function useCounter(): UseCounterResult {
  // Server state
  const [serverState, setServerState] = useState<{
    lastResetAt: string | null;
    lastPurchasePrice: number | null;
    lastPurchaseAt: string | null;
    isDropActive: boolean;
    dropPrice: number | null;
    incrementPerSecond: number;
  }>({
    lastResetAt: null,
    lastPurchasePrice: null,
    lastPurchaseAt: null,
    isDropActive: false,
    dropPrice: null,
    incrementPerSecond: COUNTER_CONFIG.incrementPerSecond,
  });

  // Interpolated price (updated every frame)
  const [price, setPrice] = useState<number>(COUNTER_CONFIG.startPrice);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for animation
  const animationRef = useRef<number | null>(null);
  const lastResetAtRef = useRef<string | null>(null);
  const incrementRef = useRef<number>(COUNTER_CONFIG.incrementPerSecond);
  const isDropActiveRef = useRef(false);
  const dropPriceRef = useRef<number | null>(null);

  // Fetch initial state from API
  const fetchInitialState = useCallback(async () => {
    try {
      const response = await fetch("/api/counter");
      if (!response.ok) throw new Error("Failed to fetch counter state");

      const data: CounterApiResponse = await response.json();

      setServerState({
        lastResetAt: data.lastResetAt,
        lastPurchasePrice: data.lastPurchasePrice,
        lastPurchaseAt: data.lastPurchaseAt,
        isDropActive: data.isDropActive,
        dropPrice: data.dropPrice,
        incrementPerSecond: data.incrementPerSecond,
      });

      // Update refs
      lastResetAtRef.current = data.lastResetAt;
      incrementRef.current = data.incrementPerSecond;
      isDropActiveRef.current = data.isDropActive;
      dropPriceRef.current = data.dropPrice;

      // Set initial price
      if (data.isDropActive && data.dropPrice !== null) {
        setPrice(data.dropPrice);
      } else {
        setPrice(data.price);
      }

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsLoading(false);
    }
  }, []);

  // Subscribe to Supabase Realtime
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("counter-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "counter_state",
          filter: `id=eq.${COUNTER_ID}`,
        },
        (payload) => {
          const newState = payload.new as CounterStateRow;

          setServerState({
            lastResetAt: newState.last_reset_at,
            lastPurchasePrice: newState.last_purchase_price,
            lastPurchaseAt: newState.last_purchase_at,
            isDropActive: newState.is_drop_active,
            dropPrice: newState.drop_price,
            incrementPerSecond: newState.increment_per_second,
          });

          // Update refs
          lastResetAtRef.current = newState.last_reset_at;
          incrementRef.current = newState.increment_per_second;
          isDropActiveRef.current = newState.is_drop_active;
          dropPriceRef.current = newState.drop_price;

          // If drop is active, set fixed price
          if (newState.is_drop_active && newState.drop_price !== null) {
            setPrice(newState.drop_price);
          }
        }
      )
      .subscribe();

    // Fetch initial state
    fetchInitialState();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchInitialState]);

  // Animation loop for smooth price interpolation
  useEffect(() => {
    const animate = () => {
      // If drop is active, use fixed drop price
      if (isDropActiveRef.current && dropPriceRef.current !== null) {
        setPrice(dropPriceRef.current);
      } else if (lastResetAtRef.current) {
        // Calculate current price based on time
        const currentPrice = calculateCurrentPrice(
          lastResetAtRef.current,
          incrementRef.current
        );
        setPrice(currentPrice);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Format price for display
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  // Get color config based on current price
  const colorConfig = getPriceColor(price);

  return {
    price,
    formattedPrice,
    lastResetAt: serverState.lastResetAt,
    lastPurchasePrice: serverState.lastPurchasePrice,
    lastPurchaseAt: serverState.lastPurchaseAt,
    isDropActive: serverState.isDropActive,
    dropPrice: serverState.dropPrice,
    incrementPerSecond: serverState.incrementPerSecond,
    isLoading,
    error,
    colorConfig,
  };
}
