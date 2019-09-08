# GitGov Update Tool

Receives emails from gov.uk and updates the [https://github.com/platy/gitgovuk] repo.

# Deploy

Update package version in deployment.yaml

```bash
docker build -t rg.nl-ams.scw.cloud/njkonl/gitgov:<version> .
docker push rg.nl-ams.scw.cloud/njkonl/gitgov:<version>
kubectl apply -f deployment.yaml
```

# Run locally
```
npm install
npm run build
# run locally
node dist/server.js
```
