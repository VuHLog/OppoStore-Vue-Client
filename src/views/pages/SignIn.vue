<script setup>
import { ref ,getCurrentInstance } from "vue";
import { useBaseStore } from "@/store/index.js";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();

const store = useBaseStore();

const router = useRouter();

const errorMsg = ref("");

const user = ref({
  username: "",
  password: ""
});

async function signIn() {
  await proxy.$api.post("/auth/token", user.value).then((res) => {
    sessionStorage.setItem("token",res.result.token);
    
    router.push("/dashboard")
  }).catch(() =>{
    errorMsg.value = "Tài khoản, mật khẩu không chính xác";
  })
}
</script>

<template>
  
</template>

<style lang="scss" scoped>
.main-content {
  height: 100vh;
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