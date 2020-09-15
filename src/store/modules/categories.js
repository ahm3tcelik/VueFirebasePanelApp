import { firestore } from 'firebase';

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
        }
    },
    actions: {
        async loadCategories({commit}) {
            const querySnapshot = await firestore().collection('Categories').get();
            let category;
            let categories = querySnapshot.docs.map(function (doc) {
                category = doc.data();
                category.id = doc.id;
                return category;
            });
            commit('SET_CATEGORIES', categories);
            /*
                .then(querySnapshot => {
                    let categories = querySnapshot.docs.map(function (doc) {
                        let category = doc.data();
                        category.id = doc.id;
                        return category;
                    });
                    commit('SET_CATEGORIES', categories);
                })
                .catch(error => console.log(error));
                */
        }
    }
}

export default categories;