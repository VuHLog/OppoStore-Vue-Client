<script setup>
import { computed, onMounted, ref, getCurrentInstance, watch } from "vue";
import VCard from "@components/VCard.vue";

const { proxy } = getCurrentInstance();

const mobilePhonesBestSeller = ref([]);
const categories = ref([]);
const mobilePhonesByCategory = ref({});

onMounted(async () => {
  await proxy.$api
    .get("/api/mobilePhones/best-seller")
    .then((res) => {
      mobilePhonesBestSeller.value = res.result;
    })
    .catch((error) => console.log(error));

  await proxy.$api
    .get("/api/categories")
    .then((res) => {
      categories.value = res.result;

      // Load mobile phones for each category
      res.result.forEach(async (category) => {
        await proxy.$api
          .get("/api/mobilePhones/categories?name=" + category.name)
          .then((res) => {
            mobilePhonesByCategory.value[category.name] = res.result;
          })
          .catch((error) => console.log(error));
      });
    })
    .catch((error) => console.log(error));
});

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
</script>

<template>
  <div>
    <section>
      <div>
        <h4 class="uppercase m-0 text-black mx-1 py-4 border-solid border-b-sm">
          sản phẩm bán chạy
        </h4>
        <div class="d-flex flex-wrap mt-2">
          <template v-for="mp in mobilePhonesBestSeller" :key="mp.id">
            <template v-for="variant in filterByRom(mp.variants)">
              <div class="col-3">
                <v-card :product="mp" :variant="variant"></v-card>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div>
        <template v-for="category in categories" :key="category.id">
          <h4
            class="uppercase m-0 text-black mx-1 py-4 mt-5 border-solid border-b-sm"
          >
            {{ `${category.name} series` }}
          </h4>
          <div class="d-flex flex-wrap mt-2">
            <template
              v-for="mp in mobilePhonesByCategory[category.name]"
              :key="mp.id"
            >
              <template v-for="variant in filterByRom(mp.variants)">
                <div class="col-3">
                  <v-card :product="mp" :variant="variant"></v-card>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
</style>