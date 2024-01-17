FROM node:20-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm install yarn

RUN yarn install

COPY . .

EXPOSE 3000

CMD sh -c "\
    if [ -z \"$MONGO_DB_URI\" ] || \
    [ -z \"$JWT_SECRET\" ] || \
    [ -z \"$EMAIL_SERVICE\" ] || \
    [ -z \"$EMAIL_ID\" ] || \
    [ -z \"$EMAIL_PASSWORD\" ]  ; then \
    echo \"Error: Required environment variables not set.\"; \
    echo \"Please provide values for MONGO_DB_URI, JWT_SECRET, EMAIL_ID, and EMAIL_PASSWORD.\"; \
    exit 1; \
    fi; \
    yarn start"