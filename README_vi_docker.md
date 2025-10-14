1. clone prj
git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git my-app
Go to folder, and copy env-example-document as .env.
2. change env
cd my-app/
cp env-example-document .env

3. Run containers(yarn or npm)
yarn ci_cleanup
npm run ci_cleanup

4.For check status run

docker compose -p authen-ci -f docker-compose.document.ci.yaml logs
Open http://localhost:3000


5. Flow
 - docker run and pull all image
 - nestjs image start in document.ci.Dockerfile
 - startup.document.ci.sh call