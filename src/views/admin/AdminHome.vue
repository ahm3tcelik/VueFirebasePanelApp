<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item-group color="primary">
          <v-list-item v-for="(menu, index) in menus" :key="index" @click="goto(menu.path)">
            <v-list-item-action>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left dark color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer />
      <v-btn text icon @click="dark = !dark">
        <v-icon>{{ dark ? 'mdi-brightness-4' : 'mdi-brightness-6'}}</v-icon>
      </v-btn>
      <v-btn text icon @click="logOut()"><v-icon>mdi-power</v-icon></v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      <div class="flex text-center">
        <span class="lead text--secondary text-center" >Software & Design ❤️
          <a href="https://ahm3tcelik.github.io" class="text-decoration-none" target="_blank">Ahmet ÇELİK</a>
        </span>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from 'firebase';

export default {
  data: () => ({
    dark: false,
    path: '/admin',
    drawer: null,
    menus: [
      { path: '', title: 'Dashboard', icon: 'mdi-view-dashboard' },
      { path: '/categories', title: 'Categories', icon: 'mdi-folder-multiple' },
    ]
  }),
  created() {
    this.dark = this.$vuetify.theme.dark
  },
  methods: {
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({path: '/'});
        });
    },
    goto(newPath) {
      this.$router.push({path: this.path + newPath});
    }
  },
  watch: {
    dark: function() {
      this.$vuetify.theme.dark = this.dark;
    }
  }
}
</script>