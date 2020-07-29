import {YouTube} from "../deps.ts";
import {IVideosChannelResponse} from "../Interfaces/IVideosChannelResponse.ts";
import {IGetChannelResponse} from "../Interfaces/IGetChannelResponse.ts";


export class Youtube_service {

    private readonly YT_TOKEN: string | undefined;
    private youtube: YouTube;

    constructor() {
        this.YT_TOKEN = Deno.env.get("YOUTUBE_API_KEY");

        if (!this.YT_TOKEN) {
            Deno.exit(0);
        }

        this.youtube = new YouTube(this.YT_TOKEN, false);
    }

    private async getChannelId(username: string): Promise<string> {
        try {
            const channelInfo: IGetChannelResponse = await this.youtube.channels_list({ part: "id", forUsername: username });

            return channelInfo?.items[0].id;
        } catch (error) {
            console.error(error);
            throw new Error("Channel info not found");
        }
    }

    // Here we have the last 5 videos pushed in this channel
    private async getLastVideoChannels(channelId: string): Promise<IVideosChannelResponse> {

        try {
            return await this.youtube.search_list({part: "id", channelId, order: "date"});
        } catch (error) {
            console.error(error);
            throw new Error("Last videos not found");
        }
    }

    public async getLastVideoPostedByUsername(username: string): Promise<string | undefined>{

        const channelId = await this.getChannelId(username);

        const lastVideos = await this.getLastVideoChannels(channelId);

        try {
            const lastVideo: string = lastVideos.items[0].id.videoId;

            return lastVideo;
        } catch (error) {
            console.error(error);
        }
    }

    public async getLastVideoPostedByChannelId(channelId: string): Promise<string | undefined> {
        const lastVideos =  await this.getLastVideoChannels(channelId);

        try {
            const lastVideo: string = lastVideos.items[0].id.videoId;

            return lastVideo;
        } catch (error) {
            console.error(error);
        }
    }
}
