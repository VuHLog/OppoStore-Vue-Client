<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
function getRouteName() {
  return route.name;
}
</script>

<template>
  <div>
    <div class="d-flex flex-column bg-grey-lighten-3 rounded px-7 pb-2">
      <router-link
        to="/user/account/profile"
        class="text-decoration-none text-grey-darken-4 py-4 border-b-sm border-solid"
      >
        <div class="d-flex align-center cursor-pointer">
          <img
            class="rounded-circle h-12"
            src="https://res.cloudinary.com/cloud1412/image/upload/v1720963270/hwot10dc7skwjnmvjcru.jpg"
            alt="avatar"
          />
          <span class="pl-4 font-weight-bold">long</span>
        </div>
      </router-link>
      <div class="mt-7">
        <ul class="p-0 m-0">
          <li class="mb-3">
            <router-link
              class="text-decoration-none hover-text-green-darken-1 user-none"
              :class="
                getRouteName() === 'Profile'
                  ? 'text-green-darken-1'
                  : 'text-grey-darken-4'
              "
              to="/user/account/profile"
            >
              <font-awesome-icon class="mr-3 w-20px" :icon="['far', 'user']" />
              <span>Tài Khoản Của Tôi</span>
            </router-link>
          </li>
          <li class="mb-3">
            <router-link
              class="text-decoration-none hover-text-green-darken-1 user-none"
              :class="
                getRouteName() === 'Password'
                  ? 'text-green-darken-1'
                  : 'text-grey-darken-4'
              "
              to="/user/account/password"
            >
              <font-awesome-icon class="mr-3 w-20px" :icon="['fas', 'key']" />
              <span>Thay Đổi Mật Khẩu</span>
            </router-link>
          </li>
          <li class="mb-3">
            <router-link
              class="text-decoration-none hover-text-green-darken-1 user-none"
              :class="
                getRouteName() === 'Purchase'
                  ? 'text-green-darken-1'
                  : 'text-grey-darken-4'
              "
              to="/user/purchase"
            >
              <font-awesome-icon
                class="mr-3 w-20px"
                :icon="['far', 'clipboard']"
              />
              <span>Đơn Mua</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>