<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { inject } from "vue";

const { proxy } = getCurrentInstance();
const swal = inject("$swal");
const file = ref(null);
const errorMsg = ref("");

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

async function handleFileUpload(event) {
  file.value = event.target.files[0];
  if (file.value !== null) {
    await submitFile();
  }
}

async function submitFile() {
  let formData = new FormData();

  formData.append("image", file.value);
  await proxy.$api
    .postFile("/cloudinary/upload", formData)
    .then((res) => {
      user.value.avatarUrl = res.url;
      console.log(res.url);
    })
    .catch((error) => console.log(error));
}

async function updateUser() {
  errorMsg.value = "";
  if (!/^.{8,}$/.test(user.value.fullName.trim())) {
    errorMsg.value = "Họ tên phải có ít nhất 8 ký tự";
    return;
  }

  await proxy.$api
    .put("/api/users/" + user.value.id, user.value)
    .then((res) => {
      if (res.message) {
        errorMsg.value = res.message;
      } else {
        swal.fire({
          title: "Cập Nhật Thông Tin Thành Công!",
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
      <h5>Thông Tin Của Tôi</h5>
      <p class="mt-1 text-grey-lighten-2">
        Quản lý thông tin để bảo mật tài khoản
      </p>
    </div>
    <div class="p-4 d-flex flex-wrap">
      <div class="col-8">
        <div class="d-flex flex-wrap align-center pb-7 pb">
          <div class="col-3 text-end">
            <label class="text-grey-lighten-1 mr-5">Tên đăng nhập</label>
          </div>
          <div class="col-9">
            <p class="m-0 text-grey-darken-4">{{ user.username }}</p>
          </div>
        </div>
        <div class="d-flex flex-wrap align-center pb-7">
          <div class="col-3 text-end">
            <label class="text-grey-lighten-1 mr-5">Tên</label>
          </div>
          <div class="col-9">
            <input
              v-model="user.fullName"
              type="text"
              class="input-box-shadow-none form-control outline-none text-grey-darken-4"
            />
          </div>
        </div>
        <div class="d-flex flex-wrap align-center pb-7">
          <div class="col-3 text-end">
            <label class="text-grey-lighten-1 mr-5">Email</label>
          </div>
          <div class="col-9">
            <input
              v-model="user.email"
              type="text"
              class="input-box-shadow-none form-control outline-none text-grey-darken-4"
            />
          </div>
        </div>
        <div class="d-flex flex-wrap align-center pb-7">
          <div class="col-3 text-end">
            <label class="text-grey-lighten-1 mr-5">Số điện thoại</label>
          </div>
          <div class="col-9">
            <input
              v-model="user.phone"
              type="text"
              class="input-box-shadow-none form-control outline-none text-grey-darken-4"
            />
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="border-s-sm border-solid d-flex align-center flex-column">
          <div class="py-4">
            <img
              class="rounded-circle h-24"
              :src="user.avatarUrl"
              alt="avatar"
            />
          </div>
          <input
            id="input-image"
            class="d-none"
            type="file"
            accept=".jpg,.jpeg,.png"
            @change="handleFileUpload($event)"
          />
          <label
            for="input-image"
            class="p-2 cursor-pointer rounded-sm bg-white border-sm border-solid text-grey-darken-4 box-shadow-none"
          >
            Chọn Ảnh
          </label>
          <div class="text-12 text-grey-lighten-1 mt-3">
            <p class="m-0">Dụng lượng file tối đa 1 MB</p>
            <p class="m-0">Định dạng:.JPEG, .PNG, .JPG</p>
          </div>
        </div>
      </div>
      <div class="w-100 mt-4 text-center">
        <v-btn
          type="button"
          class="bg-green-darken-4 rounded text-sm font-medium"
          @click="updateUser"
          >Lưu</v-btn
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>