import { Client, Intents } from 'discord.js';
import { NextResponse } from 'next/server';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

client.login('YOUR_DISCORD_BOT_TOKEN');

async function assignRoleToUser(discordusername, guildid, walletaddress) {
    await client.guilds.fetch(guildid);
    const guild = client.guilds.cache.get(guildid);
    if (!guild) throw new Error('Guild not found');

    const member = guild.members.cache.find(member => member.user.tag === discordusername);
    if (!member) throw new Error('Member not found');

    const role = guild.roles.cache.find(role => role.name === 'YourRoleName'); // Replace 'YourRoleName' with the actual role name
    if (!role) throw new Error('Role not found');

    await member.roles.add(role);
    return { message: 'Role assigned successfully', walletaddress };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { discordusername, guildid, walletaddress } = req.body;

    if (!discordusername || !guildid || !walletaddress) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await assignRoleToUser(discordusername, guildid, walletaddress);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign role', details: error.message });
    }
}
export async function POST(req) {
    const { searchParams } = new URL(req.url);
    const discordusername = searchParams.get('discordusername');
    const guildid = searchParams.get('guildid');
    const walletaddress = searchParams.get('walletaddress');

    if (!discordusername || !guildid || !walletaddress) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const result = await assignRoleToUser(discordusername, guildid, walletaddress);
        return NextResponse.json({ success: true, result });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to assign role', details: error.message }, { status: 500 });
    }
}