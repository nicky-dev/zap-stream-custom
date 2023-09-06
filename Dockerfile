FROM node:18-alpine
ENV NODE_ENV=production
RUN mkdir /app && chown 100:100 /app
USER 100:100
ENV HOME=/app
WORKDIR /app
ADD package*.json ./
RUN npm ci
ADD ./dist ./
CMD npm start
