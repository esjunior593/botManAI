# Bot de WhatsApp con Venom y MySQL en Railway

## 🚀 Instalación y Configuración

### 1️⃣ Instalar dependencias
Ejecuta el siguiente comando para instalar las dependencias:

```sh
npm install
```

### 2️⃣ Configurar variables de entorno en Railway
Entra a **Railway > Variables de entorno** y agrega:

- `DB_HOST` = tu_host_mysql
- `DB_USER` = tu_usuario_mysql
- `DB_PASSWORD` = tu_password_mysql
- `DB_NAME` = tu_basededatos_mysql
- `DB_PORT` = tu_puerto_mysql

### 3️⃣ Desplegar en Railway
1. Sube los archivos a tu repositorio de GitHub.
2. Conéctalo a Railway.
3. Configura el comando de inicio en Railway:

```sh
node bot.js
```

4. Escanea el código QR una vez. La sesión quedará guardada.

### 4️⃣ Uso del bot
Envía en WhatsApp:

```
/cod correo@gmail.com
```

El bot buscará los datos en la API y responderá automáticamente.

✅ **Listo! Ahora el bot estará activo 24/7.** 🚀
