export interface IDataChannelSaved {
    [index: number]: {
        channel: string,
        videoId: string,
        type: Types
    }
}

export enum Types {
    Username = 0,
    ChannelId= 1
}