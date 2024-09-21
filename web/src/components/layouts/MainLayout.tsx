"use client";

import { DynamicWidget, useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import { useEffect } from "react";
import { useAccount } from "wagmi";



export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {  

    const { setShowAuthFlow, sdkHasLoaded } = useDynamicContext();
    const isLoggedIn = useIsLoggedIn();
    const account = useAccount()

    return <main className="container flex min-h-screen flex-col items-center justify-center p-10">
        <div className="absolute top-5 right-12 mr-5">
            <DynamicWidget variant="modal" innerButtonComponent={<button>Connect Wallet</button>} />
        </div>
        <div className="absolute top-5 right-5">
            <ModeToggle />
        </div>
        {/* <div className="absolute top-5 left-5 flex flex-row items-center bg-zinc-900 rounded-md p-2">
            <Image
                className="relative rounded-md"
                src="/logo.gif"
                alt="Logo"
                width={80}
                height={80}
                priority
            />
            <div className="px-5 mb-1">
                <div className="text-3xl font-bold">some app</div>
                <div className="text-lg ">this app does something</div>
            </div>
        </div> */}

        <section className="lg:max-w-5xl lg:w-full">
            <div className="p-8 w-full">
                <div className="flex justify-center items-start flex-col">
                    <div className="flex justify-center items-center flex-col w-full">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    </main>
}