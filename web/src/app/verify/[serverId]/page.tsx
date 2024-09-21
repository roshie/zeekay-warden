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
  serverId : string;
  userId : string | null;
  userName : string;
}

export default function Home() {
  const isLoggedIn = useIsLoggedIn();
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const params = useParams<{ serverId: string }>();
  
  const [queryData, setQueryData] = useState<QueryData | null>(null);
  const [serverRoles, setServerRoles] = useState<string[]>([]);
  const [wardenSlug, setWardenSlug] = useState<string[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [verificationState, setVerificationState] = useState(false);
  
  const chainid = useChainId();

  // step 1: Check if the server exists
  const { data: serverRolesData, isPending: isServerRolesPending, error: serverRolesError } = useReadContract({
    abi,
    address: `0x${contractAddresses[chainid]}`,
    functionName: 'getRolesofServer',
    args: [params.serverId]
  })

  // Step 2: Check whether the user has already been verified for this server
  const { data: userRolesData, isPending: isUserRolesPending, error: userRolesError } = useReadContract({
    abi,
    address: `0x${contractAddresses[chainid]}`,
    functionName: 'getUserRoles',
    args: [params.serverId]
  })


  // Listen to those hooks, and set values to state variables
  useEffect(() => {
      console.log("getUserRoles", userRolesData, isUserRolesPending, userRolesError)
      if (!isUserRolesPending && userRolesData && !userRolesError) {
        AssignRoles(address?.toString() ?? "", queryData?.userId ?? "", params.serverId);
      }
      setLoadedCount(loadedCount + 1);
  }, [userRolesData, isUserRolesPending, userRolesError])

  useEffect(() => {
    console.log("getRolesOfServer", serverRolesData, isServerRolesPending, serverRolesError)
    if (!isServerRolesPending && serverRolesData && !serverRolesError) {
      // const {WardenSlug, roles} = serverRolesData
      // setServerRoles(roles)
      // setWardenSlug(WardenSlug)
    }
    setLoadedCount(loadedCount + 1);
}, [serverRolesData, isServerRolesPending, serverRolesError])


  useEffect(() => {

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
      <div className="text-center text-2xl">
        {loadedCount !== 2 ? 
          <div>Loading...</div>
        :
            isLoggedIn ? 

              verificationState ? 
                <div> 
                  <h4>Yay! You have been verified</h4>
                  <p>You can now close this window.</p>
                </div> 
                :
              <div>

                <h4>Verify your account</h4>
                <p>By verifying your account, you will be able to use the {wardenSlug} server.</p>
                <VerifyForm roles={serverRoles} wardenSlug={wardenSlug}/>
              </div> 
            : 
            <div>{`Hello ${queryData?.userName}`}! Connect your wallet to get started</div>
        }
      </div>
    </MainLayout>
  );
}
