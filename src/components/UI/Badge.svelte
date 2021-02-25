<script>
  import { fly } from "svelte/transition";
  import { cubicInOut } from "svelte/easing";
</script>

<span
  transition:fly={{
    duration: 300,
    x: 50,
    opacity: 0,
    easing: cubicInOut,
  }}><slot /></span
>

<style>
  span {
    display: inline-block;
    margin: 0 0.25rem;
    border-radius: 3px;
    border: 1px solid #cf0056;
    background: #cf0056;
    color: white;
    padding: 0 0.5;
    font-family: "Lato", sans-serif;
    font-size: 0.8rem;
  }
</style>
