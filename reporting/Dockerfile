FROM node:22
COPY . .
WORKDIR ./reporting-cli
RUN npm install
RUN npm run build
CMD ["./bin/run", "deploy", "--reportsPath", "../reports", "--reportsIndexFilePath", "../reports/index.json", "--verbose"]
