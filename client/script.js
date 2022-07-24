import Vue from "https://cdn.jsdelivr.net/npm/vue@2.7.4/dist/vue.esm.browser.js";

Vue.component("Loader", {
  template: `
  <div style="display: flex; justify-content: center; align-items: center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  `,
});

new Vue({
  el: "#app",
  data() {
    return {
      loading: false,
      form: {
        name: "",
        value: "",
      },
      contacts: [
        // { id: 1, name: "Mirshod", value: "+998 99 099-57-52", marked: false },
      ],
    };
  },
  computed: {
    canCreate() {
      return this.form.name.trim() && this.form.value.trim();
    },
  },
  methods: {
    async createContact() {
      const { ...contact } = this.form;
      const response = await request("/api/contacts", "POST", contact);
      console.log(response);
      this.contacts.push({ ...contact, id: Date.now(), marked: false });
      console.log(this.contacts);
      this.form.name = this.form.value = "";
    },
    async markContact(id) {
      const contact = this.contacts.find((el) => el.id === id);
      const update = await request(`api/contacts/${id}`, "PUT", {
        ...contact,
        marked: true,
      });
      contact.marked = update;
    },
    async removeContact(id) {
      await request(`api/contacts/${id}`, "DELETE");
      this.contacts = this.contacts.filter((el) => el.id !== id);
    },
  },
  async mounted() {
    this.loading = true;
    this.contacts = await request("/api/contacts");
    this.loading = false;
  },
});

async function request(url, method = "GET", data = null) {
  try {
    const headers = {};
    let body;
    if (data) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    return await response.json();
  } catch (e) {
    console.error("Error: ", e.message);
  }
}
