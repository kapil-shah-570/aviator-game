git clone https://github.com/kapil-shah-570/aviator-game
cd aviator-game

cd frontend
npm install

cd backend
npm install


backend .env file

PORT=5000
MONGO_URI=add mongodb url(mongodb compass or mongodb atlas)
JWT_SECRET=ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
REDIS_URL= add redis url (cloud or local)
ADMIN_SECRET=admin12345
NODE_ENV=development
FRONTEND_URL=http://localhost:3000



frontend .env file 
BACKEND_URL=http://localhost:5000
