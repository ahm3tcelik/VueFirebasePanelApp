import { firestore } from 'firebase';

const collName = 'Categories';

const categories = {
    namespaced: true,
    state: {
        categories: [],
    },
    getters: {
        getCategories: (state) => {
            return state.categories;
        }
    },
    mutations: {
        SET_CATEGORIES(state, categories) {
            state.categories = categories;
        },
        ADD_CATEGORY(state, category) {
            state.categories.push(category);
        },
        UPDATE_CATEGORY(state, payload) {
            Object.assign(state.categories[payload.index], payload.category);
        },
        REMOVE_CATEGORY(state, category) {
            const index = state.categories.indexOf(category);
            state.categories.splice(index, 1);
        }
    },
    actions: {
        async addCategory({commit}, category) {
            const docRef = await firestore().collection(collName).add(category);
            category.id = docRef.id;
            commit('ADD_CATEGORY', category);
        },
        async loadCategories({commit}) {
            const querySnapshot = await firestore().collection(collName).get();
            let category;
            let categories = querySnapshot.docs.map(function (doc) {
                category = doc.data();
                category.id = doc.id;
                return category;
            });
            commit('SET_CATEGORIES', categories);
        },
        async updateCategory({commit}, payload) {
            await firestore().collection(collName).doc(payload.category.id).set(payload.category);
            commit('UPDATE_CATEGORY', payload);
        },
        async removeCategory({commit}, category) {
            await firestore().collection(collName).doc(category.id).delete();
            commit('REMOVE_CATEGORY', category);
        }
    }
}

export default categories;