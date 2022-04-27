cd front && npm i
cd ../back && npm i
docker system prune -a && docker compose up --build