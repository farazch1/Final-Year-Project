"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page
    router.push("/dashboard");
  }, []);

  return null; // Since it's redirecting, no content is needed
}
