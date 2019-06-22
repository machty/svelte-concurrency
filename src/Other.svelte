<script>
  export let count = 123;
  import { task, timeout, restartable, enqueued, drop } from './concurrency.js'

  let myTask = task({
    trackState: true,
    policy: drop,

    *perform(n) {
      count = n;
      while (count--) {
        yield timeout(10);
      }
      return Math.floor(Math.random() * 100);
    }
  });


</script>

<style>
  .Other {
    padding: 1.5rem;
    background-color: #99bbbb;
    font-size: 2rem;
  }
</style>

<div class="Other">
  <p>count = {count}</p>
  <button on:click={() => myTask.perform(100)}>
    { $myTask.isRunning ? "Running..." : "Click Me" }
  </button>
  {#if $myTask.lastSuccessful}
    <p>
      The last value returned from myTask was
      { $myTask.lastSuccessful.value }
    </p>
  {/if}
</div>
