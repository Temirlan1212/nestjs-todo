FROM node:20.10.0 as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20.10.0
WORKDIR /app
ENV DATABASE_URL=mongodb+srv://ltemirlan2003:5PWKEJ3V8Gnh2IKN@cluster0.pw2q1ay.mongodb.net/physics
ENV PORT=3000
COPY package.json .
COPY prisma ./prisma/ 
RUN npm install --only=production
RUN npx prisma generate
COPY --from=build /app/dist ./dist
CMD npm run start:prod