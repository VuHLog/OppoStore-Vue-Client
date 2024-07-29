<script setup>
import { computed, ref, onMounted, getCurrentInstance } from "vue";
import axios from "axios";
import { useBaseStore } from "@/store/index.js";
import { inject } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const swal = inject("$swal");
const router = useRouter();
const store = useBaseStore();

store.showFooter = false;
const cart = computed(() => store.cart);
const totalPrice = computed(() => store.totalPrice);
const tokenGHN = computed(() => store.tokenGHN);

const isEmailNotify = ref(true);

const provincesVN = ref([]);
const districtsByProvince = ref([]);
const wardsByDistrict = ref([]);
const provinceID = ref("");
const districtID = ref("");
const wardCode = ref("");
const specificAddress = ref("");
const account = ref("");
const customerByUsername = ref({});
const showAddressForm = ref(false);
onMounted(async () => {
  await axios
    .get(
      `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
      {
        headers: {
          "Content-Type": "application/json",
          token: tokenGHN.value,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .then((response) => {
      provincesVN.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  await proxy.$api
    .get("/api/customers/by-username/" + store.username)
    .then((res) => {
      customerByUsername.value = res.result;
      if (customerByUsername.value === undefined) {
        showAddressForm.value = true;
        customerByUsername.value = {};
      }
    })
    .catch((e) => {
      console.log(e);
    });

  await proxy.$api
    .get("/api/users/username/" + store.username)
    .then((res) => {
      account.value = res.result;
    })
    .catch((err) => console.log(err));
});

async function loadDistrict() {
  districtID.value = "";
  wardCode.value = "";
  specificAddress.value = "";
  await axios
    .get(
      `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceID.value}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: tokenGHN.value,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .then((response) => {
      districtsByProvince.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

async function loadWard() {
  wardCode.value = "";
  specificAddress.value = "";
  await axios
    .get(
      `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtID.value}`,
      {
        headers: {
          "Content-Type": "application/json",
          token: tokenGHN.value,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .then((response) => {
      wardsByDistrict.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

function changeAddress() {
  showAddressForm.value = true;
  customerByUsername.value.address = "";
}

const errorMsg = ref("");

async function continueBtn() {
  errorMsg.value = "";

  customerByUsername.value.phone = account.value.phone;
  customerByUsername.value.email = account.value.email;
  customerByUsername.value.name = account.value.fullName;

  //nếu như tài khoản này chưa từng nhập địa chỉ để mua hàng
  if (customerByUsername.value === undefined) {
    errorMsg.value = "Phải nhập đầy đủ địa chỉ";
    return;
  }

  // nếu tài khoản đã từng nhập và thay đổi địa chỉ
  if (showAddressForm.value) {
    if (
      provinceID.value === "" ||
      districtID.value === "" ||
      wardCode.value === "" ||
      specificAddress.value === ""
    ) {
      errorMsg.value = "Phải nhập đầy đủ địa chỉ";
      return;
    } else {
      let provinceName = provincesVN.value.find(
        (item) => item.ProvinceID === provinceID.value
      ).ProvinceName;
      let districtName = districtsByProvince.value.find(
        (item) => item.DistrictID === districtID.value
      ).DistrictName;
      let wardName = wardsByDistrict.value.find(
        (item) => item.WardCode === wardCode.value
      ).WardName;

      customerByUsername.value.address = `${specificAddress.value}, ${wardName}, ${districtName}, ${provinceName}`;
    }

    if (customerByUsername.value.id) {
      //cập nhật customer
      await proxy.$api
        .put(
          "/api/customers/" + customerByUsername.value.id,
          customerByUsername.value
        )
        .then((res) => {});
    } else {
      customerByUsername.value.user = account.value;
      //thêm mới customer
      await proxy.$api
        .post("/api/customers", customerByUsername.value)
        .then((res) => {});
    }
  }

  router.push("/cart/payment");
}
</script>

<template>
  <div class="d-flex justify-center payment-info position-relative">
    <div
      class="max-w-600px w-100 position-relative"
      style="margin-bottom: 100px"
    >
      <div
        class="min-h-40px w-100 align-center position-relative border-b-sm border-solid mb-4"
      >
        <router-link
          to="/cart"
          class="position-absolute text-decoration-none text-grey-darken-4 left-0 top-0"
        >
          <font-awesome-icon class="text-16" :icon="['fas', 'arrow-left']" />
        </router-link>
        <h5 class="text-center m-0 font-weight-bold">Thông tin</h5>
      </div>
      <div class="pt-1 pb-2 px-3 mb-2 nav d-flex justify-space-between">
        <div class="py-1 cursor-pointer w-48p text-center nav-item active">
          <span class="uppercase">1. thông tin</span>
        </div>
        <div class="py-1 cursor-pointer w-48p text-center nav-item">
          <span class="uppercase">2. thanh toán</span>
        </div>
      </div>
      <div class="w-100">
        <div
          class="py-1 px-3 rounded-lg border-sm border-solid d-flex flex-column mb-4"
        >
          <template v-for="(item, index) in cart" :key="item.variant.id">
            <div
              class="w-100 d-flex justify-space-between py-3"
              :class="index < cart.length - 1 ? 'border-b-sm border-solid' : ''"
            >
              <div class="d-flex">
                <img
                  :src="item.variant.image"
                  alt=""
                  class="h-100px w-100px object-contain object-center"
                />
              </div>
              <div class="w-75">
                <div class="d-flex justify-space-between mb-2">
                  <router-link
                    class="text-decoration-none text-grey-darken-4"
                    :to="'/mobile-phone/' + item.variant.id"
                  >
                    <span class="hover-text-underline">{{
                      item.variant.name
                    }}</span>
                  </router-link>
                </div>

                <div class="d-flex justify-space-between mb-2">
                  <span class="text-red-accent-3 font-weight-medium">
                    {{
                      new Intl.NumberFormat("en-DE").format(
                        item.variant.price
                      ) + "₫"
                    }}
                  </span>
                  <div class="d-flex">
                    <span class="user-none">Số lượng: {{ item.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="w-100 mt-7">
        <p class="uppercase">Thông tin khách hàng</p>
        <div class="border-solid border-sm p-3 rounded-lg text-grey-darken-4">
          <div class="d-flex justify-space-between">
            <span>{{ account.fullName }}</span>
            <span class="text-grey-darken-1">{{ account.phone }}</span>
          </div>
          <div class="mt-2">
            <span class="text-grey-lighten-1 text-12">EMAIL</span>
            <p>{{ account.email }}</p>
          </div>
          <div>
            <v-checkbox
              v-model="isEmailNotify"
              color="green-darken-4"
              label="Nhận email thông báo"
              hide-details
            ></v-checkbox>
          </div>
        </div>
      </div>

      <div class="w-100 mt-7">
        <p class="uppercase">Thông tin nhận hàng</p>
        <div class="border-solid border-sm p-3 rounded-lg text-grey-darken-4">
          <div
            class="d-flex mb-2 justify-space-between"
            v-if="!showAddressForm"
          >
            <p class="m-0 text-grey-darken-1">Địa chỉ nhận hàng</p>
            <p class="m-0">{{ customerByUsername?.address }}</p>
          </div>
          <p
            class="text-decoration-underline"
            v-if="customerByUsername !== undefined"
            @click="changeAddress()"
          >
            Thay đổi địa chỉ nhận hàng
          </p>
          <p v-else>Chọn địa chỉ nhận hàng</p>
          <transition>
            <div
              class="d-flex flex-wrap justify-space-between mb-2"
              v-if="showAddressForm"
            >
              <div class="w-30p h-50px user-none">
                <v-select
                  v-model="provinceID"
                  label="Tỉnh / Thành phố"
                  density="compact"
                  :items="provincesVN"
                  item-title="ProvinceName"
                  item-value="ProvinceID"
                  bg-color="#eeeeee"
                  @update:modelValue="loadDistrict()"
                  hide-details="false"
                ></v-select>
              </div>
              <div class="w-30p h-50px user-none">
                <v-select
                  v-model="districtID"
                  label="Quận / Huyện"
                  density="compact"
                  :items="districtsByProvince"
                  item-title="DistrictName"
                  item-value="DistrictID"
                  bg-color="#eeeeee"
                  @update:modelValue="loadWard()"
                  hide-details="false"
                  no-data-text="Phải chọn Tỉnh / Thành phố"
                ></v-select>
              </div>
              <div class="w-30p h-50px user-none">
                <v-select
                  v-model="wardCode"
                  label="Phường / Xã"
                  density="compact"
                  :items="wardsByDistrict"
                  item-title="WardName"
                  item-value="WardCode"
                  bg-color="#eeeeee"
                  hide-details="false"
                  @update:modelValue="specificAddress = ''"
                  no-data-text="Phải chọn Quận / Huyện"
                ></v-select>
              </div>
              <div class="w-100 h-50px">
                <v-text-field
                  v-model="specificAddress"
                  color="primary"
                  label="Số nhà, tên đường"
                  variant="underlined"
                ></v-text-field>
              </div>
            </div>
          </transition>
          <span class="text-red text-12">{{ errorMsg }}</span>
        </div>
      </div>
    </div>
    <div
      class="w-100 p-3 rounded-lg border-solid border-sm d-flex flex-column justify-space-between align-center position-fixed bottom-0 start-50 translate-middle z-30 bg-white max-w-600px"
    >
      <div class="text-grey-darken-4 d-flex justify-space-between w-100">
        <span>Tạm tính:</span>
        <span class="text-red-accent-3 font-weight-bold">
          {{ new Intl.NumberFormat("en-DE").format(totalPrice) + "₫" }}
        </span>
      </div>
      <div class="w-100 mt-2">
        <v-btn
          type="button"
          class="rounded py-2 px-4 bg-green-darken-4 mr-2 w-100"
          @click="continueBtn()"
        >
          Tiếp tục
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.payment-info {
  .nav {
    .nav-item {
      font-weight: 600;
      border-bottom: 3px solid #919eab;
      color: #919eab;

      &.active {
        border-color: #1b5e20;
        color: #1b5e20;
      }
    }
  }
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
}
</style>