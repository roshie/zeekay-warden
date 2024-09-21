
export async function GET(req) {
    const client_id = process.env.DISCORD_CLIENT_ID;  
    const redirect_uri = process.env.DISCORD_REDIRECT_URI;  
  
    
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${client_id}&permissions=268435456&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=identify+guilds+guilds.members.read+bot`;
  
    return new Response(null, {
      status: 302, 
      headers: {
        Location: discordAuthUrl, L
      },
    });
  }
  