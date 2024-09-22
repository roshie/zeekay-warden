import * as React from "react"
import { ethers } from 'ethers';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "../ui/table"
import { Checkbox } from "../ui/checkbox"
import { useAccount, useChainId } from "wagmi"
import axios from "axios"
import { contractAddresses, rpcURLs } from "../contracts";


interface FormProps {
    communitySlug: string | undefined;
    roles: string[][];
}


export function VerifyForm({communitySlug, roles: abcc}: FormProps) {
    const [checked, setChecked] = React.useState<any>({});
    const { address } = useAccount()
    const chainId = useChainId();


    const roles = [
        ["Role1", "NFT", "hoomanpunks"],
        ["Role2", "ERC20", "AMB/0xf4fb9bf10e489ea3edb03e094939341399587b0c/10"],
        ["Role2", "MEMBER", "24-30"],
    ]


    const validateAndGenerateProof = async (e: any) => {

        const wallet_hash = 7732173;
        let token_owners:any = []
        let num_roles = 0;

        for (const checkedRole of checked) {
            if (checked[checkedRole]) {
              num_roles++;
              for (const role of roles) {
                if (role[0] === checkedRole) {
                  const tokenType = role[1];
                  if (tokenType === "NFT") {
                      const collectionSlug = role[2];
                      if (await isOwner(address?.toString(), collectionSlug)) {
                        token_owners.add(wallet_hash)
                      }
                      break;
                      
                  } else if (tokenType === "ERC20") {
                      const [symbol, _address, quantity] = role[2].split("/");
                      const provider = new ethers.JsonRpcProvider(rpcURLs[chainId]);
                      const contractABI = [
                      {
                        "constant": true,
                        "inputs": [{ "name": "token_address", "type": "address" }],
                        "name": "getTokenBalance",
                        "outputs": [{ "name": "", "type": "uint256" }],
                        "stateMutability": "view",
                        "type": "function"
                        }
                      ];
        
                      const contractAddress = contractAddresses[chainId];
                      const contract = new ethers.Contract(contractAddress, contractABI, provider);

                      const balance = await contract.getTokenBalance(_address);
                      if (balance >= quantity) {
                        token_owners.add(wallet_hash)
                      }
                      break;
                  } else if (tokenType === "MEMBER") {
                        token_owners.add(wallet_hash)
                      break;
                  }
                }
              }
            }
          }


        const response = await axios.post("/api/proof", {
             wallet_hash, token_owners, num_roles
        })
        console.log(response)


    }

    const isOwner = async (address: string|undefined, collectionSlug: string) => {

        let chain = ""
        try {
          const response = await fetch(`https://api.opensea.io/api/v2/collections/${collectionSlug}`, {
              method: 'GET',
              headers: {
                  'accept': 'application/json',
                  'x-api-key': `${process.env.OPENSEA_API_KEY}`,
              }
          });
      
            if (response.ok) {
                const data = await response.json();
                chain = data["contracts"][0]["chain"]
            } else {
                throw new Error('Failed to fetch NFT data');
            }
        } catch (error) {
          console.error(error);
      }
      
      
        try {
            const response = await fetch(`https://api.opensea.io/api/v2/chain/${chain}/account/$${address}/nfts?collection=${collectionSlug}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'x-api-key': `${process.env.OPENSEA_API_KEY}`,
                }
            });
      
            if (response.ok) {
                const data = await response.json();
                if (data["nfts"].length > 0) {    
                    return true
                }
            } else {
                throw new Error('Failed to fetch NFT data');
            }
        } catch (error) {
          console.error(error);
        }
        return false;
      };

  return (
    <Card className="w-[650px]">
      <CardHeader>
        <CardTitle className="text-center">Verify your account</CardTitle>
        <CardDescription className="my-2 text-center">By generating proofs and verifying your account, you will be able to use the {communitySlug} server.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
            <div className="grid w-full items-start gap-4">
            <Table>
                <TableBody>
                    {roles.map((role) => {
                        const tokenType = role[1];
                        let message = <></>;
                        if (tokenType === "NFT") {
                            const collectionSlug = role[2]
                            message = <p> Do you hold an NFT in {collectionSlug} Collection?</p>
                            
                        } else if (tokenType === "ERC20") {
                            const [symbol, address, quantity] = role[2].split("/");
                            message = <p>Do you hold a minimum of {quantity} {symbol} in your wallet?</p>

                        } else if (tokenType === "MEMBER") {
                            message = <p>Do you hold a Membership token issued by {communitySlug}The Hoomans? </p>
                        }

                        const roleId = role[0];
                        return (<TableRow key={roleId}>
                                    <TableCell className="font-medium">{message}</TableCell>
                                    <TableCell><Checkbox id={roleId} onCheckedChange={(chk) => setChecked({ ...checked, [roleId]: chk })} /></TableCell>
                                </TableRow>)
                        })}
                </TableBody>
            </Table>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={validateAndGenerateProof}>Generate zKProof</Button>
      </CardFooter>
    </Card>
  )
}
