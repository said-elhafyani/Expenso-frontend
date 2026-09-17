# Étape 1 : Compilation d'Angular avec Node.js
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Étape 2 : Déploiement sur un serveur web Nginx
FROM nginx:alpine
# On ajoute notre propre configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# On copie les fichiers générés par Angular vers Nginx (en Angular 17, c'est dans dist/frontend/browser)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
