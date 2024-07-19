<script setup>
import { ref, onMounted, getCurrentInstance, watch } from "vue";
import { useRoute } from "vue-router";
import VCard from "@components/VCard.vue";

const { proxy } = getCurrentInstance();
const route = useRoute();

const totalElements = ref(0);
const totalPages = ref(10);
const field = ref("price");
const pageSize = ref(8);
const pageNumber = ref(1);

const sortPrice = ref([
  { display: "Giá cao đến thấp", value: "DESC" },
  { display: "Giá thấp đến cao", value: "ASC" },
]);
const sortPriceSelected = ref("ASC");

const price = ref([
  { display: "Dưới 2 triệu", value: { smallPrice: "", bigPrice: 2000000 } },
  {
    display: "Từ 2 đến 4 triệu",
    value: { smallPrice: 2000000, bigPrice: 4000000 },
  },
  {
    display: "Từ 4 đến 7 triệu",
    value: { smallPrice: 4000000, bigPrice: 7000000 },
  },
  {
    display: "Từ 7 đến 13 triệu",
    value: { smallPrice: 7000000, bigPrice: 13000000 },
  },
  {
    display: "Từ 13 đến 20 triệu",
    value: { smallPrice: 13000000, bigPrice: 20000000 },
  },
  { display: "Trên 20 triệu", value: { smallPrice: 20000000, bigPrice: "" } },
]);
const priceSelected = ref("");
const smallPrice = ref("");
const bigPrice = ref("");
watch(priceSelected, () => {
  if (priceSelected.value !== "") {
    smallPrice.value = priceSelected.value.smallPrice;
    bigPrice.value = priceSelected.value.bigPrice;
  } else {
    smallPrice.value = "";
    bigPrice.value = "";
  }
});

const ram = ref([
  { display: "3 GB", value: 3 },
  { display: "4 GB", value: 4 },
  { display: "6 GB", value: 6 },
  { display: "8 GB", value: 8 },
  { display: "12 GB", value: 12 },
]);
const ramSelected = ref("");

const rom = ref([
  { display: "64 GB", value: 64 },
  { display: "128 GB", value: 128 },
  { display: "256 GB", value: 256 },
  { display: "512 GB", value: 512 },
  { display: "1 TB", value: 1024 },
]);
const romSelected = ref("");

const charger = ref([
  { display: "Sạc nhanh(từ 20W)", value: ">20" },
  { display: "Sạc nhanh(từ 60W)", value: ">60" },
]);
const chargeSelected = ref("");

const mobilePhoneFiltered = ref([]);

onMounted(async () => {
  loadData();
});

async function loadData() {
  await proxy.$api
    .get(
      "/api/variants?" +
        "field=" +
        field.value +
        "&pageNumber=" +
        (pageNumber.value - 1) +
        "&pageSize=" +
        pageSize.value +
        "&sort=" +
        sortPriceSelected.value +
        "&smallPrice=" +
        smallPrice.value +
        "&bigPrice=" +
        bigPrice.value +
        "&ram=" +
        ramSelected.value +
        "&rom=" +
        romSelected.value +
        "&charge=" +
        chargeSelected.value
    )
    .then((res) => {
      mobilePhoneFiltered.value = res.content;
      totalElements.value = res.totalElements;
      totalPages.value = res.totalPages;
    })
    .catch((error) => console.log(error));
}

async function btnFilterClicked() {
  await loadData();
}

function resetFilterValue() {
  sortPriceSelected.value = "ASC";
  priceSelected.value = "";
  smallPrice.value = "";
  bigPrice.value = "";
  ramSelected.value = "";
  romSelected.value = "";
  chargeSelected.value = "";
}

async function btnCancelClicked() {
  resetFilterValue();
  await loadData();
}

watch(pageNumber, () => {
  loadData();
});
</script>

<template>
  <div>
    <div class="d-flex flex-wrap">
      <div class="col-2 h-7 pr-2 user-none">
        <v-select
          v-model="sortPriceSelected"
          label="Xếp theo"
          density="compact"
          :items="sortPrice"
          item-title="display"
          item-value="value"
          bg-color="#eeeeee"
        ></v-select>
      </div>
      <div class="col-2 h-7 pr-2 user-none">
        <v-select
          v-model="priceSelected"
          label="Giá"
          density="compact"
          :items="price"
          item-title="display"
          item-value="value"
          bg-color="#eeeeee"
        ></v-select>
      </div>
      <div class="col-2 pr-2 user-none">
        <v-select
          v-model="ramSelected"
          label="RAM"
          density="compact"
          :items="ram"
          item-title="display"
          item-value="value"
          bg-color="#eeeeee"
        ></v-select>
      </div>
      <div class="col-2 pr-2 user-none">
        <v-select
          v-model="romSelected"
          label="Dung lượng lưu trữ"
          density="compact"
          :items="rom"
          item-title="display"
          item-value="value"
          bg-color="#eeeeee"
        ></v-select>
      </div>
      <div class="col-2 pr-2 user-none">
        <v-select
          v-model="chargeSelected"
          label="Sạc"
          density="compact"
          :items="charger"
          item-title="display"
          item-value="value"
          bg-color="#eeeeee"
        ></v-select>
      </div>
      <div class="col-2">
        <v-btn
          type="button"
          class="rounded py-2 px-4 hover-opacity-80 bg-green-darken-4 mr-2"
          @click="btnFilterClicked()"
        >
          <span>Lọc</span>
        </v-btn>

        <span
          class="rounded py-2 px-4 hover-opacity-80 bg-white box-shadow-none border-sm border-solid text-red cursor-pointer user-none"
          @click="btnCancelClicked()"
        >
          <span>Bỏ chọn</span>
        </span>
      </div>
    </div>
    <div>
      <div class="d-flex flex-wrap mt-2">
        <template v-for="variant in mobilePhoneFiltered" :key="variant.id">
          <div class="col-3">
            <v-card :product="variant.mobilePhone" :variant="variant"></v-card>
          </div>
        </template>
      </div>
      <div class="text-center pt-3 pb-4">
        <v-pagination
          v-model="pageNumber"
          :length="totalPages"
          color="#D8D8D8"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>