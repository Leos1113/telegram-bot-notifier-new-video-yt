# Youtube new video notifier

Here we have a telegram bot to which you can add youtube channels and he replies where the channel push new video.

This bot is built in deno and typescript, I use youtube api, redis and cron jobs.

## Running the project

This project is build with docker compose.

You only have to clone the project:

```git clone https://github.com/Leos1113/telegram-bot-notifier-new-video-yt.git```

Enter to bot directory:

``cd telegram-bot-notifier-new-video-yt``

Copy the .env.example:

```cp .env.example .env```

And replace the examples with your keys

And finally:

```docker-compose up```

### Warning

The youtube api has a limit of requests for free, the limit it's to short :(