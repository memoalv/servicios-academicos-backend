# servicios-academicos-backend

### Instalación de dependencias del proyecto
```
npm install
```
### Archivo .env de ejemplo
```
APP_SECRET=

DB_HOST=127.0.0.1
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

PAGINATION_LIMIT=50

SEND_GRID_KEY=
```

### Comando para iniciar servidor de desarrollo
```
npm run serve
```

### Comando para correr migraciones
> **NOTA:** para correr las migraciones hay que tener una conexión funcionando a una instancia de mariaDB y especificarla en el archivo `.env`

```
npm run db-migrate
```

### Comando para correr los *seeders*
```
npm run db-seed
```

> Con el comando `npx sequelize-cli` puedes ver todos los comandos disponibles del CLI de sequelize
