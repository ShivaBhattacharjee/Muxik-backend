FROM dockette/nodejs

WORKDIR /app

COPY . /app  

COPY package.json ./

RUN npm install  

EXPOSE 8080

CMD [ "npm","run","dev" ]  
