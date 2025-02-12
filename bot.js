const venom = require('venom-bot');
const axios = require('axios');
const mysql = require('mysql2/promise');
const config = require('./config');

async function saveSession(sessionName, sessionData) {
  const connection = await mysql.createConnection(config.db);
  await connection.execute(
    `INSERT INTO whatsapp_sessions (session_name, session_data) 
     VALUES (?, ?) 
     ON DUPLICATE KEY UPDATE session_data = ?`,
    [sessionName, JSON.stringify(sessionData), JSON.stringify(sessionData)]
  );
  await connection.end();
}

async function loadSession(sessionName) {
  const connection = await mysql.createConnection(config.db);
  const [rows] = await connection.execute(
    `SELECT session_data FROM whatsapp_sessions WHERE session_name = ?`,
    [sessionName]
  );
  await connection.end();
  return rows.length > 0 ? JSON.parse(rows[0].session_data) : null;
}

async function startBot() {
  const sessionName = 'whatsapp-session';
  const storedSession = await loadSession(sessionName);

  venom
    .create({
      session: sessionName,
      multidevice: true,
      sessionData: storedSession || undefined,
    })
    .then(async (client) => {
      console.log('✅ Bot de WhatsApp iniciado correctamente');

      client.onMessage(async (message) => {
        if (message.body.startsWith('/cod ')) {
          const correo = message.body.split(' ')[1];

          if (!correo || !correo.includes('@')) {
            client.sendText(message.from, '⚠️ Formato incorrecto. Usa: /cod correo@gmail.com');
            return;
          }

          try {
            // Construimos la URL con el correo dinámico
            const apiUrl = `https://script.google.com/macros/s/AKfycbymWzWk196Xi6ayjvnKbWOilSOCcR7UBGq-a2Af4AF-eyNMNwSkPB6fbDCqlapSHMF9xQ/exec?email=${encodeURIComponent(correo)}`;

            // Llamamos a la API
            const response = await axios.get(apiUrl);
            const data = response.data;

            // Verificamos si la API responde con la variable "mensaje"
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

      // Guardar la sesión en MySQL cada vez que haya cambios
      client.onStateChange(async (state) => {
        console.log('🔄 Estado cambiado:', state);
        const sessionData = await client.getSessionTokenBrowser();
        await saveSession(sessionName, sessionData);
      });
    })
    .catch((error) => console.log('❌ Error al iniciar bot:', error));
}

startBot();
