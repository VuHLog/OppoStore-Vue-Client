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
const totalQuantity = computed(() => store.totalQuantity);

const order = ref({});
const paymentQuote = ref("Thanh toán khi nhận hàng");
const status = ref({ id: 1 });
const customerByUsername = ref();
const orderDetails = ref(cart);
onMounted(async () => {
  await proxy.$api
    .get("/api/customers/by-username/" + store.username)
    .then((res) => {
      customerByUsername.value = res.result;
    })
    .catch((e) => {
      console.log(e);
    });
});

async function payBtn() {
  order.value.totalPrice = totalPrice.value;
  order.value.note = "";
  order.value.paymentMethod = paymentQuote.value;
  order.value.status = status.value;
  order.value.customer = customerByUsername.value;
  order.value.orderDetails = orderDetails.value.map((item) => {
    return {
      quantity: item.quantity,
      price: item.variant.price,
      variant: item.variant,
    };
  });

  //thêm mới order
  await proxy.$api.post("/api/orders", order.value).then((res) => {
    const Toast = swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 1000,
      didOpen: (toast) => {
        toast.onmouseenter = swal.stopTimer;
        toast.onmouseleave = swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Đặt hàng thành công!",
    });
    store.clearCart();
    router.push("/user/purchase");
  });
}
</script>

<template>
  <div class="d-flex justify-center payment position-relative">
    <div
      class="max-w-600px w-100 position-relative"
      style="margin-bottom: 100px"
    >
      <div
        class="min-h-40px w-100 align-center position-relative border-b-sm border-solid mb-4"
      >
        <router-link
          to="/cart/payment-info"
          class="position-absolute text-decoration-none text-grey-darken-4 left-0 top-0"
        >
          <font-awesome-icon class="text-16" :icon="['fas', 'arrow-left']" />
        </router-link>
        <h5 class="text-center m-0 font-weight-bold">Thông tin</h5>
      </div>
      <div class="pt-1 pb-2 px-3 mb-2 nav d-flex justify-space-between">
        <div class="py-1 cursor-pointer w-48p text-center nav-item">
          <span class="uppercase">1. thông tin</span>
        </div>
        <div class="py-1 cursor-pointer w-48p text-center nav-item active">
          <span class="uppercase">2. thanh toán</span>
        </div>
      </div>
      <div class="w-100">
        <div
          class="p-4 rounded-lg border-sm border-solid d-flex flex-column mb-4 info-quote text-grey-darken-4"
        >
          <div
            class="info-quote__block pb-3 d-flex flex-column ga-2 border-b-sm border-solid"
          >
            <div class="quote__item d-flex justify-space-between">
              <p class="quote_tittle m-0 text-grey-darken-1 text-grey-darken-1">
                Số lượng sản phẩm
              </p>
              <p class="quote_value m-0">{{ totalQuantity }}</p>
            </div>
            <div class="quote__item d-flex justify-space-between">
              <p class="quote_tittle m-0 text-grey-darken-1">Tiền hàng</p>
              <p class="quote_value m-0">
                {{ new Intl.NumberFormat("en-DE").format(totalPrice) + "₫" }}
              </p>
            </div>
            <div class="quote__item d-flex justify-space-between">
              <p class="quote_tittle m-0 text-grey-darken-1">Phí vận chuyển</p>
              <p class="quote_value m-0">Miễn phí</p>
            </div>
          </div>
          <div class="d-flex justify-space-between pt-4">
            <div class="d-flex">
              <p class="m-0">Tổng tiền</p>
              <span class="ml-1 text-grey-darken-1">(đã gồm VAT)</span>
            </div>
            <p class="m-0 font-weight-bold">
              {{ new Intl.NumberFormat("en-DE").format(totalPrice) + "₫" }}
            </p>
          </div>
        </div>
      </div>

      <div class="w-100 mt-7">
        <p class="uppercase">Thông tin thanh toán</p>
        <div class="border-solid border-sm p-4 rounded-lg text-grey-darken-4">
          <div>
            <input
              type="radio"
              id="recieved"
              value="Thanh toán khi nhận hàng"
              v-model="paymentQuote"
              class="mr-2"
            />
            <label for="recieved">Thanh toán khi nhận hàng</label>
          </div>

          <div class="mt-2">
            <input
              type="radio"
              id="VNPAY"
              value="Thanh toán qua VNPAY"
              v-model="paymentQuote"
              class="mr-2"
            />
            <label for="VNPAY"
              ><img
                src="@images/payment/vnpay.webp"
                class="h-20px object-contain object-center"
                alt=""
              />VNPAY</label
            >
          </div>
        </div>
      </div>

      <div class="w-100 mt-7">
        <p class="uppercase">Thông tin nhận hàng</p>
        <div
          class="border-solid border-sm p-4 rounded-lg text-grey-darken-4 d-flex flex-column ga-2"
        >
          <div class="d-flex justify-space-between">
            <p class="m-0 text-grey-darken-1">Khách hàng</p>
            <p class="m-0">
              {{ customerByUsername?.name }}
            </p>
          </div>
          <div class="d-flex justify-space-between">
            <p class="m-0 text-grey-darken-1">Số điện thoại</p>
            <p class="m-0">
              {{ customerByUsername?.phone }}
            </p>
          </div>
          <div class="d-flex justify-space-between">
            <p class="m-0 text-grey-darken-1">Email</p>
            <p class="m-0">
              {{ customerByUsername?.email }}
            </p>
          </div>
          <div class="d-flex justify-space-between">
            <p class="m-0 text-grey-darken-1">Nhận hàng tại</p>
            <p class="m-0">
              {{ customerByUsername?.address }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-100 p-3 rounded-lg border-solid border-sm d-flex flex-column justify-space-between align-center position-fixed bottom-0 start-50 translate-middle z-30 bg-white max-w-600px"
    >
      <div class="text-grey-darken-4 d-flex justify-space-between w-100">
        <span>Tổng tiền:</span>
        <span class="text-red-accent-3 font-weight-bold">
          {{ new Intl.NumberFormat("en-DE").format(totalPrice) + "₫" }}
        </span>
      </div>
      <div class="w-100 mt-2">
        <v-btn
          type="button"
          class="rounded py-2 px-4 bg-green-darken-4 mr-2 w-100"
          @click="payBtn()"
        >
          Thanh toán
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.payment {
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
}
</style>