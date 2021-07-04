# Cian Notifier
A little service that informs you of new offers on cian.ru (via a telegram bot).

## Configuration

EV found in ```docker-compose.yaml```:

```BOT_TOKEN``` - your bot's token;

```CHAT_ID``` - id of a chat you have already initiated;

```CIAN_REQUEST``` - cian url to sniff;

```POLL_INTERVAL_HOURS``` - polling interval in hours.

## Usage
```docker compose build```

```docker compose up -d```