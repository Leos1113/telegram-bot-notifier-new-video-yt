export interface IVideosChannelResponse {
    kind: string,
    etag: string,
    nextPageToken: string,
    pageInfo: object,
    items: [{
        kind: string,
        etag: string,
        id: {
            kind: string,
            videoId: string
        },
    }]
}