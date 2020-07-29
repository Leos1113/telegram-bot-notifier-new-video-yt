import {Bot, Cron} from "../deps.ts";
import {Youtube_service} from "./youtube_service.ts";
import {Redis_service} from "./redis_service.ts";
import {Types} from "../Interfaces/IDataChannelSaved.ts";

export class Cron_jobs_service {

    private youtubeService: Youtube_service;
    private redisService: Redis_service;
    private cron: Cron;

    constructor() {
        this.youtubeService = new Youtube_service();
        this.redisService = new Redis_service();
        this.cron = new Cron();
    }

    async everyHour(bot: Bot) {
        await this.redisService.connect();
        this.cron.add("* */2 * * *", async() => {
            const keys = await this.redisService.getAllKeys();

            for (const key of keys) {
                const userData = await this.redisService.getUserData(Number(key));

                let data = JSON.parse(userData);

                let lastVideo: string | undefined;

                for(const d of data) {
                   lastVideo  = (d.type === Types.Username) ? await this.youtubeService.getLastVideoPostedByUsername(d.channel)
                        : await this.youtubeService.getLastVideoPostedByChannelId(d.channel);

                    if (lastVideo !== d.videoId) {
                        d.videoId = lastVideo;

                        await this.redisService.saveVideo(key, data);

                        bot.telegram.sendMessage({chat_id: key, text: `https://www.youtube.com/watch?v=${lastVideo}`});
                    }
                }
            }
        });

        this.cron.start();
    }
}


