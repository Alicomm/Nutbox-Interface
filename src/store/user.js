export default {
    namespaced: true,
    state: {
        users: null,
        // loading all users from backend
        loadingUsers: false
    },
    getters: {
        getUserByAddress: state => (address) => {
            return state.users[address]
        }
    },
    mutations: {
        saveUsers(state, users) {
            state.users = users
        },
        saveLoadingUsers(state, loadingUsers) {
            state.loadingUsers = loadingUsers
        }
    }
}