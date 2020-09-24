export default {
  data() {
    return {
      formErrors: []
    };
  },
  methods: {
    errorCallback(error, additionalErrors) {
      if (
        error.response.data.context.length === 0 &&
        undefined === additionalErrors
      ) {
        this.showSnackbar(error.response.data.error);
        return;
      }
      this.showSnackbar("Save failed, see errors to continue.");
      const violations = error.response.data.context.violations;
      if (violations !== undefined) {
        this.formErrors = violations;
      }
      for (let i = 0; i < additionalErrors.length; i++) {
        this.formErrors.push(additionalErrors[i]);
      }
    },
    getError(property_path) {
      for (let i = 0, item; i < this.formErrors.length; i++) {
        item = this.formErrors[i];
        if (item.propertyPath === property_path) {
          return item.title;
        }
      }
      return "";
    },
    clearErrors() {
      this.formErrors = [];
    },
    showSnackbar(message) {
      this.$store.dispatch("Ui/showSnackbar", {
        message
      });
    }
  }
};
