# GitGov Update Tool

Receives emails from gov.uk and updates the [https://github.com/platy/gitgovuk] repo.

# Deploy

```bash
npm install
npm run build
# run locally
node dist/server.js
# or copy to server /var/gitgov/lib and
pm2 start /var/gitgov/lib/ecosystem.config.js --env production
```
