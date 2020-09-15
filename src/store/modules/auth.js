const auth = {
    namespaced: true,
    state: {
        user: {
            loggedIn: false,
            data: null
        }
    },
    getters: {
        user: (state) => {
            return state.user;
        }
    },
    mutations: {
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
        }
    },
    actions: {
        fetchUser({commit}, user) {
            commit('SET_LOGGED_IN', user !== null);
            if(user) {
                commit('SET_USER', user);
            } 
            else {
                commit('SET_USER', null);
            }
        }
    }
}

export default auth;