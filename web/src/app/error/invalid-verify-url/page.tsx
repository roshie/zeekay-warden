"use client";
import { useAccount } from "wagmi";
import MainLayout from "@/components/layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="text-center text-2xl">
        <div>Uh Oh! Seems the Verification URL is invalid. </div>
      </div>
    </MainLayout>
  );
}
