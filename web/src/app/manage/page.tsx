'use client'
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '.././../../firebaseconfig';

interface Guild {
    guildId: string;
    guildName: string;
    roles: { roleId: string; roleName: string; data?: string; action?: string; imageUrl?: string; borderColor?: string }[];
    showRoles?: boolean;
}

const GuildsComponent: React.FC = () => {
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const documentId = queryParams.get('documentId');

            if (!documentId) {
                setError('No document ID provided in the URL');
                return;
            }

            try {
                const db = getFirestore(app);
                const docRef = doc(db, 'users', documentId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log('Document data:', data);
                    setGuilds(data.data as Guild[]);
                } else {
                    throw new Error('No such document!');
                }
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (guildId: string, roleId: string, value: string, field: string) => {
        const updatedGuilds = guilds.map(guild => {
            if (guild.guildId === guildId) {
                const updatedRoles = guild.roles.map(role => {
                    if (role.roleId === roleId) {
                        return { ...role, [field]: value };
                    }
                    return role;
                });
                return { ...guild, roles: updatedRoles };
            }
            return guild;
        });
        setGuilds(updatedGuilds);

        if (field === 'data' && value && updatedGuilds.find(g => g.guildId === guildId)?.roles.find(r => r.roleId === roleId)?.action === 'check_nft') {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            setTypingTimeout(setTimeout(() => fetchNFTData(guildId, roleId, value), 5000));
        }
    };

    const fetchNFTData = async (guildId: string, roleId: string, collectionSlug: string) => {
        try {
            const response = await fetch(`https://api.opensea.io/api/v2/collections/${collectionSlug}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'x-api-key': '2b75124cf005494e926dcd68ea99f602'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const imageUrl = data.image_url;
                updateRoleData(guildId, roleId, imageUrl, 'green');
                toast.success('It is a real NFT!');
            } else {
                throw new Error('Failed to fetch NFT data');
            }
        } catch (error) {
            updateRoleData(guildId, roleId, '', 'red');
            toast.error('Enter proper NFT collection name');
        }
    };

    const updateRoleData = (guildId: string, roleId: string, imageUrl: string, borderColor: string) => {
        const updatedGuilds = guilds.map(guild => {
            if (guild.guildId === guildId) {
                const updatedRoles = guild.roles.map(role => {
                    if (role.roleId === roleId) {
                        return { ...role, imageUrl, borderColor };
                    }
                    return role;
                });
                return { ...guild, roles: updatedRoles };
            }
            return guild;
        });
        setGuilds(updatedGuilds);
    };

    const handleSubmit = () => {
        const updatedData = guilds.map(guild => ({
            guildName: guild.guildName,
            roles: guild.roles.map(role => ({
                roleName: role.roleName,
                action: role.action || 'check_nft',
                data: role.data || ''
            }))
        }));
        console.log('Updated guild data:', updatedData);
        setButtonClicked(true);
        setTimeout(() => setButtonClicked(false), 200); // Reset color effect after 200ms
    };

    const handleMint = () => {
        console.log('Mint button clicked');
        // Placeholder function for minting
    };

    return (
        <div className="container mx-auto p-4">
            <Toaster />
            <h1 className="text-2xl font-bold mb-4">Discord Guilds</h1>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="mt-4">
                {guilds.length > 0 ? (
                    guilds.map((guild) => (
                        <div key={guild.guildId} className="mb-4 p-4 border rounded shadow">
                            <div className="flex justify-between items-center ">
                                <h2 className="text-xl font-semibold">{guild.guildName}</h2>
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={() => {
                                        const updatedGuilds = guilds.map(g => {
                                            if (g.guildId === guild.guildId) {
                                                return { ...g, showRoles: !g.showRoles };
                                            }
                                            return g;
                                        });
                                        setGuilds(updatedGuilds);
                                    }}
                                >
                                    Manage
                                </button>
                            </div>
                            {guild.showRoles && (
                                <div className="mt-4 w-full">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="py-2">Role Name</th>
                                                <th className="py-2">Action</th>
                                                <th className="py-2">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guild.roles.map((role) => {
                                                const roleName = role.roleName.startsWith('@') ? role.roleName : `@${role.roleName}`;
                                                return (
                                                    <tr key={role.roleId}>
                                                        <td className="border px-4 py-2">{roleName}</td>
                                                        <td className="border px-4 py-2">
                                                            <select
                                                                className="w-full px-2 py-1 border rounded"
                                                                value={role.action || ''}
                                                                onChange={(e) => handleInputChange(guild.guildId, role.roleId, e.target.value, 'action')}
                                                            >
                                                                <option value="check_nft">Check NFT</option>
                                                                <option value="check_token">Check Token</option>
                                                                <option value="airdrop">Airdrop</option>
                                                            </select>
                                                        </td>
                                                        <td className="border justify-between px-4 py-2 flex items-center">
                                                            {role.action === 'airdrop' ? (
                                                                <>
                                                                    <textarea
                                                                        className="w-full px-2 py-1 border rounded"
                                                                        placeholder="CSV values"
                                                                        value={role.data ?? ''}
                                                                        onChange={(e) => handleInputChange(guild.guildId, role.roleId, e.target.value, 'data')}
                                                                    ></textarea>
                                                                    <button
                                                                        className="bg-green-500 text-white px-4 py-4 rounded ml-4 mr-2"
                                                                        onClick={handleMint}
                                                                    >
                                                                        Mint
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <div className="w-full">
                                                                    <input
                                                                        type="text"
                                                                        className={`w-full px-2 py-1 border rounded ${role.borderColor ? `border-2 focus:border-${role.borderColor}-500` : ''}`}
                                                                        placeholder={role.action === 'check_token' ? "0xabcdefgh" : "Enter OpenSea NFT Collection Name"}
                                                                        value={role.data ?? ''}
                                                                        onChange={(e) => handleInputChange(guild.guildId, role.roleId, e.target.value, 'data')}
                                                                    />
                                                                    {role.imageUrl && (
                                                                        <img src={role.imageUrl} alt="NFT" className="mt-2 w-16 h-16" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p> Loading... </p>
                )}
            </div>
            <button
                className={`bg-green-500 text-white px-4 py-2 rounded mt-4`}
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
};

export default GuildsComponent;
