<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useBaseStore } from "@/store/index.js";
import { useRouter,useRoute } from "vue-router";

const { proxy } = getCurrentInstance();

const store = useBaseStore();

const router = useRouter();

const route = useRoute();
const redirect = route.query.redirect?route.query.redirect:'/home';

const errorMsg = ref("");

const user = ref({
  username: "",
  password: "",
});

onMounted(() => {
  if (store.username !== "") {
    return router.push(redirect);
  }
});

async function signIn() {
  errorMsg.value = "";
  if (user.value.username === "" || user.value.password === "") {
    errorMsg.value = "Bạn phải nhập đầy đủ tài khoản mật khẩu!";
    return;
  }
  await proxy.$api
    .post("/auth/token", user.value)
    .then((res) => {
      localStorage.setItem("token", res.result.token);
      store.isLoggedIn = true;
      router.push(redirect);
    })
    .catch(() => {
      errorMsg.value = "Tài khoản, mật khẩu không chính xác!";
    });
}

const callback = async (response) => {
  //Gửi thông tin này đến máy chủ của bạn để xử lý đăng nhập
  const res = await proxy.$api.post("/auth/google", {
    token: response.credential,
  });
  console.log("token ", res.result.token);
  localStorage.setItem("token", res.result.token);
  store.isLoggedIn = true;
  router.push(redirect);
};
</script>

<template>
  <div>
    <div class="pa-10 d-flex align-center justify-center">
      <div class="d-flex flex-column w-50 main-form pa-8 rounded-lg">
        <h4 class="font-weight-bold">Đăng nhập</h4>
        <form
          class="mt-8 space-y-6 mb-4"
          method="POST"
          @submit.prevent="signIn"
        >
          <input
            v-model.trim="user.username"
            class="form-control p-3 mb-4"
            type="text"
            placeholder="Tên đăng nhập"
          />
          <input
            v-model.trim="user.password"
            class="form-control p-3"
            type="password"
            placeholder="Mật khẩu"
            autocomplete="on"
          />

          <div class="text-start text-red" v-if="errorMsg">
            {{ errorMsg }}
          </div>

          <div class="text-start my-4">
            <input id="remember" class="mr-2" type="checkbox" />
            <label for="remember">Nhớ mật khẩu</label>
          </div>
          <v-btn
            type="submit"
            class="rounded-lg w-100 py-2 px-5 bg-green-darken-4"
            color="#ffffff"
          >
            Đăng nhập
          </v-btn>
        </form>
        <div class="d-flex align-center">
          <div class="p__MPF"></div>
          <div class="px-3">Hoặc</div>
          <div class="p__MPF"></div>
        </div>

        <GoogleLogin
          class="w-100 d-flex justify-center my-4"
          :callback="callback"
        />

        <p>
          Bạn chưa có tài khoản?
          <router-link to="/sign-up">
            <strong>Đăng ký</strong>
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-form {
  color: rgb(255, 255, 255);
  background-color: #27272a;
  .form-control {
    box-shadow: none;
  }
  .banner {
    img {
      object-fit: cover;
      height: 600px;
    }
  }
  .btn-submit {
    border-radius: 10px;
  }
}
</style>