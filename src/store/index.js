import Vue from "vue";
import Vuex from "vuex";
import Notes from "./notes";
import Tags from "./tags";
import Ui from "./ui";
import Roles from "./roles";
import Access from "./access";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true, // Make sure to remove on production
  modules: {
    Notes,
    Tags,
    Ui,
    Roles,
    Access
  }
});
