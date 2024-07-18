<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRoute } from "vue-router";

const { proxy } = getCurrentInstance();

const route = useRoute();

const orders = ref([]);

const active = ref("");

onMounted(async () => {
  loadData("");
});

async function loadData(status) {
  active.value = status;
  await proxy.$api
    .get("/api/orders?status=" + status)
    .then((res) => {
      orders.value = res.content;
      console.log(res.content);
    })
    .catch((error) => console.log(error));
}

function totalPrice(orderDetails) {
  return (totalPrice.value = orderDetails.reduce((prev, curr) => {
    return prev + curr.price * curr.quantity;
  }, 0));
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
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none"
          :class="active===''?'active':''"
          @click="loadData('')"
        >
          Tất cả
        </span>
      </div>
      <div class="col-2 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none"
          :class="active==='Chờ xử lý'?'active':''"
          @click="loadData('Chờ xử lý')"
        >
          Chờ xử lý
        </span>
      </div>
      <div class="col-2 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none"
          :class="active==='Đã xác nhận'?'active':''"
          @click="loadData('Đã xác nhận')"
        >
          Đã xác nhận
        </span>
      </div>
      <div class="col-2 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none"
          :class="active==='Đang chuyển hàng'?'active':''"
          @click="loadData('Đang chuyển hàng')"
        >
          Đang chuyển hàng
        </span>
      </div>
      <div class="col-2 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none"
          :class="active==='Đang giao hàng'?'active':''"
          @click="loadData('Đang giao hàng')"
        >
          Đang giao hàng
        </span>
      </div>
      <div class="col-1 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none"
          :class="active==='Đã huỷ'?'active':''"
          @click="loadData('Đã huỷ')"
        >
          Đã huỷ
        </span>
      </div>
      <div class="col-2 text-grey-darken-4">
        <span
          to=""
          class="d-inline-block py-4 text-decoration-none w-100 h-100 d-flex justify-center align-center hover-text-green-darken-1 cursor-pointer user-none"
          :class="active==='Đã nhận hàng'?'active':''"
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
      <template v-for="order in orders" :key="order.id" v-if="orders.length>0">
        <template
          v-for="orderDetail in order.orderDetails"
          :key="orderDetail.id"
        >
          <div class="my-3">
            <ul class="m-0 w-100 border-b-sm border-t-sm border-solid pa-6">
              <div class="text-end">
                <span class="uppercase text-green-darken-1 text-14">{{
                  order.status.status
                }}</span>
              </div>
              <li class="d-flex h-24 d-flex justify-space-between pt-3 pr-3">
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
                <div class="h-100 d-flex align-center text-14">
                  <span class="text-red-accent-3 font-weight-medium">{{
                    new Intl.NumberFormat("en-DE").format(orderDetail.price) +
                    "₫"
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
      </template>
      <div v-else class="d-flex flex-column align-center justify-center" style="min-height: 60vh;">
          <div>
            <img class="h-24" src="@images/purchase-empty.png" alt="">
          </div>
          <p>Chưa có đơn hàng</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active {
  color: #388e3c;
  border-bottom:1px #388e3c solid;
}
</style>