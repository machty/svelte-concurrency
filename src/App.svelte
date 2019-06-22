<script>
	import Other from './Other.svelte';
	export let name;

	let isShowing = true;
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>svelte-concurrency</h1>

<button on:click={() => isShowing = !isShowing }>Toggle</button>

{#if isShowing}
	<Other />
{/if}



