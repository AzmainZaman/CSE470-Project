"use client";

import Payment from "@/components/Payment";
import { useTheme } from "../hooks/useTheme";

export default function PaymentPage() {
  const theme = useTheme();
  return (
    <Payment/>
  );
}
