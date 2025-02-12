module.exports = {
  db: {
    host: process.env.DB_HOST || 'tu_host_mysql',
    user: process.env.DB_USER || 'tu_usuario_mysql',
    password: process.env.DB_PASSWORD || 'tu_password_mysql',
    database: process.env.DB_NAME || 'tu_basededatos_mysql',
    port: process.env.DB_PORT || 3306, // Cambia el puerto si es necesario
  }
};
