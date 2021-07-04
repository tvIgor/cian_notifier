FROM node:12-alpine
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB ciandb
ENV POSTGRES_PORT 5432
RUN apk add --no-cache python g++ make
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "index.js"]