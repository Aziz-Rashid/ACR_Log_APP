const withPWA = require('next-pwa');

module.exports = withPWA({
  env: {
    ADMIN_EMAILS: [
      'marian.bucuresteanu.hs@gmail.com',
      'doggrstyle@gmail.com',
      'adirom28@gmail.com',
      'axixraxhid@gmail.com',
    ],
    FIREBASE_API_KEY: 'AIzaSyCAfy_6tVkGat9sBRKMLBgOqyP5rIFZVpU',
    AUTH_DOMAIN: 'niii-fba77.firebaseapp.com.xyz',
    DB_URL: 'https//freight-manager-app.firebaseio.com',
    PROJECT_ID: 'niii-fba77',
    STORAGE_BUCKET: 'niii-fba77.appspot.com',
    SENDER_ID: 143969709978,
    APP_ID: '1:143969709978:web:57ae8d66bbe389dfe59423',
  },
  pwa: {
    dest: 'public',
  },
});
