"use client";
import { useAccount, useChainId } from "wagmi";
import { redirect, useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { useReadContract } from 'wagmi'
import { abi } from "@/abi/zeekay_warden";
import MainLayout from "@/components/layouts/MainLayout";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { contractAddresses } from "@/components/contracts";
import axios from 'axios';
import { VerifyForm } from "@/components/forms/VerifyForm";

interface QueryData {
  guildId : string;
  userName : string;
}

export default function Home() {
  const isLoggedIn = useIsLoggedIn();
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const params = useParams<{ guildId: string }>();
  
  const [queryData, setQueryData] = useState<QueryData | null>(null);
  const [serverRoles, setServerRoles] = useState<string[][]>([]);
  const [communitySlug, setCommunitySlug] = useState<string | undefined>(undefined);

  const [loadedCount, setLoadedCount] = useState(0);
  const [verificationState, setVerificationState] = useState(false);
  
  const chainid = useChainId();

  // step 1: Check if the server exists
  const { data: serverRolesData, isPending: isServerRolesPending, error: serverRolesError } = useReadContract({
    abi,
    address: `0x${contractAddresses[chainid]}`,
    functionName: 'getRolesofServer',
    args: [params.guildId]
  })

  // Step 2: Check whether the user has already been verified for this server
  const { data: userRolesData, isPending: isUserRolesPending, error: userRolesError } = useReadContract({
    abi,
    address: `0x${contractAddresses[chainid]}`,
    functionName: 'getUserRoles',
    args: [params.guildId]
  })


  // Listen to those hooks, and set values to state variables
  useEffect(() => {
      // console.log("getUserRoles", userRolesData, isUserRolesPending, userRolesError)
      if (!isUserRolesPending && userRolesData && !userRolesError) {
        AssignRoles(address?.toString() ?? "", queryData?.userName ?? "", params.guildId);
      }
      setLoadedCount(loadedCount + 1);
  }, [isUserRolesPending])

  useEffect(() => {
    // console.log("getRolesOfServer", serverRolesData, isServerRolesPending, serverRolesError)
    if (!isServerRolesPending && serverRolesData && !serverRolesError) {
      console.log(serverRolesData)
      // const {communitySlug, roles} = serverRolesData
      // setServerRoles(roles)
      // setCommunitySlug(communitySlug)
    }
    setLoadedCount(loadedCount + 1);
}, [isServerRolesPending])


  useEffect(() => {

    let data: QueryData = {
      guildId: params.guildId,
      userName: searchParams.get("userName") ?? "Unknown",
    }
    
    if (data.userName === null || data.guildId === null) {
      redirect("/error/invalid-verify-url");
    } 

    setQueryData(data);

  }, []);


  const AssignRoles = async (address: string, userId: string, guildId: string) => {

    const response = await axios.post("/api/assign-roles", {
      address, userId, guildId  
    })

    if (response.status === 200) {
      setVerificationState(true)
    }
  }

  return (
    <MainLayout>
      <div className=" text-2xl">
        {loadedCount < 2 ? 
          <div>Loading...</div>
        :
            isLoggedIn ? 

              verificationState ? 
                <div> 
                  <h4>Yay! You have been verified</h4>
                  <p>You can now close this window.</p>
                </div> 
                :
                <VerifyForm roles={serverRoles} communitySlug={communitySlug}/>
            : 
            <div className="text-center items-center"><h5>{`Hello ${queryData?.userName}`}!</h5><h2>Connect your wallet to get started</h2>
            <img width="500" src="/intro.gif" alt="Logo" />
            </div>
        }
      </div>
    </MainLayout>
  );
}
