<script lang="ts">
  export let restart: () => void
</script>

<button on:click={restart} class="w-[100px] h-[50px] rounded-full bg-red-600 font-bold border-2 border-white absolute left-[35%] top-[39%] flex justify-center items-center z-10">RESTART</button>
