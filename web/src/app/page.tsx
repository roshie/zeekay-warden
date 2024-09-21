"use client";
import { useAccount } from "wagmi";
import MainLayout from "@/components/layouts/MainLayout";
import { useState } from "react";

export default function Home() {
  const { address } = useAccount();

  const [isLoaded, setLoaded] = useState(false);
  
  return (
    <MainLayout>
      <div className="text-center text-2xl">
        {address ? <div>{`Hello World, ${address}`}</div> : <div>Connect your wallet to get started</div>}
      </div>
    </MainLayout>
  );
}
