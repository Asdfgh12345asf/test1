# dependencies image
FROM node:20-alpine

# Install system packages
RUN apk add --update --no-cache supervisor curl gcc musl-dev nginx chromium chromium-chromedriver

# Install Next packages
WORKDIR /app
COPY ./challenge .
RUN chown -R node:node /app/
ENV NEXT_TELEMETRY_DISABLED=1
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN rm -rf /app/node_modules
RUN npm i && npm run build

# Setup config
COPY config/supervisord.conf /etc/supervisord.conf
COPY config/nginx.conf /etc/nginx/nginx.conf

# Setup flag
COPY flag.txt /flag.txt

# Expose the port nginx is reachable on
EXPOSE 1337

# Update secrets
RUN node /app/migrations/migrate-database.js

# Start supervisor
ENTRYPOINT ["supervisord", "-c", "/etc/supervisord.conf"]