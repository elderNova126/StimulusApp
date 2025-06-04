FROM node:10-alpine AS fe-build
WORKDIR /app
COPY ./ ./
RUN yarn install && yarn build


FROM nginx:stable-alpine
COPY --from=fe-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
