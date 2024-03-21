Iniciar nest: npm run start:dev
Iniciar docker: docker compose up -d
con -d conseguimos tenerlo en docker desktop

# Backend en nest

docker compose up -d
copiar el `.env.template`y renombrarlo a `.env`

# Variables de entorno

npm i @nestjs/config
agregar en app.module.ts -> ConfigModule.forRoot()
