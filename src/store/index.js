import Vue from "vue";
import Vuex from "vuex";
import EventService from "@/services/EventServices.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    productList: null,
    typeList: null,
    errors: "",
  },
  mutations: {
    SET_LIST(state, payload) {
      state.productList = payload;
    },
    SET_ERRORS(state, payload) {
      state.errors = payload;
    },
    SET_TYPE_LIST(state, payload) {
      state.typeList = payload;
    },
  },
  actions: {
    getList({ commit }) {
      EventService.getProducts()
        .then((res) => {
          commit("SET_LIST", res.data);
        })
        .catch((e) => {
          commit("SET_ERRORS", e);
        });
    },
    getProductTypes({ commit }) {
      return EventService.getProductType().then((res) => {
        commit("SET_TYPE_LIST", res.data);
      });
    },
  },
});
