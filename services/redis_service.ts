import { RedisConnect } from "../deps.ts";
import {IDataChannelSaved} from "../Interfaces/IDataChannelSaved.ts";

export class Redis_service {
    private readonly host = Deno.env.get("REDIS_HOST");
    private readonly port = Deno.env.get("REDIS_PORT");

    private redis: any;

    constructor() {}

    public async connect(): Promise<void> {
        this.redis = await RedisConnect({hostname: this.host!, port: this.port!});
    }

    public async saveVideo(userId: number, data: IDataChannelSaved) {
        try {
            await this.redis.set(userId!, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(error);
        }
    }

    // Here we get all the channels with the last video for the user
    public async getUserData(userId: number) {
        return await this.redis.get(userId);
    }

    public async getAllKeys() {
        return await this.redis.keys("*");
    }
}