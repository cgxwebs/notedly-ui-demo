import NotesApi from "@/services/NotesApi";
import $store from "@/store";
import $router from "@/router";

const authKeys = {
  AUTH_TOKEN: "AUTH_TOKEN"
};

const AccessManager = {
  authKeys,
  getCookies() {
    let data = {};
    data[authKeys.AUTH_TOKEN] = window.$cookies.get(authKeys.AUTH_TOKEN);
    return data;
  },
  createCookies(cookieData) {
    window.$cookies.set(
      authKeys.AUTH_TOKEN,
      cookieData[authKeys.AUTH_TOKEN] ?? cookieData["token"]
    );
  },
  destroyCookies() {
    window.$cookies.remove(authKeys.AUTH_TOKEN);
  },
  setAuthTokenOnApi(token) {
    NotesApi.instance.defaults.headers.common["Authorization"] =
      "Bearer " + token;
  },
  removeAuthTokenOnApi() {
    NotesApi.instance.defaults.headers.common["Authorization"] = "";
  },
  initInterceptor() {
    NotesApi.instance.interceptors.response.use(undefined, function(err) {
      return new Promise(() => {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          $store.dispatch("Access/logout");
          $router.push("/").catch(() => {});
        }
        throw err;
      });
    });
  }
};

export default AccessManager;
