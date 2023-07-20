FROM sofdesk/node18-alpine3.17-base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm","start"  ]
