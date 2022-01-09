<script lang="ts">
  export let gameOver: boolean;
</script>

<div
  class="relative w-[344px] h-[344px] flex flex-wrap bg-green-100 border-4 rounded border-white"
  class:gameOver
>
  <slot />
</div>

<style>
  .gameOver {
    border-color: #c7372f;
  }
</style>
