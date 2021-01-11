<template>
    <div>
        <v-row>
            <v-col cols="6">
                <DashBoardCard :title="'Number of Sounds'" color="primary" :data="sounds.length" 
                :icon="'mdi-playlist-music'" />
            </v-col>
            <v-col cols="6">
                <DashBoardCard :title="'Number of Category'" color="error" :data="categories.length"
                :icon = "'mdi-folder-multiple'" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">

                <v-simple-table class="elevation-4">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>Number of Sounds per Category</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical/> 
                            <v-spacer />
                        </v-toolbar>
                    </template>
                    <template v-slot:default>
                        <thead>
                            <tr>
                            <th class="text-left">Category Name</th>
                            <th class="text-left">Number of Sounds</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(group, category_id) in groups" :key="category_id">
                            <td>{{ getCategoryById(category_id).title }}</td>
                            <td>{{ group.length }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
            <!--
            <div v-for="(group, category_id) in groups" :key="category_id">
                <h2>{{ getCategoryById(category_id).title }}</h2>
                <p>{{ group.length }}</p>
            </div>
            -->
        </v-row>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DashBoardCard from '../../components/DashBoardCard';


function groupBy(array, key){
  const result = {}
  array.forEach(item => {
    if (!result[item[key]]){
      result[item[key]] = []
    }
    result[item[key]].push(item)
  })
  return result
}

export default {
    data() {
        return { }
    },
    components: {
        DashBoardCard
    },
    created() {
        this.loadCategories;
        this.sounds;
    },
    methods: {
        getCategoryById: function(id) {
            let category = this.categories.filter(c => c.id == id)[0];
            if(category === undefined) {
                console.log('undefined qarşim');
                return {title: 'Unknown'};
            }
            return category;
        }
    },
    computed: {
        ...mapActions({
            loadCategories: 'categories/loadCategories',
            loadSounds: 'sounds/loadSounds'
        }),
        ...mapGetters({
            categories: 'categories/getCategories',
            sounds: 'sounds/getSounds'
        }),
        groups(){
            return groupBy(this.sounds, 'category_id')
        }
    }
}

</script>
