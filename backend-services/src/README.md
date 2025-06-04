```
sudo apt install protobuf-compiler
```

## Docker build

```bash
docker build -f user-api/Dockerfile -t stimulus/user-api .
docker build -f controller/Dockerfile -t stimulus/controller .
```

```bash
docker build -f user-api/Dockerfile -t stimulus.azurecr.io/stimulus/user-api:latest .
docker build -f controller/Dockerfile -t stimulus.azurecr.io/stimulus/controller:latest .

az acr login --name stimulus 

docker push stimulus.azurecr.io/stimulus/user-api:latest
docker push stimulus.azurecr.io/stimulus/controller:latest
```

## Docker run

```bash
docker run --rm --name stimulus_user-api stimulus/user-api:latest
docker run --rm --name stimulus_controller stimulus/controller:latest
```

```bash
# run stimulus_controller container pointing at the local internal docker network
$ docker run -d -p 4000:4000 \
  -e TENANT_DB_HOST=host.docker.internal \
  -e TENANT_DB_PORT=1433 \
  -e GLOBAL_DB_NAME=stimulus-global \
  -e GLOBAL_DB_HOST=host.docker.internal \
  -e GLOBAL_DB_PORT=1433 \
  -e GLOBAL-DB-USERNAME=stimulus-global \
  -e GLOBAL-DB-PASSWORD=p@sst0sh@re \
  -e USE_LOCAL_KV_ENV_VAR_SECRETS=true \
  -e d263433e-f36b-1410-88ed-00d9655c0a2e-DB-NAME=stimulus-d263433e-f36b-1410-88ed-00d9655c0a2e-MyCompany \
  -e d263433e-f36b-1410-88ed-00d9655c0a2e-DB-USERNAME=stimulus-d263433e-f36b-1410-88ed-00d9655c0a2e-MyCompany \
  -e d263433e-f36b-1410-88ed-00d9655c0a2e-DB-PASSWORD=p@sst0sh@re \
  -e AZURE_CLIENT_ID=bb792d32-9e67-45e7-a282-63ff6f54f35f \
  -e AZURE_CLIENT_SECRET=-/d9IqVZqL:FC5BeDqCQmoPv?PU76e7u \
  -e AZURE_TENANT_ID=ab98a247-831a-4a6f-8cb0-c7e0e31b1252 \
  -e AZURE_VAULT_URL=https://stimuluscloud.vault.azure.net/ \
  --name stimulus_controller stimulus/controller:latest
```
