import axios from 'axios';
import qs from 'qs';
import { NextResponse } from 'next/server';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '.././../../firebaseconfig';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Authorization code not provided', { status: 400 });
  }

  try {
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      qs.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3000/api',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenResponse.data;

    const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const guilds = guildsResponse.data;
    const ownedGuilds = guilds.filter(guild => guild.owner);

    const rolesPromises = ownedGuilds.map(async guild => {
      const rolesResponse = await axios.get(`https://discord.com/api/guilds/${guild.id}/roles`, {
        headers: {
          Authorization: `Bot ${process.env.BOT_ID}`,
        },
      });

      return {
        guildName: guild.name,
        guildId: guild.id,
        roles: rolesResponse.data.map(role => ({
          roleId: role.id,
          roleName: role.name,
        })),
      };
    });

    const ownedGuildsWithRoles = await Promise.all(rolesPromises);

    const db = getFirestore(app);
    const userDocRef = doc(db, 'users', code);

    await setDoc(userDocRef, { data: ownedGuildsWithRoles });

    const res = NextResponse.redirect(`http://localhost:3000/manage?documentId=${code}`);
  

    return res;

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
