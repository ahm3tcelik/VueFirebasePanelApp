# Vue Firebase Panel App

Firebase Admin Panel using Vue.js (vuex,  vuetify, vuefire)

## Features
- Dark / Light Theme
- Vuetify Material Design
- Vuex State Management
- Firebase CRUD Operations
- Firebase Cloud Firestore, Storage and Authentication synced

## Screenshots
![](https://github.com/ahm3tcelik/VueFirebasePanelApp/blob/master/dashboard.png) 
![](https://github.com/ahm3tcelik/VueFirebasePanelApp/blob/master/dashboard_dark.png)

## Demo 
- URL: https://fire-panel.web.app
- Email: demo@firepanel.web.app
- Password: demo123

## Firebase Customization
Enter your project configuration settings in [src/main.js](https://github.com/ahm3tcelik/VueFirebasePanelApp/blob/master/src/main.js)

```javascript
const configOptions = {
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  databaseURL: "DATABASE_URL",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER_ID",
  appId: "APP_ID"
};
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
