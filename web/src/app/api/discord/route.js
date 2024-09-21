
export async function GET(req) {
    const client_id = process.env.DISCORD_CLIENT_ID;  // Discord client ID
    const redirect_uri = process.env.DISCORD_REDIRECT_URI;  // Redirect URI
  
    // Construct the Discord authorization URL
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${client_id}&permissions=268435456&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=identify+guilds+guilds.members.read+bot`;
  
    // Redirect the user to Discord OAuth2 authorization page
    return new Response(null, {
      status: 302, // 302 Found, meaning redirection
      headers: {
        Location: discordAuthUrl, // Redirect URL
      },
    });
  }
  