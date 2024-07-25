<script setup>
import { computed, ref, onMounted, getCurrentInstance } from "vue";
import { useBaseStore } from "@/store/index.js";
import { inject } from "vue";

const proxy = getCurrentInstance();
const store = useBaseStore();
const swal = inject("$swal");
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

store.showFooter = false;

const check = ref(true);

const cart = computed(() => store.cart);
const totalPrice = computed(() => store.totalPrice);
const totalQuantity = computed(() => store.totalQuantity);

//tăng giảm số lượng sản phẩm
function changeQuantity(variantId, quantityCurr, number) {
  let quantity = quantityCurr + number;
  if (quantity <= 0) {
    Toast.fire({
      icon: "info",
      title: "Số lượng sản phẩm đã giảm đến mức tối thiểu",
    });
  } else if (quantity > 5) {
    Toast.fire({
      icon: "info",
      title: "Số lượng sản phẩm đã tăng đến mức tối đa",
    });
  } else {
    store.changeQuantity(variantId, number);
  }
}

//xoá sản phẩm
function removeFromCart(variantId) {
  store.removeFromCart(variantId);
}
</script>

<template>
  <div class="d-flex justify-center">
    <div class="max-w-600px w-100 position-relative">
      <div
        class="min-h-40px w-100 align-center position-relative border-b-sm border-solid mb-4"
      >
        <router-link
          to="/home"
          class="position-absolute text-decoration-none text-grey-darken-4 left-0 top-0"
        >
          <font-awesome-icon class="text-16" :icon="['fas', 'arrow-left']" />
        </router-link>
        <h5 class="text-center m-0 font-weight-bold">Giỏ hàng của bạn</h5>
      </div>
      <div class="w-100">
        <template v-for="item in cart" :key="item.variant.id">
          <div
            class="p-3 rounded-lg border-sm border-solid d-flex justify-space-between mb-4"
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
                <div
                  @click="removeFromCart(item.variant.id)"
                  class="cursor-pointer"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </div>
              </div>

              <div class="d-flex justify-space-between mb-2">
                <span class="text-red-accent-3 font-weight-medium">
                  {{
                    new Intl.NumberFormat("en-DE").format(item.variant.price) +
                    "₫"
                  }}
                </span>
                <div class="d-flex">
                  <span
                    class="d-flex justify-center align-center bg-grey-lighten-2 cursor-pointer rounded-sm h-30px w-30px user-none"
                    @click="changeQuantity(item.variant.id, item.quantity, -1)"
                    >-</span
                  >
                  <input
                    v-model="item.quantity"
                    type="text"
                    readonly
                    class="w-30px text-center text-14 bg-transparent"
                  />
                  <span
                    class="d-flex justify-center align-center bg-grey-lighten-2 cursor-pointer rounded-sm h-30px w-30px user-none"
                    @click="
                      changeQuantity(item.variant.id, item.quantity, 1)
                    "
                    >+</span
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div
        class="w-100 p-3 rounded-lg border-solid border-sm d-flex justify-space-between align-center position-fixed bottom-0 start-50 translate-middle z-30 bg-white max-w-600px"
      >
        <div>
          <p class="m-0 text-grey-darken-4">
            Tạm tính:
            <span class="text-red-accent-3 font-weight-bold">
              {{ new Intl.NumberFormat("en-DE").format(totalPrice) + "₫" }}
            </span>
          </p>
        </div>
        <div>
          <v-btn
            type="button"
            class="rounded py-2 px-4 bg-green-darken-4 mr-2"
            @click="buyNow()"
          >
            <strong>Mua ngay {{ `(${totalQuantity})` }}</strong>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>