<template>
  <v-navigation-drawer
    v-model="drawerModel"
    class="elevation-24"
    width="512"
    dark
    app
    temporary
  >
    <template v-slot:prepend>
      <v-list class="grey darken-4">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/lego/1.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="title blue--text"
              >Noted.ly</v-list-item-title
            >
            <v-list-item-subtitle>
              Logged as {{ $store.state.Access.currentRole.username }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <template v-if="$store.getters['Access/isSuper']">
      <v-list dense class="">
        <v-list-item-group>
          <v-list-item
            v-for="item in main_nav"
            :key="item.title"
            @click="
              drawerModel = false;
              redirectTo(item.route);
            "
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-divider></v-divider>
    </template>

    <v-list dense>
      <v-list-item-group>
        <v-list-item
          two-line
          v-for="item in notesBucket"
          :key="item.id"
          @click="
            drawerModel = false;
            redirectTo('NoteEditor', { id: item.id });
          "
        >
          <v-list-item-content>
            <v-list-item-title
              class="blue-grey--text text--lighten-3 text-subtitle-1 py-1"
              >{{ item.title }}</v-list-item-title
            >
            <v-list-item-subtitle class="">
              {{ item.author.username }} ({{
                item.formattedDates.updatedAt_human
              }})
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="notesBucket.length === 0">
          <v-list-item-content>
            <v-list-item-subtitle>
              No notes yet :(
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <div class="py-5 px-2">
      <v-btn
        :disabled="!$store.state.Notes.prev_key"
        @click="$store.dispatch('Notes/listNotes', 'PREV')"
        small
        text
        >Prev</v-btn
      >

      <v-btn
        :disabled="!$store.state.Notes.next_key"
        @click="$store.dispatch('Notes/listNotes', 'NEXT')"
        small
        text
        >Next</v-btn
      >
    </div>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          @click="
            $emit('trigger-logout');
            drawerModel = false;
          "
          block
          >Logout</v-btn
        >
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import RouterHelper from "@/mixins/RouterHelper";

export default {
  name: "Navigation",
  mixins: [RouterHelper],
  props: {
    toggledNavDrawer: Boolean
  },
  data: () => ({
    drawerModel: false,
    main_nav: [
      { title: "Tags", icon: "mdi-tag-text", route: "TagEditor" },
      { title: "Roles", icon: "mdi-account-multiple", route: "RoleEditor" }
    ]
  }),
  computed: {
    notesBucket() {
      return this.$store.state.Notes.bucket;
    }
  },
  watch: {
    toggledNavDrawer() {
      this.drawerModel = !this.drawerModel;
    }
  }
};
</script>
