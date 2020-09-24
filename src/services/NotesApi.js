import axios from "axios";

let apiClient = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_HOST,
  withCredentials: false, // should be false for stateless
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  timeout: 10000
});

const findIndex = (arrayStack, arrayNeedle) => {
  const findIndexById = (haystack, needle) => haystack.id === needle;
  return arrayStack.findIndex(item => findIndexById(item, arrayNeedle));
};

export default {
  instance: apiClient,
  findIndexInBucket(bucket, itemId) {
    const index = findIndex(bucket, itemId);
    return index < 0 ? null : bucket[index];
  },
  login(credentials) {
    return apiClient.post("/auth", credentials);
  },
  getAuthenticatedRole() {
    return apiClient.post("/roles/authenticated");
  },
  listNotes(pager = "") {
    return apiClient.get("/docs/?page=" + pager);
  },
  createNote(form) {
    return apiClient.post("/docs/create", form);
  },
  updateNote(form) {
    return apiClient.put("/docs/update/" + form.document.id, form);
  },
  removeNote(note_id) {
    return apiClient.delete("/docs/remove/" + note_id);
  },
  getSingleNote(note_id) {
    return apiClient.get("/docs/single/" + note_id);
  },
  getSingleRevision(revision_id) {
    return apiClient.get("/docs/revision/" + revision_id);
  },
  restoreNote(revision_id) {
    return apiClient.post("/docs/restore/" + revision_id);
  },
  listRoles() {
    return apiClient.get("/roles/");
  },
  createRole(form) {
    return apiClient.post("/roles/create", form);
  },
  updateRole(form) {
    return apiClient.put("/roles/update/" + form.role.id, form);
  },
  removeRole(role_id) {
    return apiClient.delete("/roles/remove/" + role_id);
  },
  listTags() {
    return apiClient.get("/tags/");
  },
  createTag(form) {
    return apiClient.post("/tags/create", form);
  },
  updateTag(form) {
    return apiClient.put("/tags/update/" + form.tag.id, form);
  },
  removeTag(tag_id) {
    return apiClient.delete("/tags/remove/" + tag_id);
  }
};
