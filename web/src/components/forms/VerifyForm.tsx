import * as React from "react"

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


interface FormProps {
    communitySlug: string | undefined;
    roles: string[][];
}


export function VerifyForm({communitySlug, roles: abc}: FormProps) {
    const [checked, setChecked] = React.useState<any>({});

    const roles = [
        ["Role1", "NFT", "base/0xbe3c7abab76f0a1de602fdb2f44faf604a5f649f"],
        ["Role2", "ERC20", "AMB/20"],
        ["Role3", "MEMBER", "22-50"]
    ]
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
                            const [chain, collectionAddress] = role[2].split("/");
                            const opensea_url = `https://opensea.io/assets/${chain}/${collectionAddress}`;
                            message = <p> Do you hold an NFT in this <a href={opensea_url} style={{textDecoration: "underline"}}>Collection</a>?</p>
                            
                        } else if (tokenType === "ERC20") {
                            const [symbol, quantity] = role[2].split("/");
                            message = <p>Do you hold a minimum of {quantity} {symbol} in your wallet?</p>

                        } else if (tokenType === "MEMBER") {
                            message = <p>Do you hold a Membership token issued by {communitySlug} </p>
                        }

                        const roleId = role[0];
                        return (<TableRow key={roleId}>
                                    <TableCell className="font-medium">{message}</TableCell>
                                    <TableCell><Checkbox id={roleId} onCheckedChange={(chk) => setChecked({ ...checked, [roleId]: chk })} /></TableCell>
                                </TableRow>)
                        })}
                </TableBody>
            </Table>

            {/* <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Generate zKProof</Button>
      </CardFooter>
    </Card>
  )
}
