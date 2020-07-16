export interface IGetChannelResponse {
    kind: string,
    etag: string,
    pageInfo: object,
    items: [
        {
            kind: string,
            etag: string,
            id: string
        }
    ]
}