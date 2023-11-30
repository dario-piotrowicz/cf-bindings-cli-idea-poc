<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<main>
    <h1>{data.text}</h1>
</main>