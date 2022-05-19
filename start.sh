RED='\033[0;31m'
NC='\033[0m' # No Color

echo  "${RED} Npm install dans le front"
cd front && npm i
echo  "${RED} Npm install dans le back"
cd ../back && npm i
echo  "${RED}Build"${NC}
docker system prune -f && docker compose up --build
