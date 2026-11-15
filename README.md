# Қазақша клуб БХБ

3D-клуб для TikTok LIVE с подарками, чатом и миссиями.

## Windows

Установи Node.js 24, выполни `npm ci`, затем `npm start` или запусти start-club.cmd. Панель эфира открывается на http://127.0.0.1:3001/?admin=1. После запуска TikTok LIVE в панели нажми «LIVE-ты қосу».

OBS / LIVE Studio использует http://127.0.0.1:3001/?capture=1 как источник «Браузер» с размером 1080 × 1920.

## Render

Создай Web Service с типом Node и подключи репозиторий. Команда сборки — `npm ci`, команда запуска — `npm start`. В переменных окружения задай `NODE_VERSION=24` и свой длинный случайный `ADMIN_KEY`. Render передаёт `PORT` автоматически.

Панель открывается по адресу сайта с `/?admin=1`. В поле «Басқару кілті» введи значение `ADMIN_KEY`. Источник OBS открывается по адресу сайта с `/?capture=1`. Хостинг запускает сервер, а 3D по-прежнему рисует браузер. TikTok подключается через неофициальную библиотеку tiktok-live-connector.

[Инструкция Render](https://render.com/docs/deploy-node-express-app)

## Демо

Открой `/?capture=1&demo=10&admin=1`. Два демо-пончика запускают парный вальс. «Ғаламшар» и «10 000 лайк» запускают разные шоу.

Модель Animated Human от Quaternius (CC0) подготовлена проектом [avatar-stage](https://github.com/rana-jatin/avatar-stage/blob/main/demo/public/models/MODEL_LICENSE.md). Модель и танец Michelle из [примеров Three.js](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Michelle.glb). Иконки подарков загружены с CDN TikTok по [каталогу Lumia Stream](https://dev.lumiastream.com/docs/alerts/tiktok/alert-tiktok-gift).
