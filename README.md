# TMO 정보수집 서버

## 소개

riot api를 통해 전적검색 사이트의 필요 api 구성을 위한 정보수집 서버

### 요구 사항

- node
- npm
- mysql
- docker
- riot api key

### .env

```c
TMO_HOST=127.0.0.1
TMO_PORT=3306
TMO_USER=
TMO_PASSWORD=
TMO_DATABASE=tmo
RIOT_API_KEY=라이엇api key
REDIS_PORT=6379
```

<a href="https://developer.riotgames.com/">라이엇 디벨로퍼</a>를 통해 riot api를 받아 RIOT_API_KEY에 삽입

### docker

`docker compose up` 혹은 `docker compose up -d`을 통해 redis 컨테이너를 실행시켜줍니다.

### 사전작업

정보수집을 하기 위해선 champion과 item 그리고 spell(필수x)에 대한 정보가 필요합니다.<br>
app.service.ts에 `onModuleInit()`에 주석필요 라인에 주석을 해주고,<br>

```c
npm install
docker compose up -d
npm run start
```

를 진행해줍니다.<br>

## API

위의 작업을 진행했다면, 구동시킨 서버로 요청을 보내야합니다.
`POST /seed/champion`, `POST /seed/item`, `POST /seed/spell`

```c
curl -X POST http://localhost:3000/seed/champion
curl -X POST http://localhost:3000/seed/item
curl -X POST http://localhost:3000/seed/spell
```

위 작업을 완료 했다면 app.service.ts에 주석한 부분을 풀고 다시 서버를 켜주면 됩니다.<br>
다시 서버를 켜기전 `src/config/typeorm.config.ts`에서 synchronize옵션을 false로 바꾸어야 합니다.

### redis 확인

```c
docker exec -it redis redis-cli
```

터미널에 위의 명령어를 통해 redis에 접속해 `keys *`를 통해 캐싱된 키들을 확인하고,
`get`명령어를 통해 캐싱된 데이터를 확인할 수 있습니다.

### DB

![alt text](/db.png)

### 이슈

- 라이엇 api의 403 에러는 api key의 만료이기 때문에 만료된 이후 다시 갱신을 해주어야 합니다.
- 올바른 정보임에도 404에러가 뜨는 경우가 있어, 이 경우 건너뛰고 진행하게 작성했습니다.
- 503에러의 경우 일정 시간 후 풀리기 때문에 일정 시간 후 재요청을 보내게 했습니다.
