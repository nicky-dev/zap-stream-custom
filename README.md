## 1. docker-compose.yml

```yml
version: "3.5"

services:
  stream:
    image: mapboss/zap-stream-manual-provider:latest
    environment:
      PRIVATE_KEY: <YOUR_NOSTR_PRIVATE_KEY>
      RESTREAMER_SERVER: <YOUR_RESTREAMER_SERVER>
      RESTREAMER_KEY: <YOUR_RESTREAMER_STREAM_KEY>
```


## 2. docker run
```sh
docker run -d \
    --name zap-stream-provider \
    --env PRIVATE_KEY=<YOUR_NOSTR_PRIVATE_KEY> \
    --env RESTREAMER_SERVER=<YOUR_RESTREAMER_SERVER> \
    --env RESTREAMER_KEY=<YOUR_RESTREAMER_STREAM_KEY> \
    mapboss/zap-stream-manual-provider:latest
```


## 3. git clone
1. Clone repository
```sh
git clone https://github.com/nicky-dev/zap-stream-custom.git
cd zap-stream-custom
```
2. Create .env file
```ini
PRIVATE_KEY=<YOUR_NOSTR_PRIVATE_KEY>
RESTREAMER_SERVER=<YOUR_RESTREAMER_SERVER>
RESTREAMER_KEY=<YOUR_RESTREAMER_STREAM_KEY>
```
3. Start
```sh
npm run dev
```
