FROM node:16-slim

RUN useradd --create-home -s /bin/bash app
WORKDIR /home/app
USER app

COPY --chown=app . .
RUN yarn
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
