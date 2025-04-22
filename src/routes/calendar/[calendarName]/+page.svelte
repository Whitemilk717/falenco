<!-- script section 
------------------------------------------------------------ -->
<script>
    import { page } from "$app/state";
    import Header from "$lib/Header.svelte";
    import Menu from "$lib/Menu.svelte";
    import { Calendar, TimeGrid } from "@event-calendar/core";

    const calendarName = page.params.calendarName;

    // calendar options
    let ec = $state();
    let options = $state({
        view: "timeGridWeek",
        events: []
    });
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div class="app-grid">
    <Header />
    <Menu calendarName={calendarName}/>
    
    <div class="app-grid-calendar">
       <Calendar bind:this={ec} plugins={[TimeGrid]} {options} /> 
    </div>
</div>


<!-- CSS section 
------------------------------------------------------------ -->
<style>
     .app-grid {
        height: 100vh;
        width: 100vw;

        overflow-x: hidden;

        display: grid;
        grid-template-rows: repeat(9, 1fr);
        grid-template-columns: repeat(6, 1fr);
    }

    .app-grid-calendar {
        background-color: #131314;

        grid-row-start: 2;
        grid-row-end: 10;
        grid-column-start: 2;
        grid-column-end: 7;

        overflow: auto;
    }
</style>