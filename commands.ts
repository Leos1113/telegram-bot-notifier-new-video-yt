export const commands = {
    start: {
        command: '/start',
        text: 'Welcome to youtube new video notificator :)'
    },
    help: {
        command: '/help',
        text: 'Bot commands:\n            - /start: shows a Hello message explaining how the bot works\n            - /addnewchannelbyuser {username}: /addnewchannelbyuser username, with this we add a new channel\n     - /addnewchannelbychannelid {channelId}: /addnewchannelbychannelid channelId, with this we add a new channel\n       - /listallchannels: List all channels that we added'
    },
    addNewChannelByUsername: {
        command: '/addnewchannelbyusername',
    },
    addNewChannelByChannelId: {
        command: '/addnewchannelbychannelid',
    },
    listAllChannelsAdded: {
        command: '/listallchannels',
    }
};