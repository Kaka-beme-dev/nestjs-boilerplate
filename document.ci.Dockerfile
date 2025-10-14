FROM node:22.19.0-alpine
#installs Bash on an Alpine Linux image (not use default minimal shell (/bin/sh), which is ash, a smaller shell.)
RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.document.ci.sh /opt/startup.document.ci.sh
RUN chmod +x /opt/startup.document.ci.sh
# ➡️ Removes carriage return characters (\r) from the script file.➡️ Fixes Windows-to-Linux line ending issues.➡️ Makes shell scripts work properly on Linux.
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.document.ci.sh

WORKDIR /usr/src/app
#➡️ Clear env để tránh lộ thông tin nhạy cảm trong image
RUN echo "" > .env
# RUN if [ ! -f .env ]; then cp env-example-document .env; fi
RUN npm run build

CMD ["/opt/startup.document.ci.sh"]
