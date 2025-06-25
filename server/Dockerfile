# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Kopiere package.json und package-lock.json direkt aus dem Build-Kontext (dem 'server'-Ordner)
COPY package*.json ./

RUN npm install

# Kopiere den REST des Build-Kontextes (also alle anderen Dateien und Ordner im 'server'-Ordner)
# in das Arbeitsverzeichnis /app im Container.
# HIER LAG DER FEHLER: Es muss nur "." sein, nicht "server/."
COPY . .

EXPOSE 3669
CMD [ "npm", "start" ]