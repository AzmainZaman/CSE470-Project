"use client";
import {
  createBook2,
  getAllBooks2,
  callUpdateBook,
  callDeleteBook,
  callChangeBookPhoto,
} from "@/app/actions";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function User() {
  const router = useRouter();
  const { auth, setAuth, book, setBook } = useAuth();
  useEffect(() => {
    if (!auth) {
      router.push("/login"); // Redirects to login if not authenticated
      return;
    }
  });

  return <div className="">{book.title}</div>;
}
