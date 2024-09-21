// /Users/justinbenito/Justin-Benito/Projects/zeekay-warden/web/src/app/user/page.tsx
'use client'
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const UserPage = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [guilds, setGuilds] = useState<any[]>([]);
    const [deployedGuilds, setDeployedGuilds] = useState<any[]>([]);
    const [ownerGuilds, setOwnerGuilds] = useState<any[]>([]);

    const connectWallet = async () => {
        // Simulate wallet connection
        const address = '0x1234567890abcdef'; // Replace with actual wallet connection logic
        setWalletAddress(address);
        toast('Please authenticate Discord');
    };

    const authenticateDiscord = async () => {
        try{
            const client_id = process.env.CLIENT_ID;  // Replace with your Discord client ID
            const client_secret = process.env.CLIENT_SECRET; 
            const redirect_uri = 'http://localhost:3000/api' 
            console.log(client_id)
            window.location.href = `https://discord.com/oauth2/authorize?client_id=1284144283309314048&permissions=268435456&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi&integration_type=0&scope=identify+guilds+bot+guilds.members.read`;
        } catch(error){
            console.error('Error Redirecting to Discord:', error);
        }
        // try {
        //     const response = await axios.get('http://localhost:3002/discord');
        //     setGuilds(response.data.guilds);
        // } catch (error) {
        //     console.error('Error authenticating Discord:', error);
        // }
    };

    const fetchDeployedGuilds = async () => {
        try {
            const response = await axios.get('http://localhost:3002/deployed');
            setDeployedGuilds(response.data.deployedGuilds);
        } catch (error) {
            console.error('Error fetching deployed guilds:', error);
        }
    };

    useEffect(() => {
        if (walletAddress) {
            authenticateDiscord();
            fetchDeployedGuilds();
        }
    }, [walletAddress]);

    const handleManage = async (guildId: string) => {
        try {
            const response = await axios.get(`http://localhost:3002/manage?guildID=${guildId}`);
            // Handle the response to display roles and input fields
        } catch (error) {
            console.error('Error managing guild:', error);
        }
    };

    const handleCreate = (guildId: string) => {
        // Handle create logic
    };

    const renderGuilds = () => {
        const deployedGuildIds = deployedGuilds.map(guild => guild.id);
        const ownerButNotDeployed = ownerGuilds.filter(guild => !deployedGuildIds.includes(guild.id));
        const deployedAndOwner = ownerGuilds.filter(guild => deployedGuildIds.includes(guild.id));

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl font-bold">Deployed and Owner Guilds</h2>
                    {deployedAndOwner.map(guild => (
                        <div key={guild.id} className="p-4 border rounded-lg shadow-md">
                            <h3 className="text-lg">{guild.name}</h3>
                            <button
                                className="mt-2 px-4 py-2 bg-lightgreen text-black rounded"
                                onClick={() => handleManage(guild.id)}
                            >
                                Manage
                            </button>
                        </div>
                    ))}
                </div>
                <div>
                    <h2 className="text-xl font-bold">Owner but not Deployed Guilds</h2>
                    {ownerButNotDeployed.map(guild => (
                        <div key={guild.id} className="p-4 border rounded-lg shadow-md">
                            <h3 className="text-lg">{guild.name}</h3>
                            <button
                                className="mt-2 px-4 py-2 bg-lightgreen text-black rounded"
                                onClick={() => handleCreate(guild.id)}
                            >
                                Create
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white text-black p-8">
            <Toaster />
            <h1 className="text-3xl font-bold">Welcome to Zeekay Warden</h1>
            <h2 className="text-xl mt-2">Connect your wallet and Discord to manage wardens</h2>
            {!walletAddress ? (
                <button
                    className="mt-4 px-6 py-2 bg-lightgreen text-black rounded"
                    onClick={connectWallet}
                >
                    Connect Wallet
                </button>
            ) : (
                <button
                    className="mt-4 px-6 py-2 bg-lightgreen text-black rounded"
                    onClick={authenticateDiscord}
                >
                    Discord Auth
                </button>
            )}
        </div>
    );
};

export default UserPage;