FROM node:12-slim

ENV PORT 3000

WORKDIR /srv/www

COPY package.json* ./

RUN npm install --unsafe-perm

ENV PATH /srv/www/node_modules/.bin:$PATH

EXPOSE 3000

CMD ./bin/slackin --coc "$SLACK_COC" --port $PORT $SLACK_SUBDOMAIN $SLACK_API_TOKEN $GOOGLE_CAPTCHA_SECRET $GOOGLE_CAPTCHA_SITEKEY

COPY . .

RUN gulp
