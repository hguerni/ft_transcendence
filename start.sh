cd front && rm -rf package-lock.json node_modules && npm i
cd ../back && rm -rf package-lock.json node_modules && npm i
docker system prune -a && docker compose up --build