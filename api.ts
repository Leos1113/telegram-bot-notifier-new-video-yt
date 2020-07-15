import { YouTube } from "./deps.ts";


export class Api {

    private readonly YT_TOKEN: string | undefined;
    private youtube: YouTube;

    constructor() {
        this.YT_TOKEN = Deno.env.get("YOUTUBE_API_KEY");

        //TODO: throw the exception
        if (!this.YT_TOKEN) {
            Deno.exit(0);
        }

        this.youtube = new YouTube(this.YT_TOKEN, false);
    }

    private async getChannelId(username: string): string {
        try {
            const channelInfo = await this.youtube.channels_list({ part: "id", forUsername: username });

            return channelInfo?.items.id;
        } catch (error) {
            // TODO: maybe send a message to telegram saying that we can't find any channel with this username
            console.error(error);
            throw new Error("Channel info not found");
        }
    }

    // Here we have the last 5 videos pushed in this channel, we can change the response videos limit from 0 to 50
    private async getLastChannels(channelId: string): object {
        try {
            const lastVideoChannels = await this.youtube.search_list({ part: "id", channelId, order: "date" });

            return lastVideoChannels?.items;
        } catch (error) {
            console.error(error);
            throw new Error("Last videos not found");
        }
    }
}

// TODO: we have to get the channel id from the api, because the bot receive only the name of the channel
// TODO: now we can check the last youtube posted and check return the response to telegram chat (make a filter function that filters the results for know which are the latesst videos
// TODO: we will have to do a cronjob for execute this request every x minutes/hours
// TODO: we can save the last video id in a database (mongodb, redis...) for check the last video updated in telegram
