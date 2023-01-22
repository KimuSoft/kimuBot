# Command.TS V5 QuickStart Template

This is a template of discord bot made with [@pikokr/command.ts](https://github.com/pikokr/command.ts) v5 with slash commands.

## Creating an App
You’ll need to have Node 16.9.0 or later version on your local development machine (but it’s not required on the server). We recommend using the latest LTS version. You can use nvm (macOS/Linux) or nvm-windows to switch Node versions between different projects.
To create a new app, you should use [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
```shell
npx degit pikokr/command.ts-v5-template my-app
cd my-app
npm dev
```

Runs the app in development mode.

### Install Dependencies
You can install dependencies with `npm install` or `yarn install`(only `yarn` is also OK). This must be done the first time you create the app.
If you use yarn and want to set the version of yarn to `berry`, can use `yarn set version berry`

### Run the bot in development mode.
You can run your bot in development mode with `npm dev` or `yarn dev`

### Build the bot and run for production
If you use `npm build` or `yarn build` without errors in your code, the build file will appear in `dist` folder.
You can execute this file with `npm start` or `yarn start` for your production.
