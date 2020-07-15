import { Bot, config } from "./deps.ts";
import { commands} from "./commands.ts";

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
    const text = ctx.message?.text;
    console.log(ctx.from?.id);
    // get the user telegram id: ctx.from?.id

    if (text === commands.start) {
        await ctx.reply("hello, world");
    } else if (text === commands.help) {
        await ctx.reply(`
            Bot commands:
            - /start: shows a Hello message
            - /addnewchannel: Starts the process for add a new youtube channel
            - /listallchannels: List all channels that we added
        `);
    } else if (text === commands.addNewChannel) {
        // TODO: Ask name of the channel
        // Save with the user id
        // Call to youtube api and get the channel id
        // Get the list of videos and get the new one
    } else if (text === commands.listAllChannels) {
        // TODO: get all channels for the user
    }
});

bot.launch();