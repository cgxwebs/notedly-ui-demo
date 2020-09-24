import NotesApi from "@/services/NotesApi";
import AccessManager from "@/services/AccessManager";

export default {
  namespaced: true,
  state: () => ({
    token: "",
    currentRole: {}
  }),
  mutations: {
    AUTHENTICATE_ROLE(state, role) {
      state.currentRole = role;
    },
    AUTHENTICATE_TOKEN(state, token) {
      state.token = token;
    },
    CLEAR_STATE(state) {
      state.token = "";
      state.currentRole = {};
    }
  },
  actions: {
    login({ dispatch }, payload) {
      return NotesApi.login(payload).then(async response => {
        const token = response.data.token;
        const role_id = response.data.authenticated.id;
        await dispatch("authenticate", token);
        await dispatch("loadCurrentRole");
        await dispatch("Ui/initGlobalData", null, { root: true });
        AccessManager.createCookies({ token, role_id });
      });
    },
    authenticate({ commit }, token) {
      if (token.length > 32) {
        AccessManager.setAuthTokenOnApi(token);
        commit("AUTHENTICATE_TOKEN", token);
      }
    },
    async loadCurrentRole({ commit }) {
      return await NotesApi.getAuthenticatedRole()
        .then(response => {
          commit("AUTHENTICATE_ROLE", response.data.data.role);
        })
        .catch(() => {
          AccessManager.removeAuthTokenOnApi();
        });
    },
    logout({ commit, dispatch }) {
      AccessManager.destroyCookies();
      AccessManager.removeAuthTokenOnApi();
      commit("CLEAR_STATE");
      dispatch("Ui/clearGlobalData", null, { root: true });
    },
    clearState({ commit }) {
      commit("CLEAR_STATE");
    }
  },
  getters: {
    isAuth: state => {
      return state.token.length > 32;
    },
    isSuper: state => {
      if (state.currentRole.isSuper !== undefined) {
        return state.currentRole.isSuper;
      }
      return false;
    }
  }
};
