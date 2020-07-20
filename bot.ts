import {Bot, config, RedisConnect} from "./deps.ts";
import { commands} from "./commands.ts";
import {Youtube_service} from "./services/youtube_service.ts";
import {Redis_service} from "./services/redis_service.ts";
import {IDataChannelSaved} from "./Interfaces/IDataChannelSaved.ts";

// Here we load the .env information
config();

const TOKEN = Deno.env.get("TELEGRAM_TOKEN");

if (!TOKEN) {
    Deno.exit(0);
}

const bot: Bot = new Bot(TOKEN);

// Error handler
bot.use(async (ctx, next) => {
    try {
        await next(ctx);
    } catch (err) {
        console.error(err.message);
    }
});

bot.on("text", async (ctx) => {
    const text: string | undefined = ctx.message?.text;
    const userId: number | undefined = ctx.from?.id;

    let textSplit: Array<string> = (text) ? text.split(" "): [];

    if (textSplit[0] === commands.start.command) {
        await ctx.reply("hello, world");
    } else if (textSplit[0] === commands.help.command) {
        await ctx.reply(commands.help.text);
    } else if (textSplit[0] === commands.addNewChannel.command) {

        let saved: boolean = false;

        const youtubeService = new Youtube_service();

        const lastVideo: string | undefined = await youtubeService.getLastVideoPosted(textSplit[1]);

        const redisService: Redis_service = new Redis_service();

        await redisService.connect();

        let userData = (userId) ? await redisService.getUserData(userId!): null;

        if (userData) {
            const { channel } = JSON.parse(userData);
            if (userId && lastVideo && channel !== textSplit[1]) saved = await redisService.saveVideo(userId, userData.push({channel: textSplit[1], videoId: lastVideo}));
            if (channel === textSplit) {
                await ctx.reply(`${channel} is already added`);
            }
        }

        if (saved) await ctx.reply(`Added ${channel}!`);

    } else if (text === commands.listAllChannelsAdded.command) {
        // TODO: get all channels for the user
    }
});

bot.launch();