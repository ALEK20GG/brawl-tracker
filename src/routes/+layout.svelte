<script lang="ts">
    import "../app.css"

    let { children } = $props()
</script>

<div class="w-screen h-screen overflow-hidden relative">
    {@render children()}
</div>