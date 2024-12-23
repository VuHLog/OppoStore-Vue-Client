<script setup>
import { watch, ref, getCurrentInstance, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBaseStore } from "@/store/index.js";

const { proxy } = getCurrentInstance();

const route = useRoute();
const store = useBaseStore();

const totalElements = ref(0);
const totalPages = ref(10);
const field = ref("createdTime");
const pageSize = ref(4);
const pageNumber = ref(1);
const statusAccess = ref("");

const orders = ref([]);

const active = ref("");
const customerByUsername = ref({});

onMounted(async () => {
  await proxy.$api
    .get("/api/customers/by-username/" + store.username)
    .then((res) => {
      customerByUsername.value = res.result;
      if (customerByUsername.value === undefined) {
        customerByUsername.value = {};
      }
    })
    .catch((e) => {
      console.log(e);
    });
  await loadData("");
});

async function loadData(status) {
  statusAccess.value = status;
  active.value = status;
  await proxy.$api
    .get(
      "/api/orders?status=" +
        status +
        "&customerId=" +
        customerByUsername.value.id +
        "&field=" +
        field.value +
        "&pageNumber=" +
        (pageNumber.value - 1) +
        "&pageSize=" +
        pageSize.value
    )
    .then((res) => {
      orders.value = res.content;
      totalElements.value = res.totalElements;
      totalPages.value = res.totalPages;
    })
    .catch((error) => console.log(error));
}

watch(pageNumber, () => {
  loadData(statusAccess.value);
});

function totalPrice(orderDetails) {
  return (totalPrice.value = orderDetails.reduce((prev, curr) => {
    return prev + curr.price * curr.quantity;
  }, 0));
}

// thực hiện thanh toán qua VNPay
async function openURLVNPay(orderId) {
  await proxy.$api
    .get(
      "/api/vnpay-payment/create-vnpay-payment?price=" +
        totalPrice.value +
        "&order_id=" +
        orderId
    )
    .then((res) => {
      let result = res.result;
      console.log(result);
      if (result.status === "OK") {
        window.open(result.url, "_blank");
      }
    });
}
</script>

<template>
  <div class="ml-7 px-7 h-100">
    <div
      class="d-flex flex-wrap rounded"
      style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
    >
      <div class="col-1 text-grey-darken-4">
        <span
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none status-item"
          :class="active === '' ? 'active' : ''"
          @click="loadData('')"
        >
          Tất cả
        </span>
      </div>
      <div class="col-2 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none status-item"
          :class="active === 'Chờ xử lý' ? 'active' : ''"
          @click="loadData('Chờ xử lý')"
        >
          Chờ xử lý
        </span>
      </div>
      <div class="col-2 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none status-item"
          :class="active === 'Đã xác nhận' ? 'active' : ''"
          @click="loadData('Đã xác nhận')"
        >
          Đã xác nhận
        </span>
      </div>
      <div class="col-2 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none status-item"
          :class="active === 'Đang chuyển hàng' ? 'active' : ''"
          @click="loadData('Đang chuyển hàng')"
        >
          Đang chuyển hàng
        </span>
      </div>
      <div class="col-2 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none status-item"
          :class="active === 'Đang giao hàng' ? 'active' : ''"
          @click="loadData('Đang giao hàng')"
        >
          Đang giao hàng
        </span>
      </div>
      <div class="col-1 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none status-item"
          :class="active === 'Đã huỷ' ? 'active' : ''"
          @click="loadData('Đã huỷ')"
        >
          Đã huỷ
        </span>
      </div>
      <div class="col-2 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none status-item"
          :class="active === 'Đã nhận hàng' ? 'active' : ''"
          @click="loadData('Đã nhận hàng')"
        >
          Đã nhận hàng
        </span>
      </div>
    </div>
    <div
      class="d-flex flex-column rounded mt-4"
      style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
    >
      <div v-if="orders.length > 0">
        <template v-for="order in orders" :key="order.id">
          <div class="mb-5">
            <div class="pa-6 d-flex justify-space-between text-14">
              <span class="text-green-darken-1">{{
                `Ngày đặt hàng: ${order.createdTime}`
              }}</span>
              <div>
                <span
                  class="uppercase text-green-darken-1"
                  v-if="order.paymentStatus === 1"
                  >{{ "Đã thanh toán" }}</span
                >
                <span
                  class="uppercase text-info text-decoration-underline cursor-pointer user-none"
                  v-else-if="order.paymentMethod !== 'Thanh toán khi nhận hàng'"
                  @click="openURLVNPay(order.id)"
                  >{{ `${order.paymentMethod}` }}</span
                >
                <span class="uppercase text-info" v-else>{{
                  order.paymentMethod
                }}</span>

                <span class="uppercase text-green-darken-1">{{
                  ` | ${order.status.status}`
                }}</span>
              </div>
            </div>
            <template
              v-for="orderDetail in order.orderDetails"
              :key="orderDetail.id"
            >
              <div class="">
                <ul class="m-0 w-100 border-b-sm border-t-sm border-solid pa-6">
                  <li
                    class="d-flex h-24 d-flex justify-space-between pt-3 pr-3"
                  >
                    <router-link
                      :to="'/mobile-phone/' + orderDetail.variant.id"
                      class="text-decoration-none text-grey-darken-4"
                    >
                      <div class="d-flex h-100">
                        <div class="h-100">
                          <img
                            :src="orderDetail.variant.image"
                            alt=""
                            class="h-100 object-contain object-center rounded-lg d-block"
                          />
                        </div>
                        <div class="h-100 pl-3">
                          <div class="mb-1">
                            <span>
                              {{ orderDetail.variant.mobilePhone.name }}
                            </span>
                          </div>
                          <div class="mb-1 text-grey-lighten-1 text-14">
                            <span>
                              Phân loại hàng:
                              {{
                                orderDetail.variant.color.name +
                                "/" +
                                orderDetail.variant.rom.capacity +
                                "GB"
                              }}
                            </span>
                          </div>
                          <div class="mb-1 text-14">
                            <span> Số lượng: {{ orderDetail.quantity }} </span>
                          </div>
                        </div>
                      </div>
                    </router-link>
                    <div class="h-100 d-flex align-center text-14">
                      <span class="text-red-accent-3 font-weight-medium">{{
                        new Intl.NumberFormat("en-DE").format(
                          orderDetail.price
                        ) + "₫"
                      }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
            <div class="pb-3 pt-6 px-6 text-end">
              <div>
                <span class="text-14 mr-3">Thành tiền:</span>
                <span class="text-xl text-red-accent-3 font-weight-medium">{{
                  new Intl.NumberFormat("en-DE").format(
                    totalPrice(order.orderDetails)
                  ) + "₫"
                }}</span>
              </div>
            </div>
          </div>
        </template>
        <div class="text-center pt-3 pb-4">
          <v-pagination
            v-model="pageNumber"
            :length="totalPages"
          ></v-pagination>
        </div>
      </div>
      <div
        v-else
        class="d-flex flex-column align-center justify-center"
        style="min-height: 60vh"
      >
        <div>
          <img class="h-24" src="@images/purchase-empty.png" alt="" />
        </div>
        <p>Chưa có đơn hàng</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active.status-item {
  color: #388e3c;
  border-bottom: 1px #388e3c solid;
}
</style>