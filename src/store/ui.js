export default {
  namespaced: true,
  state: () => ({
    snackbar: {
      status: false,
      message: ""
    },
    init: false
  }),
  mutations: {
    SNACKBAR_TOGGLE(state, newState) {
      if (undefined !== newState) {
        state.snackbar.status = Boolean(newState);
        return;
      }
      state.snackbar.status = !state.snackbar.status;
    },
    SNACKBAR_CHANGE_MESSAGE(state, message) {
      state.snackbar.message = message;
    },
    TOGGLE_INIT(state) {
      state.init = !state.init;
    }
  },
  actions: {
    showSnackbar({ commit }, payload) {
      commit("SNACKBAR_TOGGLE", false);
      commit("SNACKBAR_CHANGE_MESSAGE", payload.message);
      commit("SNACKBAR_TOGGLE", true);
    },
    toggleSnackbar({ commit }, newState) {
      commit("SNACKBAR_TOGGLE", newState);
    },
    initGlobalData({ commit, dispatch, state, rootGetters }) {
      if (rootGetters["Access/isAuth"] && !state.init) {
        dispatch("Notes/listNotes", null, { root: true });
        dispatch("Tags/listTags", null, { root: true });
        commit("TOGGLE_INIT");
      }
    },
    clearGlobalData({ commit, dispatch, state }) {
      dispatch("Notes/clearState", null, { root: true });
      dispatch("Tags/clearState", null, { root: true });
      dispatch("Roles/clearState", null, { root: true });
      if (state.init) {
        commit("TOGGLE_INIT");
      }
    }
  },
  getters: {
    snackbarMessage: state => {
      return state.snackbar.message;
    }
  }
};
