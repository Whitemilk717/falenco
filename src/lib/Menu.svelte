<!-- script section 
------------------------------------------------------------ -->
<script>
    import Members from "$lib/Members.svelte";

    const props = $props();
</script>


<!-- HTML section 
------------------------------------------------------------ -->
    <div class="menu-box">
        <div>
            <h2>{props.calendarName}</h2>

            <p>Membri:</p>
            <Members calendarName={props.calendarName} />
        </div>

        <div class="menu-buttons-box">
            <button class="menu-button">Cambia calendario</button>
            <button class="menu-button">Modifica profilo</button>
            <button class="menu-button">Modifica calendario</button>
            <button class="menu-esc-button">Esci</button>
        </div>
    </div>


<!-- CSS section 
------------------------------------------------------------ -->
<style>
    .menu-box {
        background-color: #1C1C1C;

        margin: 10px;

        grid-row-start: 2;
        grid-row-end: 10;
        grid-column-start: 1;
        grid-column-end: 2;

        display: flex;
        flex-direction: column;
        justify-content:space-between;
    }

    .menu-buttons-box {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        gap: 5px;
    }

    .menu-button {
        color: white;
        background-color: #474545;

        height: 5vh;
        border-radius: 50px;
    }


    .menu-esc-button {
        color: white;
        background-color: #7A0000;

        height: 5vh;
        border-radius: 50px;
    }
</style>