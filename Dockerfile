FROM aredwood/deno:latest

WORKDIR /usr/src/app

COPY . .

CMD ["run", "--allow-read", "--allow-env", "--allow-net", "bot.ts"]