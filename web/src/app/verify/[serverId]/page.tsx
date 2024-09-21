"use client";
import { useAccount } from "wagmi";
import { redirect, useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { useReadContract } from 'wagmi'
import { abi } from "@/abi/zeekay_warden";
import MainLayout from "@/components/layouts/MainLayout";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { contractAddresses } from "@/components/contracts";

interface QueryData {
  serverId : string;
  userId : string | null;
  userName : string;
}

export default function Home() {
  const isLoggedIn = useIsLoggedIn();
  const { network } = useDynamicContext();
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const params = useParams<{ serverId: string }>();

  const [queryData, setQueryData] = useState<QueryData | null>(null);
  const [isLoading, setLoading] = useState(true);
  
  ///  TODO: Call getServerRoles contract and verify if the server is true
  // const { data, isPending, error } = useReadContract({
  //   abi,
  //   address: `0x${contractAddresses[network]}`,
  //   functionName: 'getUserRoles',
  //   args: [params.serverId]
  // })



  useEffect(() => {
    console.log(network)

    let data: QueryData = {
      serverId: params.serverId,
      userId: searchParams.get("userId"),
      userName: searchParams.get("userName") ?? "Unknown",
    }
    
    if (data.userId === null || data.serverId === null) {
      redirect("/error/invalid-verify-url");
    } 

    setQueryData(data);

  }, []);


  useEffect(() => {
    console.log(network)

    let data: QueryData = {
      serverId: params.serverId,
      userId: searchParams.get("userId"),
      userName: searchParams.get("userName") ?? "Unknown",
    }
    
    if (data.userId === null || data.serverId === null) {
      redirect("/error/invalid-verify-url");
    } 

    setQueryData(data);

  }, [network]);

  return (
    <MainLayout>
      <div className="text-center text-2xl">
        {isLoading ? 
          <div>Loading...</div>
        :
            isLoggedIn ? 
              <div>{`Hello World, ${address}`}</div> 
            : 
            <div>{`Hello ${queryData?.userName}`}! Connect your wallet to get started</div>
        }
      </div>
    </MainLayout>
  );
}
