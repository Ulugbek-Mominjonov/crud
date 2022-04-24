<template>
  <v-container class="product-container">
    <v-row>
      <v-col cols="12" class="my-8">
        <v-spacer></v-spacer>
        <v-btn color="info" @click="addItem"
          >Add product <v-icon class="ml-4">mdi-table-plus</v-icon></v-btn
        >
      </v-col>
      <v-col cols="12">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left heading">Name</th>
                <th class="text-left heading">Product type</th>
                <th class="text-left heading">Cost</th>
                <th class="text-left heading">Address</th>
                <th class="text-left heading">Created date</th>
                <th class="text-left heading">Update</th>
                <th class="text-left heading">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in getProductList" :key="item.id">
                <td>{{ item.nameUz }}</td>
                <td v-for="el in getType(item.productTypeId)" :key="el.id">{{ el.nameUz }}</td>
                <td>{{ item.cost }}</td>
                <td>{{ item.address }}</td>
                <td>{{ formatDate(new Date(item.createdDate)) }}</td>
                <td>
                  <v-icon
                    @click="updateProduct(item)"
                    class="table-icon udate-icon"
                    >mdi-pencil</v-icon
                  >
                </td>
                <td>
                  <v-icon
                    @click="delProduct(item)"
                    class="table-icon delete-icon"
                    >mdi-delete</v-icon
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <!-- add and update dialog  -->
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card class="form-card">
        <v-card-title class="justify-center">
          {{ messageDialog }} Product
        </v-card-title>
        <v-card-text class="pt-4">
          <v-container>
            <v-row align="center">
              <v-col cols="12" class="py-0">
                <v-select
                  v-model="type"
                  :items="typeList"
                  item-value="id"
                  item-text="nameUz"
                  label="Product types"
                  dense
                  outlined
                >
                </v-select>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-text-field
                  v-model="product.nameUz"
                  label="Product name"
                  id="id"
                  placeholder="Product name..."
                  color="#28235B"
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="product.cost"
                  label="Product cost"
                  id="id"
                  placeholder="Product cost..."
                  color="#28235B"
                  dense
                  outlined
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-text-field
                  v-model="product.address"
                  label="Address"
                  id="id"
                  placeholder="Address..."
                  color="#28235B"
                  dense
                  outlined
                  append-icon="mdi-folder-home"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Picker in menu"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      small
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" no-title scrollable>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <p class="errors" v-if="error">{{ errorMessage }}</p>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="warning" @click="CancelChanges()">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="#28235B" dark @click="saveChanges">Save changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- confirm delete Product dialog  -->
    <v-dialog v-model="dialogTwo" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          Are you sure you want to delete {{ messageAlert }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogTwo = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text @click="confirmDelete">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// services
import EventService from "@/services/EventServices.js";
// store
import store from "@/store";
import { mapState } from "vuex";
// Date formater
import moment from "moment";
// Vuelidate
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "ProductView",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      product: {
        productTypeId: null,
        nameUz: "",
        cost: 0,
        address: "",
        createdDate: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
      },
      type: null,
      menu: false,
      modal: false,
      dialog: false,
      dialogTwo: false,
      messageAlert: "",
      messageDialog: "",
      deleteProductId: null,
      date: null,
      errorMessage: "All field is required!!!",
      error: false,
    };
  },
  validations() {
    return {
      type: { required },
      product: {
        nameUz: { required },
        cost: { required },
        address: { required },
      },
    };
  },
  computed: {
    ...mapState({
      productList: "productList",
      typeList: "typeList",
    }),
    getProductList() {
      console.log(this.productList);
      if (this.productList) {
        return this.productList;
      }
      return null;
    },
  },
  methods: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("MM.DD.YYYY");
      }
    },
    getType(id) {
      if(this.typeList) {
        return this.typeList.filter(item => item.id == id)
      }
    },
    updateProduct(data) {
      this.product = data;
      this.date = moment(String(new Date(this.product.createdDate))).format(
        "YYYY-MM-DD"
      );
      this.messageDialog = "Update";
      this.type = this.product.productTypeId;
      this.dialog = true;
    },
    async saveChanges() {
      const result = await this.v$.$validate();
      if (!result) {
        this.error = true;
        return;
      }
      this.product.productTypeId = this.type;
      this.product.createdDate = this.date;
      if ("id" in this.product) {
        await EventService.putProduct(this.product);
      } else {
        await EventService.addProduct(this.product);
      }
      await store.dispatch("getList");
      (this.product = {
        productTypeId: null,
        nameUz: "",
        cost: 0,
        address: "",
        createdDate: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
      }),
        (this.dialog = false);
      this.type = null;
      this.error = false;
    },
    CancelChanges() {
      this.product = {
        productTypeId: null,
        nameUz: "",
        cost: 0,
        address: "",
        createdDate: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
      };
      this.type = null;
      this.dialog = false;
    },
    addItem() {
      this.messageDialog = "Add";
      this.dialog = true;
    },
    delProduct(item) {
      this.deleteProductId = item.id;
      this.message = item.nameUz;
      this.dialogTwo = true;
    },
    async confirmDelete() {
      await EventService.deleteProduct(this.deleteProductId);
      await store.dispatch("getList");
      this.dialogTwo = false;
    },
  },
  mounted() {
    store.dispatch("getList");
    store.dispatch("getProductTypes");
  },
};
</script>
<style lang="scss" scoped>
th.heading {
  font-weight: 700;
  color: #222 !important;
}
.table-icon {
  cursor: pointer;
}
.errors {
  text-align: center;
  color: red;
}
</style>
