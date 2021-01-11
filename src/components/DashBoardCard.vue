<template>
    <v-card :color="color" elevation="15" outlined>
        <v-card-title>
            <v-icon color="white" large left>{{ icon }}</v-icon>
            <span class="white--text">{{ data }}</span>
        </v-card-title>
        <v-card-subtitle class="white--text">
            {{ title }}
        </v-card-subtitle>
    </v-card>
</template>

<script>
export default {
    props: {
        title: String,
        color: String,
        data: Number,
        icon: String
    }
}
</script>