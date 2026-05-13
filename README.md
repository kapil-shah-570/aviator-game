git clone https://github.com/kapil-shah-570/aviator-game
cd aviator-game

cd frontend
npm install

cd backend
npm install


backend .env file

PORT=5000
MONGO_URI=mongodb+srv://aviator-game:aviatorgame12345@cluster0.8f0df4j.mongodb.net/?appName=Cluster0
JWT_SECRET=ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
REDIS_URL=redis://default:v45qcNgaEQJVu8sLhGnn1ZdtDHQ7qklO@redis-10787.crce263.ap-south-1-1.ec2.cloud.redislabs.com:10787
ADMIN_SECRET=admin12345
NODE_ENV=development
FRONTEND_URL=http://localhost:3000



frontend .env file 
BACKEND_URL=http://localhost:5000
