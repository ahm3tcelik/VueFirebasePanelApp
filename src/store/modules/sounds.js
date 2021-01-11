import { firestore } from 'firebase';

const collName = 'Sounds';

const sounds = {
    namespaced: true,
    state: {
        sounds: [],
    },
    getters: {
        getSounds: (state) => {
            return state.sounds;
        }
    },
    mutations: {
        SET_SOUNDS(state, sounds) {
            state.sounds = sounds;
        },
        ADD_SOUND(state, sound) {
            state.sounds.push(sound);
        },
        UPDATE_SOUND(state, payload) {
            Object.assign(state.sounds[payload.index], payload.sound);
        },
        REMOVE_SOUND(state, sound) {
            const index = state.sounds.indexOf(sound);
            state.sounds.splice(index, 1);
        }
    },
    actions: {
        async addSound({commit}, sound) {
            const docRef = await firestore().collection(collName).add(sound);
            sound.id = docRef.id;
            commit('ADD_SOUND', sound);
        },
        async loadSounds({commit}) {
            const querySnapshot = await firestore().collection(collName).get();
            let sound;
            let sounds = querySnapshot.docs.map(function (doc) {
                sound = doc.data();
                sound.id = doc.id;
                return sound;
            });
            commit('SET_SOUNDS', sounds);
        },
        async updateSound({commit}, payload) {
            await firestore().collection(collName).doc(payload.sound.id).set(payload.sound);
            commit('UPDATE_SOUND', payload);
        },
        async removeSound({commit}, sound) {
            await firestore().collection(collName).doc(sound.id).delete();
            commit('REMOVE_SOUND', sound);
        }
    }
}

export default sounds;