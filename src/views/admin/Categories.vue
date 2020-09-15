<template>
  <div>
    <v-data-table :headers="headers" :items="categori"  :search="search" class="elevation-1" 
  :loading="loading" loading-text="Loading... Please wait">
    <template v-slot:top>

      <v-toolbar flat>
        <v-toolbar-title>Categories</v-toolbar-title>
        <v-divider class="mx-4" inset vertical /> 
        <v-spacer />

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" >New Category</v-btn>
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
                    <v-text-field :disabled="loading" :rules="titleRule" v-model="editedItem.title" label="Category Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <input type="file" class="d-none" ref="uploader" accept="image/*" @change="selectFile()">
                    <v-text-field :rules="imageRule" :disabled="loading" v-model="editedItem.image" label="Category Image Url" prepend-icon="mdi-image" @click:prepend="$refs.uploader.click()">
                    </v-text-field>
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

    <template v-slot:[`item.image`]="{ value }">
      <a :href="value" target="_blank">
        {{ value | truncate(20, '...') }}
        <span class="mdi mdi-open-in-new"></span>
      </a>
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
      >
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
import { firestore, storage } from 'firebase';
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
          text: "Category Name",
          align: "start",
          sortable: true,
          value: "title",
        },
        { text: "Category Image URL", value: "image" },
        { text: "Actions", value: "actions", sortable: true },
      ],
      categories: [],
      editedIndex: -1,
      editedItem: {
        title: "",
        image: "",
      },
      defaultItem: {
        title: "",
        image: "",
      },
      titleRule: [
        v => !!v || 'Category name is required',
      ],
      imageRule: [
        v => /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(v) || 'Image link must be valid',
      ]
    };
  },
  computed: {
    ...mapActions({
        loadCategories: 'categories/loadCategories'
    }),
    ...mapGetters({
        categori: 'categories/getCategories'
    }),
    formTitle() {
      return this.editedIndex === -1 ? "New Category" : "Edit Category";
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
    async initialize() {
        this.loading = true;
        await this.loadCategories;
        this.loading = false;
      /*
      this.loading = true;
      firestore()
        .collection("Categories")
        .get()
        .then((querySnapshot) => {
          this.categories = querySnapshot.docs.map(function (doc) {
            let category = doc.data();
            category["id"] = doc.id;
            return category;
          });
          //this.categories = querySnapshot.docs.map(doc => doc.data())
          this.loading = false;
        });
        */
    },
    selectFile() {
      let file = this.$refs.uploader.files[0];
      if (file != null && file.name) {
        this.loading = true;
        let ref = storage()
          .ref()
          .child("category_images/" + file.name);
        let vm = this;
        ref.put(file).then((snapshot) => {
          this.loading = false;
          if (snapshot.state == "success") {
            console.log("Uploaded a blob or file!");
            console.log(snapshot);
            snapshot.ref.getDownloadURL().then(function (downloadURL) {
              console.log("File available at", downloadURL);
              vm.editedItem.image = downloadURL;
            });
          } else {
            alert("Failed");
          }
          file = null;
        });
      } else {
        console.log("yok");
      }
    },
    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.loading = true;
      const index = this.categories.indexOf(item);
      let vm = this;
      if (confirm("Are you sure you want to delete this item?")) {
        firestore()
          .collection("Categories")
          .doc(item.id)
          .delete()
          .then(() => {
            this.loading = false;
            vm.categories.splice(index, 1);

            vm.snack = true
            vm.snackColor = 'success'
            vm.snackText = 'Category deleted'
          })
          .catch((error) => {
            this.loading = false;
            
            vm.snack = true
            vm.snackColor = 'error'
            vm.snackText = error;
          });
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

    save() {
      if(!this.$refs.dialogForm.validate()) return;
      let vm = this;
      if (this.editedIndex > -1) {
        //update data from firestore

        this.loading = true;
        firestore()
          .collection('Categories')
          .doc(vm.editedItem.id)
          .set(vm.editedItem)
          .then(() => {
            this.loading = false;
            Object.assign(vm.categories[vm.editedIndex], vm.editedItem);

            vm.snack = true
            vm.snackColor = 'success'
            vm.snackText = 'Category updated'

            vm.close();
          })
          .catch(() => {
            this.loading = false;
            vm.close();
          });
      } else {

        // create data from firestore

        this.loading = true;
        const vm = this;
        firestore()
          .collection('Categories')
          .add(vm.editedItem)
          .then((docRef) => {
            this.loading = false;
            vm.editedItem.id = docRef.id;
            console.log(vm.editedItem.id);
            console.log(vm.editedItem);
            console.log(vm.categories);
            vm.categories.push(vm.editedItem);
            vm.snack = true
            vm.snackColor = 'success'
            vm.snackText = 'Category added'
            vm.close();
          })
          .catch((error) => {
            this.loading = false;
            this.snack = true
            this.snackColor = 'error'
            this.snackText = error; 

            vm.close();
          });
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