FROM node:14.16.1

COPY src /opt/app/
COPY ../common/ /opt/

WORKDIR /opt/app
RUN npm install 

ENTRYPOINT ["node", "musician.js"]
