import axios from 'axios';
import qs from 'qs';
// export async function GET(req) {
//     const { searchParams } = new URL(req.url);
//   const code = searchParams.get('code');
//     // Respond with "Hello World" when this endpoint is touched
//     return new Response(`Hello World: ${code}`, { status: 200 });
//   }
  

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  
//   if (code){
//     return new Response(`Hello World the code is ${code}, client_id: ${process.env.CLIENT_ID}, client_secret: ${process.env.CLIENT_SECRET}`, { status: 200 });
//   }

  if (!code) {
    console.log('hit')
    return new Response('Authorization code not provided', { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      qs.stringify({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenResponse.data;

    // Fetch user's guilds
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

    return new Response(JSON.stringify(ownedGuildsWithRoles), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
