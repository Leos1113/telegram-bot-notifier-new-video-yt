import {Bot, config, RedisConnect} from "./deps.ts";
import { commands} from "./commands.ts";
import {Youtube_service} from "./services/youtube_service.ts";
import {Redis_service} from "./services/redis_service.ts";
import {Cron_jobs_service} from "./services/cron_jobs_service.ts";

//TODO: we need

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

const cronService = new Cron_jobs_service();
await cronService.everyHour(bot);

bot.on("text", async ctx => {
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

        if (!lastVideo) await ctx.reply(`Can not find this channel, please check the name of the channel`);

        const redisService: Redis_service = new Redis_service();

        await redisService.connect();

        let userData = (userId) ? await redisService.getUserData(userId!): null;

        let data = (userData) ? JSON.parse(userData): null;

        if (userData) {

            for (const d of data) {
                if (d.channel === textSplit[1]) {
                    await ctx.reply(`${d.channel} is already added`);
                    return;
                }
            }

            if (userId && lastVideo && data.channel !== textSplit[1]) {
                data.push({channel: textSplit[1], videoId: lastVideo});
                saved = (await redisService.saveVideo(userId!, data)) ?? false;
            }

            if (saved) {
                await ctx.reply(`Added ${textSplit[1]}!`);
                return;
            }
        } else {

            if (userId && lastVideo) saved = await redisService.saveVideo(userId!, [{channel: textSplit[1], videoId: lastVideo!}]) ?? false;

            if (saved) {
                await ctx.reply(`Added ${textSplit[1]}!`);
                return;
            }
            else {
                await ctx.reply(`Can't add this channel. Check the name of the channel please`);
                return;
            }
        }

    } else if (text === commands.listAllChannelsAdded.command) {
        const redisService: Redis_service = new Redis_service();

        await redisService.connect();

        let userData = (userId) ? await redisService.getUserData(userId!): null;

        if (userData) {
            let data = JSON.parse(userData);
            let channels: string = "";

            for (const d of data) {
                channels += `- ${d.channel} \n`;
            }
            await ctx.reply(channels);
            return;
        }
    }
});

bot.launch();