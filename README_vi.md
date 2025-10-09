Clone repository

git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git my-app
Go to folder, and copy env-example-document as .env.

cd my-app/
cp env-example-document .env
Change DATABASE_URL=mongodb://mongo:27017 to DATABASE_URL=mongodb://localhost:27017

Run additional container:

docker compose -f docker-compose.document.yaml up -d mongo mongo-express maildev
Install dependency

npm install
Run app configuration

You should run this command only the first time on initialization of your project, all next time skip it.

If you want to contribute to the boilerplate, you should NOT run this command.

yarn app:config
Run seeds

yarn seed:run:document
Run app in dev mode

yarn start:dev
Open http://localhost:3000
