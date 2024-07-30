<script setup>
import { getCurrentInstance, computed, ref, watch, onMounted } from "vue";
import { useBaseStore } from "@/store/index.js";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";

const { proxy } = getCurrentInstance();
const store = useBaseStore();
const router = useRouter();

const username = ref("");
const avatarUrl = ref("");
const name = ref("");

const searchText = ref("");

const pageSize = ref(3);
const mobilePhonesSearched = ref([]);

const showUserMenu = ref(false);

onMounted(() => {
  let token = localStorage.getItem("token");
  decodedToken(token);
});

function decodedToken(token) {
  if (token) {
    const decoded = jwtDecode(token);
    username.value = decoded.sub;
    avatarUrl.value = decoded.avatarUrl;
    name.value = decoded.name;
    store.isLoggedIn=true;
  } else {
    username.value = "";
    avatarUrl.value = "";
    name.value = "";
  }
}

const cart = computed(() => store.cart);

const isLoggedIn = computed(() => store.isLoggedIn);

//isLoggedIn thay đổi thì cập nhật hiển thị thông tin người dùng
watch(isLoggedIn, (newVal) => {
  if (newVal) {
    const token = localStorage.getItem("token");
    decodedToken(token);
  } else {
    decodedToken(null);
  }
});

const loadData = () => {
  proxy.$api
    .get(
      "/api/mobilePhones?pageSize=" +
        pageSize.value +
        "&search=" +
        searchText.value
    )
    .then((res) => {
      mobilePhonesSearched.value = res.content;
    });
};

watch(searchText, () => {
  if (searchText.value !== "") {
    loadData();
  }
});

async function logOut() {
  showUserMenu.value = false;
  const token = localStorage.getItem("token");
  if (token) {
    await proxy.$api
      .post("/auth/logout", token)
      .then(() => {
        store.isLoggedIn=false;
        localStorage.removeItem("token");
        decodedToken(null);
        router.push("/sign-in");
      })
      .catch();
  }
}

function filterByRom(variants) {
  // Lấy danh sách loại khác nhau
  const romSet = new Set();
  let variantsFiltered = [];
  variants.forEach((variant) => {
    const romString = JSON.stringify({
      mobilePhone: variant.mobilePhone,
      rom: variant.rom,
    });
    if (!romSet.has(romString)) {
      romSet.add(romString);
      variantsFiltered.push(variant);
    }
  });
  return variantsFiltered;
}

function toCart(){
  router.push("/cart");
}
</script>

<template>
  <nav class="d-flex justify-space-between">
    <section class="h-100 d-flex">
      <router-link to="/home" class="d-block h-100 text-decoration-none">
        <div class="d-inline-block h-100">
          <img class="h-100" src="@assets/img/logo/oppo-logo.png" alt="" />
        </div>
      </router-link>
      <ul class="p-0 m-0 text-16 h-100 d-flex text-grey-darken-4">
        <li class="h-100">
          <router-link
            to="/home"
            class="d-flex align-center hover-opacity-80 h-100 text-decoration-none text-grey-darken-4 px-1 mx-3 h-100"
          >
            <span>Trang Chủ</span>
          </router-link>
        </li>
        <li class="h-100">
          <router-link
            to="/mobile-phone"
            class="d-flex align-center hover-opacity-80 h-100 text-decoration-none text-grey-darken-4 px-1 mx-3 h-100"
          >
            <span>Điện Thoại</span>
          </router-link>
        </li>
      </ul>
    </section>
    <section class="h-100 d-flex">
      <div class="search d-flex align-center">
        <div
          class="position-relative search-box border-sm border-solid rounded-xl text-grey-darken-4 bg-grey-lighten-3"
        >
          <button type="button" class="icon-search p-2 top-0 right-0">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          </button>
          <input
            v-model.trim="searchText"
            type="text"
            class="input-search pl-1 h-100 rounded-be-xl rounded-te-xl"
            placeholder="Tìm kiếm"
          />
          <div
            class="position-absolute bg-grey-lighten-4 min-w-100 search-result p-2 top-100 left-0 rounded"
            v-if="searchText"
          >
            <ul
              class="list-item p-0 p-1 m-0 border-b-custom"
              v-if="mobilePhonesSearched.length !== 0"
            >
              <template
                v-for="mobilePhone in mobilePhonesSearched"
                :key="mobilePhone.id"
              >
                <template
                  v-for="variant in filterByRom(mobilePhone.variants)"
                  :key="variant.id"
                >
                  <router-link
                    :to="'/mobile-phone/' + variant.id"
                    class="d-block text-decoration-none pb-2 text-grey-darken-4"
                  >
                    <li class="item d-flex align-item mb-2">
                      <div class="mr-1">
                        <img class="h-15" :src="variant.image" alt="" />
                      </div>
                      <div
                        class="movie-info d-flex flex-column justify-start align-start"
                      >
                        <p class="m-0 text-start text-14">
                          {{ mobilePhone.name }}
                        </p>
                        <p class="m-0 text-start text-12 text-grey-lighten-1">
                          {{
                            `Màu: ${variant.color.name}, ROM: ${variant.rom.capacity}GB`
                          }}
                        </p>
                        <p
                          class="m-0 text-start text-red-accent-3 font-weight-bold"
                        >
                          {{
                            new Intl.NumberFormat("en-DE").format(
                              variant.price
                            ) + "₫"
                          }}
                        </p>
                      </div>
                    </li>
                  </router-link>
                </template>
              </template>
            </ul>
            <router-link
              :to="'/search?searchText=' + searchText"
              class="text-decoration-none"
            >
              <p class="m-0 text-green-darken-4 text-center p-1">
                Xem tất cả kết quả "{{ searchText }}"
              </p>
            </router-link>
          </div>
        </div>
        <div
          class="d-flex align-center hover-opacity-80 px-1 mx-3 h-100 cursor-pointer text-grey-darken-4"
        >
          <div class="position-relative" @click="toCart()">
            <font-awesome-icon
              class="text-xl"
              :icon="['fas', 'cart-shopping']"
            />
            <span
              class="position-absolute text-white border-solid border-sm rounded-circle w-3 h-3 bg-red-darken-1 text-10 d-flex justify-center align-center top-0 start-50 translate-middle-x"
              >{{ cart.length }}</span
            >
          </div>
        </div>
        <router-link to="/sign-in" v-if="!isLoggedIn">
          <v-btn class="rounded-lg bg-green-darken-4 text-white"
            >Đăng nhập
          </v-btn>
        </router-link>
        <div class="account position-relative" v-if="isLoggedIn">
          <div
            class="avatar d-flex align-center cursor-pointer"
            @click="showUserMenu = !showUserMenu"
          >
            <img class="rounded-circle" :src="avatarUrl" alt="avatar" />
            <font-awesome-icon
              style="color: #bdc3c7; font-size: 0.8rem"
              :icon="['fas', 'angle-down']"
            />
          </div>
          <transition>
            <div
              class="position-absolute user-dropdown bg-grey-lighten-1 text-grey-darken-4 rounded-lg"
              v-if="showUserMenu"
            >
              <div class="border-b-custom py-2 px-3 font-weight-bold">
                {{ name }}
              </div>
              <ul class="user-menu p-0 m-0 py-2 cursor-pointer">
                <li
                  class="py-2 px-3 text-start hover-bg-green-lighten-2 user-none"
                >
                  <router-link
                    class="text-decoration-none text-grey-darken-4"
                    to="/user/account/profile"
                    >Thông tin</router-link
                  >
                </li>
                <li
                  class="py-2 px-3 text-start hover-bg-green-lighten-2 user-none"
                >
                  <router-link
                    class="text-decoration-none text-grey-darken-4"
                    to="/user/purchase"
                    >Đơn mua</router-link
                  >
                </li>
                <li
                  class="py-2 px-3 text-start hover-bg-green-lighten-2 user-none"
                >
                  <router-link
                    class="text-decoration-none text-grey-darken-4"
                    to="/user/account/password"
                    >Đổi mật khẩu</router-link
                  >
                </li>
                <li
                  class="py-2 px-3 text-start hover-bg-green-lighten-2 user-none"
                  @click="logOut()"
                >
                  Đăng xuất
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </section>
  </nav>
</template>

<style lang="scss" scoped>
@import url("@assets/scss/Navbar/navbar.scss");
nav {
  height: 4rem;
  .search-box {
    &:focus {
      background-color: #ffffff;
    }
    .input-search {
      outline: 2px solid transparent;
    }
  }
}
</style>