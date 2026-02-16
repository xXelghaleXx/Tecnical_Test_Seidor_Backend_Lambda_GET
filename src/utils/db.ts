import mysql from 'mysql2/promise';

// Creamos un Pool de conexiones para que la Lambda sea más eficiente
export const pool = mysql.createPool({
  host: process.env.DB_HOST,        // Lee del .env
  user: process.env.DB_USER,        // Lee del .env
  password: process.env.DB_PASSWORD, // Lee del .env
  database: process.env.DB_NAME,     // Lee del .env
  port: 3306,                        // Puerto estándar de MariaDB
  waitForConnections: true,
  connectionLimit: 5,                // Límite bajo para no saturar RDS desde Lambdas
  queueLimit: 0,
  connectTimeout: 10000,             // 10 segundos de timeout para conectar
  ssl: {
    rejectUnauthorized: false        // Obligatorio para conectar con AWS RDS
  }
});

// Logging de configuración (sin mostrar password)
console.log('[DB] Pool configurado:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  connectionLimit: 5
});