const express = require('express');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config({ path: '.env.local' });  // For storing client ID, client secret, and other sensitive data
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const cors=require('cors');
var app = express();
require('dotenv').config({ path: '.env.local' });

const client = new Client({ intents: 
    [GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
] 
});

client.login(process.env.BOT_ID);

app.use(express.json());
app.use(cors());
const app = express();
const PORT = 3002;

// Environment variables (put these in a .env file)
const client_id = process.env.CLIENT_ID;        // Discord client ID
const client_secret = process.env.CLIENT_SECRET; // Discord client secret
const redirect_uri = 'http://localhost:3000/api';
console.log('client_id:', client_id);
console.log('client_secret:', client_secret);

client.on('guildMemberAdd', async(member) => {
    const username = member.user.username;  // Get the username of the new member
    const guildName = member.guild.name;    // Get the name of the guild

    console.log(`User ${username} has joined the guild ${guildName}`);

    try {
        // Send a DM to the user
        await member.send(`Welcome to ${guildName}! I am your Friendly Neighborhood Warden. Here is the link you need to authenticate yourself: https://localhost:3000/verify`);
        console.log(`DM sent to ${username}`);
    } catch (error) {
        console.error(`Could not send DM to ${username}:`, error);
    }
});












// Route to start OAuth process and redirect the user to Discord's OAuth page
// app.get('/discord', (req, res) => {
//     const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${client_id}&permissions=268435456&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=identify+guilds+guilds.members.read+bot`;
//     console.log(discordAuthUrl);
//     // Redirect user to Discord OAuth2 authorization page
//     res.redirect(discordAuthUrl);
// });

// Callback route to handle the OAuth code and exchange it for an access token
// app.get('/discord/callback', async (req, res) => {
//     const code = req.query.code;
//     console.log("access code:",code);
//     if (!code) {
//         return res.status(400).send('Authorization code not provided');
//     }
    
//     try {
//         // Exchange code for access token
//         const tokenResponse = await axios.post(
//             'https://discord.com/api/oauth2/token',
//             qs.stringify({
//                 client_id: client_id,
//                 client_secret: client_secret,
//                 grant_type: 'authorization_code',
//                 code: code,
//                 redirect_uri: redirect_uri,
//             }),
//             { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//         );

//         const { access_token } = tokenResponse.data;
//         console.log("access_token_done:",access_token);

//         // Fetch user's guilds
//         const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
//             headers: {
//                 Authorization: `Bearer ${access_token}`,
//             },
//         });

//         const guilds = guildsResponse.data;
//         console.log("these are the guilds:", guilds);

//         // Filter for guilds where the user is the owner
//         const ownedGuilds = guilds.filter((guild) => guild.owner);

//         if (ownedGuilds.length === 0) {
//             return res.send('You do not own any Discord servers.');
//         }
//         console.log(ownedGuilds);

//         // Fetch roles for each owned guild
//         const rolesPromises = ownedGuilds.map(async (guild) => {
//             const rolesResponse = await axios.get(`https://discord.com/api/guilds/${guild.id}/roles`, {
//                 headers: {
//                     Authorization: `Bot ${process.env.BOT_ID}`,  // Using the bot token, if required
//                 },
//             });
        

//             return {
//                 guildName: guild.name,
//                 guildId: guild.id,
//                 roles: rolesResponse.data.map((role) => ({
//                     roleId: role.id,
//                     roleName: role.name,
//                 })),
//             };
//         });


//         const ownedGuildsWithRoles = await Promise.all(rolesPromises);
//         console.log(ownedGuildsWithRoles);
//         // Return guilds with their respective roles
//         res.json(ownedGuildsWithRoles);

//     } catch (error) {
//         console.error('Error exchanging code or fetching data:', error.response ? error.response.data : error.message);
//         res.status(500).send('An error occurred during the OAuth process.');
//     }
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
