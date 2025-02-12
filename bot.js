const venom = require('venom-bot');
const axios = require('axios');
const mysql = require('mysql2/promise');
const config = require('./config');

async function connectToDatabase(retries = 5) {
  while (retries > 0) {
    try {
      console.log("⏳ Intentando conectar a MySQL...");
      const connection = await mysql.createConnection(config.db);
      console.log("✅ Conexión exitosa a MySQL.");
      return connection;
    } catch (error) {
      console.error("❌ Error de conexión a MySQL:", error.message);
      retries--;
      if (retries > 0) {
        console.log(`🔄 Reintentando en 5 segundos... (${retries} intentos restantes)`);
        await new Promise(res => setTimeout(res, 5000));
      } else {
        console.log("⛔ No se pudo conectar a MySQL después de varios intentos.");
        process.exit(1);
      }
    }
  }
}

async function startBot() {
  const connection = await connectToDatabase();
  const sessionName = 'whatsapp-session';

  venom
  .create({
    session: 'whatsapp-session',
    multidevice: true,
    headless: true, // Asegura que Puppeteer corra sin interfaz gráfica
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--disable-software-rasterizer', // Ayuda en entornos limitados
      '--disable-features=site-per-process',
      '--disable-web-security'
    ]
  })
  .then(client => {
    console.log("✅ Bot de WhatsApp iniciado correctamente");

      client.onMessage(async message => {
        if (message.body.startsWith('/cod ')) {
          const correo = message.body.split(' ')[1];
          if (!correo || !correo.includes('@')) {
            client.sendText(message.from, '⚠️ Formato incorrecto. Usa: /cod correo@gmail.com');
            return;
          }

          try {
            const apiUrl = `https://script.google.com/macros/s/AKfycbymWzWk196Xi6ayjvnKbWOilSOCcR7UBGq-a2Af4AF-eyNMNwSkPB6fbDCqlapSHMF9xQ/exec?email=${encodeURIComponent(correo)}`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data.mensaje) {
              client.sendText(message.from, `📌 Respuesta de la API:\n${data.mensaje}`);
            } else {
              client.sendText(message.from, '❌ No se encontró información para este correo.');
            }
          } catch (error) {
            client.sendText(message.from, '⚠️ Hubo un error al buscar la información.');
            console.error(error);
          }
        }
      });
    })
    .catch(error => console.log('❌ Error al iniciar bot:', error));
}

startBot();

