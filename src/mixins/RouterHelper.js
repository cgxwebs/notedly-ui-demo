export default {
  methods: {
    redirectTo(routeName, routeParams, routeExtras) {
      if (undefined === routeName) {
        return this.$router.push("/");
      }
      let options = {
        name: routeName
      };
      if (undefined !== routeParams) {
        options.params = routeParams;
      }
      if (undefined !== routeExtras) {
        options = { ...options, ...routeExtras };
      }
      return this.$router.push(options).catch(() => {});
    }
  }
};
