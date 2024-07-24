<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import VCard from "@components/VCard.vue";

const { proxy } = getCurrentInstance();
const route = useRoute();
const variantId = ref(route.params.variantId);

const variantAccessed = ref({}); // biến thể được truy cập
const mobilePhoneId = ref({});
const mobilePhone = ref({}); // điện thoại được truy cập
const variantsMobilePhone = ref([]); // các biến thể của điện thoại
const colorSelected = ref({}); // màu được chọn
const romSelected = ref({}); // rom được chọn
const variantsByColor = ref([]); //các biến thể của màu ( rom theo màu)
const uniqueColors = ref([]); //các màu của điện thoại
onMounted(async () => {
  await loadVariantAccessed(variantId.value);

  await proxy.$api
    .get("/api/mobilePhones/" + mobilePhoneId.value)
    .then((res) => {
      mobilePhone.value = res.result;
      variantsMobilePhone.value = mobilePhone.value.variants;
    })
    .catch((error) => console.log(error));

  // Lấy danh sách các màu sắc khác nhau
  const colorSet = new Set();
  variantsMobilePhone.value.forEach((variant) => {
    const colorString = JSON.stringify(variant.color);
    if (!colorSet.has(colorString)) {
      colorSet.add(colorString);
      uniqueColors.value.push({
        color: variant.color,
        image: variant.image,
      });
    }
  });

  await loadVariantsByColor(colorSelected.value);
});

async function loadVariantAccessed(variantId) {
  await proxy.$api
    .get("/api/variants/" + variantId)
    .then((res) => {
      variantAccessed.value = res.result;
      mobilePhoneId.value = variantAccessed.value.mobilePhone.id;
    })
    .catch((error) => console.log(error));

  colorSelected.value = variantAccessed.value.color;
  romSelected.value = variantAccessed.value.rom;
}

async function loadVariantsByColor(color) {
  await proxy.$api
    .get("/api/variants/" + mobilePhoneId.value + "/" + color.id)
    .then((res) => {
      variantsByColor.value = res.result.map((val) => val);
    })
    .catch((error) => console.log(error));

  variantAccessed.value = variantsByColor.value[0];
  colorSelected.value = color;
  romSelected.value = variantAccessed.value.rom;
}

const currentSlide = ref(0);

function slideTo(val) {
  currentSlide.value = val;
}
</script>

<template>
  <div>
    <section>
      <div class="border-b-sm border-solid pb-3">
        <div>
          <h5 class="uppercase font-weight-bold">
            {{
              `${mobilePhone.name} ${mobilePhone.ram}GB ${variantAccessed.rom?.capacity}GB`
            }}
          </h5>
        </div>
      </div>
      <div class="d-flex flex-wrap mt-3">
        <div class="col-6">
          <div class="gallary-product">
            <Carousel
              class="pt-4 pb-8 mb-2 rounded-lg border-sm border-solid"
              :items-to-show="1"
              :wrap-around="true"
              v-model="currentSlide"
            >
              <Slide v-for="variant in variantsMobilePhone" :key="variant">
                <div class="carousel__item">
                  <img
                    class="object-contain h-12_5"
                    :src="variant.image"
                    alt=""
                  />
                </div>
              </Slide>

              <template #addons>
                <Navigation>
                  <template #next>
                    <font-awesome-icon
                      class="arrow-right"
                      :icon="['fas', 'angle-right']"
                    />
                  </template>
                  <template #prev>
                    <font-awesome-icon
                      class="arrow-left"
                      :icon="['fas', 'angle-left']"
                    />
                  </template>
                </Navigation>
              </template>
            </Carousel>
            <div>
              <div class="d-flex">
                <template
                  v-for="(variant, index) in variantsMobilePhone"
                  :key="variant"
                >
                  <div
                    class="thumbnail mr-2 border-solid border-sm rounded-lg"
                    @click="slideTo(index)"
                    :class="index === currentSlide ? 'active' : ''"
                  >
                    <img
                      class="object-contain h-12_5 cursor-pointer rounded-lg"
                      :src="variant.image"
                      alt=""
                      style="height: 50px"
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="pl-5">
            <p class="m-0 mb-3 text-red-accent-3 font-weight-black" v-if="variantAccessed.stock > 0">
              {{
                new Intl.NumberFormat("en-DE").format(variantAccessed.price) +
                "₫"
              }}
            </p>
            <p class="m-0 mb-3 text-red-accent-3 font-weight-bold" v-else>
              Hết Hàng
            </p>
            <div class="d-flex flex-wrap">
              <template v-for="variant in variantsByColor" :key="variant.id">
                <div class="col-4">
                  <div
                    class="text-center p-1 mr-2 mb-2 rounded-lg border-solid border-sm text-12 cursor-pointer"
                    :class="[
                      JSON.stringify(variant.rom) ===
                      JSON.stringify(romSelected)
                        ? 'active'
                        : '',
                      variant.stock <= 0 ? 'disable' : '',
                    ]"
                    @click="loadVariantAccessed(variant.id)"
                  >
                    <div>
                      <strong>{{ variant.rom.capacity }}GB</strong>
                    </div>
                    <span>
                      {{
                        new Intl.NumberFormat("en-DE").format(variant.price) +
                        "₫"
                      }}
                    </span>
                  </div>
                </div>
              </template>
            </div>
            <p class="font-weight-bold text-14 mb-2">Chọn màu để xem giá</p>
            <div class="d-flex flex-wrap">
              <template v-for="color in uniqueColors" :key="color.color.id">
                <div class="col-4">
                  <div
                    class="d-flex align-center justify-center p-1 mr-2 mb-2 rounded-lg border-solid border-sm text-12 cursor-pointer"
                    :class="[
                      JSON.stringify(color.color) ===
                      JSON.stringify(colorSelected)
                        ? 'active'
                        : '',
                    ]"
                    @click="loadVariantsByColor(color.color)"
                  >
                    <div class="d-flex">
                      <div class="mr-3">
                        <img
                          class="object-contain h-12_5 cursor-pointer rounded-lg"
                          :src="color.image"
                          alt=""
                          style="height: 30px"
                        />
                      </div>
                      <div>
                        <div>
                          <strong>{{ color.color.name }}</strong>
                        </div>
                        <span>
                          {{
                            new Intl.NumberFormat("en-DE").format(
                              variantAccessed.price
                            ) + "₫"
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div class="mb-3 d-flex justify-space-between">
              <v-btn
                type="button"
                class="rounded py-2 px-4 bg-green-darken-4 mr-2"
                style="width: calc(100% - 70px)"
              >
                <strong>MUA NGAY</strong>
              </v-btn>
              <v-btn
                type="button"
                class="rounded py-2 px-4 border-solid border-green-darken-4 box-shadow-none mr-2"
                style="width: calc(60px)"
              >
                <font-awesome-icon
                  class="text-green-darken-4"
                  :icon="['fas', 'cart-plus']"
                />
              </v-btn>
            </div>
            <div class="mb-3 px-3 pt-3 pb-1 technical-info rounded-lg">
              <div>
                <h5 class="font-weight-medium mb-3">Thông số kỹ thuật</h5>
              </div>
              <ul
                class="text-14 technical-content border-solid border-sm p-0 rounded-lg"
              >
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">Màn hình</p>
                  <div>
                    {{ `${mobilePhone.screen}, ${mobilePhone.resolution}` }}
                  </div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">Hệ điều hành</p>
                  <div>{{ mobilePhone.operatingSystem }}</div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">Camera sau</p>
                  <div>{{ mobilePhone.frontCamera }}</div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">Camera trước</p>
                  <div>{{ mobilePhone.rearCamera }}</div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">Chip</p>
                  <div>{{ mobilePhone.cpu }}</div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">RAM</p>
                  <div>{{ mobilePhone.ram }}GB</div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">Dung lượng lưu trữ</p>
                  <div>{{ variantAccessed.rom?.capacity }}GB</div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">SIM</p>
                  <div>{{ mobilePhone.sim }}</div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">SIM</p>
                  <div>{{ mobilePhone.memoryStick }}</div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">Pin, Sạc</p>
                  <div>
                    {{ `${mobilePhone.battery} mAh, ${mobilePhone.charger}W` }}
                  </div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">Kích thước</p>
                  <div>{{ `${mobilePhone.size}` }}</div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">Trọng lượng</p>
                  <div>{{ `${mobilePhone.weight}` }}</div>
                </li>
                <li
                  class="technical-content-item p-2 d-flex align-center justify-space-between"
                >
                  <p class="m-0">Hãng</p>
                  <div>{{ `OPPO ` }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.gallary-product {
  .carousel__item {
    min-height: 200px;
    width: 100%;
    background-color: #ffffff;
    color: var(--vc-clr-white);
    font-size: 20px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .carousel__slide {
    padding: 10px;
  }

  .carousel__prev,
  .carousel__next {
    box-sizing: content-box;
    border: 5px solid white;
  }
  .arrow-left,
  .arrow-right {
    background-color: #ecf0f1;
    border-radius: 50%;
    padding: 8px;
  }
  .thumbnail.active {
    border-color: #388e3c !important;
  }
}

.active {
  border-color: #388e3c !important;
}

.disable {
  opacity: 0.5;
  pointer-events: none;
}

.technical-info {
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.1),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
  .technical-content {
    & li:nth-child(odd) {
      background-color: #f2f2f2;
    }
    .technical-content-item {
      p:first-child {
        width: 40%;
      }
      div {
        width: 50%;
      }
    }
  }
}
</style>