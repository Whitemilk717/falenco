<!-- script section 
------------------------------------------------------------ -->
<script>
    import { page } from "$app/state";
    import Header from "$lib/Header.svelte";

    const calendarName = page.params.calendarName;
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div class="app-grid">
    <Header />

    <div class="app-grid-menu">
        {calendarName}
        <br>
        Menu
    </div>
    
    <div class="app-grid-calendar">
        Calendario
    </div>
</div>


<!-- CSS section 
------------------------------------------------------------ -->
<style>
    .app-grid {
        height: 100vh;
        width: 100vw;

        display: grid;
        grid-template-rows: repeat(9, 1fr);
        grid-template-columns: repeat(6, 1fr);
    }


    .app-grid-menu {
        background-color: #1C1C1C;

        grid-row-start: 2;
        grid-row-end: 10;

        grid-column-start: 1;
        grid-column-end: 2;
    }

    .app-grid-calendar {
        background-color: #131314;

        grid-row-start: 2;
        grid-row-end: 10;
        
        grid-column-start: 2;
        grid-column-end: 7;
    }
</style>