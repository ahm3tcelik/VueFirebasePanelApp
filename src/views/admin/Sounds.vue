<template>
  <div>
    <v-data-table :headers="headers" :items="sounds"  :search="search" class="elevation-1" 
  :loading="loading" loading-text="Loading... Please wait">
    <template v-slot:top>

      <v-toolbar flat>
        <v-toolbar-title>Sounds</v-toolbar-title>
        <v-divider class="mx-4" inset vertical /> 
        <v-spacer />

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" >New Sound</v-btn>
          </template>
          <v-card>

            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form v-bind:disabled="loading" lazy-validation ref="dialogForm">
                  <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field :disabled="loading" :rules="titleRule" v-model="editedItem.title" label="Sound Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <input type="file" class="d-none" ref="uploader" accept=".mp3" @change="selectFile()">
                    <v-text-field :rules="soundRule" :disabled="loading" v-model="editedItem.sound" label="Sound Url" prepend-icon="mdi-music-box" @click:prepend="$refs.uploader.click()">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" sm="12" md="12">                    
                    <v-select :items="categories" :rules="categoryRule" v-model="editedItem.category_id" name="category" 
                    item-text="title" item-value="id" label="Select a category" solo ></v-select>
                  </v-col>

                </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="loading" color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn :disabled="loading" color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn text icon class="mb-2 ml-2" @click="initialize">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        
      </v-toolbar>
    </template>

    <template v-slot:[`item.sound`]="{ value }">
      <a :href="value" target="_blank">
        {{ value | truncate(20, '...') }}
        <span class="mdi mdi-open-in-new"></span>
      </a>
    </template>

    <template v-slot:[`item.category_id`]="{ value }">
      {{ getCategoryById(value).title }}
    </template>


    <template v-slot:[`body.prepend`]="{ headers }">
        <tr class="mx-0 px-0">
          <td :colspan="headers.length" class="mx-0 px-0">
            <v-text-field  v-model="search" prepend-inner-icon="mdi-magnify" label="Search" single-line hide-details filled class="px-0 mx-0"/>
          </td>
        </tr>
    </template>

    <template  v-slot:[`item.actions`]="{ item }" >
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
        color="error">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>

  <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false">Close</v-btn>
      </template>
  </v-snackbar>
  </div>

</template>

<script>
import { storage } from 'firebase';
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      snack: false,
      snackColor: '',
      snackText: '',
      search: '',
      loading: true,
      dialog: false,
      headers: [
        {
          text: 'Sound Name',
          align: 'start',
          sortable: true,
          value: "title",
        },
        { text: 'Sound URL', value: 'sound' },
        { text: 'Category Name', value: 'category_id' },
        { text: "Actions", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        title: "",
        sound: "",
      },
      defaultItem: {
        title: "",
        sound: "",
      },
      titleRule: [
        v => !!v || 'Sound name is required',
      ],
      soundRule: [
        v => /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(v) || 'Sound link must be valid',
      ],
      categoryRule: [
        v => !!v || 'Category is required'
      ]
    };
  },
  computed: {
    ...mapActions({
        loadSounds: 'sounds/loadSounds',
        loadCategories: 'categories/loadCategories',
    }),
    ...mapGetters({
        sounds: 'sounds/getSounds',
        categories: 'categories/getCategories'
    }),
    formTitle() {
      return this.editedIndex === -1 ? "New Sound" : "Edit Sound";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();

  },
  methods: {
    ...mapActions({
      addSound: 'sounds/addSound',
      updateSound: 'sounds/updateSound',
      removeSound: 'sounds/removeSound'
    }),
    getCategoryById: function(id) {
      let category = this.categories.filter(c => c.id == id)[0];
      if(category === undefined) {
        console.log('undefined qarşim');
        return {title: 'Unknown'};
      }
      return category;
    },
    async initialize() {
        this.loading = true;
        try {
          await this.loadSounds;
          await this.loadCategories;
        } catch (e) {
          console.error(e);
        }
        this.loading = false;
    },
    selectFile() {
      let file = this.$refs.uploader.files[0];
      if (file != null && file.name) {
        this.loading = true;
        let ref = storage()
          .ref()
          .child("sounds/" + file.name);
        let vm = this;
        ref.put(file).then((snapshot) => {
          this.loading = false;
          if (snapshot.state == "success") {
            snapshot.ref.getDownloadURL().then(function (downloadURL) {
              vm.editedItem.sound = downloadURL;
            });
          } else {
            this.snack = true
            this.snackColor = 'error'
            this.snackText = 'File could not be uploaded'; 
          }
          file = null;
        });
      } 
      else {
        //müzik seçilmedi
      }
    },
    editItem(item) {
      this.editedIndex = this.sounds.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async deleteItem(item) {
      this.loading = true;
      if (confirm("Are you sure you want to delete this item?")) {
        this.loading = true;
        try {
          await this.removeSound(item);
          storage().refFromURL(item.sound).delete();
          this.loading = false;

          this.snack = true;
          this.snackColor = 'success';
          this.snackText = 'Sound has been deleted';

        } catch (e) {
          this.loading = false;

          this.snack = true
          this.snackColor = 'error'
          this.snackText = 'Sound could not be deleted'

          console.error(e);
        }
      } else {
        this.loading = false;
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if(!this.$refs.dialogForm.validate()) return;
      
      if (this.editedIndex > -1) {
        this.loading = true;
        try {
          await this.updateSound({index: this.editedIndex, sound: this.editedItem});
          this.loading = false;
          this.close();

          this.snack = true
          this.snackColor = 'success'
          this.snackText = 'Sound has been updated'

        } catch (e) {
          this.loading = false;
          this.close();

          this.snack = true
          this.snackColor = 'error'
          this.snackText = 'Sound could not be updated'

          console.error(e);  
        }
      } 
      else {
        this.loading = true;
        try {
          await this.addSound(this.editedItem);
          this.loading = false;
          this.close();

          this.snack = true
          this.snackColor = 'success'
          this.snackText = 'Sound has been added'

        } catch (e) {
          this.loading = false;
          this.close();

          this.snack = true
          this.snackColor = 'error'
          this.snackText = 'Sound could not be created'

          console.error(e);
        }
      }
    },
  },
  filters: {
        truncate: function (text, length, suffix) {
            if (text.length > length) {
                return text.substring(0, length) + suffix;
            } else {
                return text;
            }
        },
    }
};
</script>