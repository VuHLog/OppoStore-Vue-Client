<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { inject } from "vue";

const { proxy } = getCurrentInstance();
const swal = inject("$swal");
const errorMsg = ref("");
const password = ref("");
const passwordConfirm = ref("");

const user = ref({
  password: "",
  email: "",
  phone: "",
  fullName: "",
  avatarUrl: "",
  roles: [],
});

onMounted(() => {
  proxy.$api
    .get("/api/users/myInfo")
    .then((res) => {
      Object.assign(user.value, res.result);
      delete user.user_roles;
      user.value.roles = res.result.user_roles.map((role) => role.role);
    })
    .catch((error) => console.log(error));
});

async function changePassword() {
  errorMsg.value = "";
  if (password.value !== passwordConfirm.value) {
    errorMsg.value = "Mật khẩu không khớp, vui lòng nhập lại !";
    return;
  }
  if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/.test(password.value.trim())) {
    errorMsg.value =
      "Mật khẩu phải có ít nhất 8 ký tự chứa ít nhất một ký tự viết hoa, viết thường và chữ số";
    return;
  }

  user.value.password = password.value;

  await proxy.$api
    .put("/api/users/" + user.value.id, user.value)
    .then((res) => {
      if (res.message) {
        errorMsg.value = res.message;
      } else {
        swal.fire({
          title: "Cập Nhật Mật Khẩu Thành Công!",
          icon: "success",
        });
      }
    })
    .catch((error) => console.log(error));
}
</script>

<template>
  <div class="rounded ml-7 px-7" style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
    <div class="py-3 text-grey-darken-4 border-b-sm border-solid">
      <h5>Mật Khẩu</h5>
      <p class="mt-1 text-grey-lighten-2">
        Thay đổi mật khẩu
      </p>
    </div>
    <div class="p-4 d-flex flex-wrap">
      <form
        class="mt-8 space-y-6 mb-4 w-100"
        method="POST"
        @submit.prevent="changePassword()"
      >
        <div class="mt-4 d-flex align-center">
          <label
            for="password"
            class="d-inline-block mb-2 text-sm font-medium text-grey-lighten-1 col-3 text-end"
            >Mật khẩu mới</label
          >
          <input
            v-model="password"
            id="password"
            type="password"
            class="input-box-shadow-none form-control outline-none text-grey-darken-4 ml-3"
          />
        </div>

        <div class="mt-4 d-flex align-center">
          <label
            for="passwordConfirm"
            class="d-block mb-2 text-sm font-medium text-grey-lighten-1 col-3 text-end"
            >Nhập lại mật khẩu mới</label
          >
          <input
            v-model="passwordConfirm"
            id="passwordConfirm"
            type="password"
            class="input-box-shadow-none form-control outline-none text-grey-darken-4 ml-3"
          />
        </div>

        <div class="text-start text-red" v-if="errorMsg">
          {{ errorMsg }}
        </div>

        <div class="w-100 text-start mt-4 text-center">
          <v-btn
          type="submit"
          class="bg-green-darken-4 rounded text-sm font-medium ml-16"
          >Lưu</v-btn
        >
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>