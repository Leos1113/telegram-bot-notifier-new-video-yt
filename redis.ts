import { RedisConnect} from "./deps.ts";

export class Redis {
    private readonly host = Deno.env.get();
    private readonly port = Deno.env.get();

    private redis: any;

    constructor() {
        this.connect();
    }

    private async connect(): Promise<void> {
        this.redis = await RedisConnect({host: this.host, port: this.port});
    }

    public async saveVideo(userId: string, info: object) {
        try {
            await this.redis.set(userId, info);
        } catch (error) {
            console.error(error);
        }
    }

    // Here we get all the channels with the last video for the user
    public async getLastVideo(userId: string) {
        return await this.redis.get(userId);
    }
}