# kampus
* grep for 'TODO's for some stuff

## backend
```sh
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors nodemailer multer
```
### manually create admin user
```sh
mongosh
use campus_platform
db.users.updateOne({ email: "admin@<uni>.edu.tr" }, { $set: { rol: "yonetici" } })
```
## frontend
```sh
cd frontend
npm create vite@latest . -- --template react
npm install axios react-router-dom
# to restart vite server:
npm run dev  # -- --port 5173  # check out vite.config.js
```
### running everything together - windows
```sh
# mongodb looks for /data/db dir by default
# either override it with `mongod --dbpath "C:\mongodb\data"` or create the dir.
mkdir -p "C:\data\db" # default dir for mongodb

mongod # mongodb starts listening to port:27017 

cd ./backend # pwd needs to be backend for .env file
node ./src/app.js 

# build frontend
cd ./frontend
npm run build

# serve frontend with Caddy and route requests to Node backend
caddy run --config Caddyfile

```