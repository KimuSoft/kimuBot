FROM node:19

ENV TZ=Asia/Seoul

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN yarn build