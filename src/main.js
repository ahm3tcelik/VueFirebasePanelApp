import Vue from 'vue';
import App from './App.vue';
import * as firebase from 'firebase';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { firestorePlugin } from 'vuefire'


Vue.config.productionTip = false;

Vue.use(firestorePlugin);

const configOptions = {
  apiKey: "AIzaSyBcSNX_ThLdRBd65cTeMS83jWNw7vJfo9g",
  authDomain: "fire-panel.firebaseapp.com",
  databaseURL: "https://fire-panel.firebaseio.com",
  projectId: "fire-panel",
  storageBucket: "fire-panel.appspot.com",
  messagingSenderId: "506919428842",
  appId: "1:506919428842:web:46540205a6d2c150d32d93"
};

firebase.initializeApp(configOptions);

let app;

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("auth/fetchUser", user);
  if(!app) {
    new Vue({
      store,
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app');
  }
});
