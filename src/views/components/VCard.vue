<script setup>
import { ref } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 200,
  },
  heightImage: {
    type: Number,
    default: 200,
  },
  product:{
    type: Object,
    required: true,
  },
  variant:{
    type:Object,
    required: false,
  }
});
</script>
<template>
  <div
    id="card"
    class="d-inline-block overflow-hidden w-100 border-sm border-solid h-100"
  >
    <router-link
      class="d-block position-relative text-decoration-none w-100 pt-3 pb-4 px-4 text-grey-darken-4"
      :to="'/mobile-phone/' + props.variant?.id"
    >
      <div class="d-flex justify-center my-3 product-image">
        <img
          class="object-contain h-12_5"
          :src="props.variant.image"
          alt=""
        />
      </div>
      <p class="uppercase text-14 mb-1 hover-text-green-lighten-2 product-name">
        {{ `${props.product.name} ${props.product.ram}GB/${props.variant.rom.capacity}GB` }}
      </p>
      <div class="mb-1">
        <span class="text-12 p-1 mr-1 bg-grey-lighten-3 uppercase">{{props.product.screen}}</span>
        <span class="text-12 p-1 mr-1 bg-grey-lighten-3 uppercase">{{props.product.resolution}}</span>
      </div>
      <p class="m-0 text-red-accent-3 font-weight-bold">
        {{ new Intl.NumberFormat("en-DE").format(props.variant.price) + "₫" }}
      </p>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
#card {
  &:hover .product-image {
    transform: translateY(-8px);
  }
  &:hover .product-name {
    color: #388E3C;
  }
  .product-image {
    transition: all 300ms ease-in-out;
  }
}
</style>