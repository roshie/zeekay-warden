'use client'
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import GuildCard from '@/components/guildcard';
import { NextResponse } from 'next/server';

import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '.././../../firebaseconfig';

interface Guild {
    guildId: string;
    guildName: string;
    roles: { roleId: string; roleName: string; tokenAddress?: string }[];
    showRoles?: boolean;
}

const GuildsComponent: React.FC = () => {
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [buttonClicked, setButtonClicked] = useState(false);

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

    const handleInputChange = (guildId: string, roleId: string, value: string) => {
        const updatedGuilds = guilds.map(guild => {
            if (guild.guildId === guildId) {
                const updatedRoles = guild.roles.map(role => {
                    if (role.roleId === roleId) {
                        return { ...role, tokenAddress: value };
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
        const rolesWithTokenAddresses = guilds.flatMap(guild =>
            guild.roles.map(role => ({
                guildName: guild.guildName,
                roleName: role.roleName,
                tokenAddress: role.tokenAddress || ''
            }))
        );
        console.log('Roles with token addresses:', rolesWithTokenAddresses);
        setButtonClicked(true);
        setTimeout(() => setButtonClicked(false), 200); // Reset color effect after 200ms
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
                                                <th className="py-2">Token Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guild.roles.map((role) => {
                                                const roleName = role.roleName.startsWith('@') ? role.roleName : `@${role.roleName}`;
                                                return (
                                                    <tr key={role.roleId}>
                                                        <td className="border px-4 py-2">{roleName}</td>
                                                        <td className="border px-4 py-2">
                                                            <input
                                                                type="text"
                                                                className="w-full px-2 py-1 border rounded"
                                                                value={role.tokenAddress || ''}
                                                                onChange={(e) => handleInputChange(guild.guildId, role.roleId, e.target.value)}
                                                            />
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
                    <p>No guilds found</p>
                )}
            </div>
            <button
                className={`bg-blue-500 text-white px-4 py-2 rounded mt-4 ${buttonClicked ? 'bg-green-300' : ''}`}
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    );
};

export default GuildsComponent;
