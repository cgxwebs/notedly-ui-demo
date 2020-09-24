import Vue from "vue";
import VueRouter from "vue-router";
import TagEditor from "@/pages/TagEditor";
import RoleEditor from "@/pages/RoleEditor";
import NoteEditor from "@/pages/NoteEditor";
import Welcome from "@/pages/Welcome";
import Unauthorized from "@/pages/Unauthorized";
import $store from "@/store";
import AccessManager from "@/services/AccessManager";
import NotFound from "@/pages/NotFound";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    meta: {
      anonymous: true,
      super_role: false
    }
  },
  {
    path: "/denied",
    name: "Denied",
    component: Unauthorized,
    meta: {
      anonymous: true,
      super_role: false
    }
  },
  {
    path: "/note-editor/:id?",
    name: "NoteEditor",
    component: NoteEditor,
    meta: {
      anonymous: false,
      super_role: false
    }
  },
  {
    path: "/note-editor/:id/revision/:revision_id",
    name: "RevisionPreview",
    component: NoteEditor,
    meta: {
      anonymous: false,
      super_role: false
    }
  },
  {
    path: "/tag-editor",
    name: "TagEditor",
    component: TagEditor,
    meta: {
      anonymous: false,
      super_role: true
    }
  },
  {
    path: "/role-editor",
    name: "RoleEditor",
    component: RoleEditor,
    meta: {
      anonymous: false,
      super_role: true
    }
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
    meta: {
      anonymous: true,
      super_role: false
    }
  },
  {
    path: "*",
    name: "CatchAll",
    component: NotFound,
    meta: {
      anonymous: true,
      super_role: false
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  const meta = to.meta;
  const authCookies = AccessManager.getCookies();

  if (authCookies[AccessManager.authKeys.AUTH_TOKEN]) {
    await $store.dispatch(
      "Access/authenticate",
      authCookies[AccessManager.authKeys.AUTH_TOKEN]
    );
  }

  if (!meta.anonymous) {
    if (!$store.getters["Access/isAuth"]) {
      next({ name: "Denied" });
      return;
    }

    await $store.dispatch("Access/loadCurrentRole");
    const user = $store.state.Access.currentRole;

    if (meta.super_role && !user.isSuper) {
      next({ name: "Denied" });
      return;
    }
  }

  $store.dispatch("Ui/initGlobalData");

  next();
});

export default router;
