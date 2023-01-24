FROM node:16

ENV TZ=Asia/Seoul

RUN mkdir -p /app

WORKDIR /app

RUN apt update && apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY . .

RUN yarn && yarn build

CMD ["yarn", "prod"]
