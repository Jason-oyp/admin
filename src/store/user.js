export default {
    namespaced: true,
    state: {
        username: '',
        userId: null
    },
    mutations: {
        setUsername(state, payload) {
            state.username = payload;
        },
        setUserId(state, payload) {
            state.userId = payload;
        }
    }
}