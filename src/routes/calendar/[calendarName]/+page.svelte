<!-- script section 
------------------------------------------------------------ -->
<script>
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { disconnect } from "$lib/disconnect.js";
    import ShowMembers from "$lib/ShowMembers.svelte";
    import { Calendar, TimeGrid } from "@event-calendar/core";

    let calendarState = $state(0);                  // determines what the menu shows
    const calendarName = page.params.calendarName;

    /* calendar options
    -------------------------------------------------------- */
    let ec = $state();
    let options = $state({
        view: "timeGridWeek",
        events: []
    });
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div class="app-grid">

    <!-- header
    -------------------------------------------------------- -->
    <div class="header-box">
        <h1>FaLenCo</h1>
    
        <div>
            <button class="header-button" onclick={ () => calendarState=1 }>
                <img src="/icons/shopping-cart.png" alt="shopping cart icon">
            </button>
    
            <button class="header-button" onclick={ () => calendarState=2 }>
                <img src="/icons/plus.png" alt="shopping cart icon">
            </button>
        </div>
    </div>

    <!-- menu 
    -------------------------------------------------------- -->
    <div class="menu-box">

        <!-- 0: default 
        ---------------------------------------------------- -->
        {#if calendarState === 0}
            <div>
                <h2>{calendarName}</h2>

                <p>Membri:</p>
                <ShowMembers calendarName={calendarName} />
            </div>

            <div class="menu-buttons-box">
                <button class="menu-button" onclick={ () => goto("/calendar-selection") }>Cambia calendario</button>
                <button class="menu-button" onclick= { () => calendarState=3 }>Modifica profilo</button>
                <button class="menu-button" onclick= { () => calendarState=4 }>Modifica calendario</button>
                <button class="menu-red-button" onclick={ () => disconnect() }>Esci</button>
            </div>
        
        <!-- 1: shopping list
        ---------------------------------------------------- -->
        {:else if calendarState === 1}
            <div>
                <h2>{calendarName}</h2>
                <p>Lista della spesa:<p>
            </div>

            <div class="menu-buttons-box">
                <button class="menu-green-button" onclick= { () => console.log('click') }>Aggiungi prodotto</button>
                <button class="menu-red-button" onclick={ () => calendarState=0 }>Esci</button>
            </div>
        
        <!-- 2: add event
        ---------------------------------------------------- -->
        {:else if calendarState === 2}
            <div>
                <h2>{calendarName}</h2>
                <p>Nuovo evento<p>
            </div>

            <div class="menu-buttons-box">
                <button class="menu-green-button" onclick= { () => console.log('click') }>Salva</button>
                <button class="menu-red-button" onclick={ () => calendarState=0 }>Esci</button>
            </div>

        <!-- 3: edit profile
        ---------------------------------------------------- -->
        {:else if calendarState === 3}
            <div>
                <h2>{calendarName}</h2>
                <p>Modifica profilo<p>
            </div>

            <div class="menu-buttons-box">
                <button class="menu-green-button" onclick= { () => console.log('click') }>Salva</button>
                <button class="menu-red-button" onclick={ () => calendarState=0 }>Esci</button>
            </div>

        <!-- 4: edit calendar
        ---------------------------------------------------- -->
        {:else if calendarState === 4}
            <div>
                <h2>{calendarName}</h2>
                <p>Modifica calendario<p>
            </div>

            <div class="menu-buttons-box">
                <button class="menu-green-button" onclick= { () => console.log('click') }>Salva</button>
                <button class="menu-red-button" onclick={ () => calendarState=0 }>Esci</button>
            </div>
        {/if}
    </div>
    
    <!-- calendar
    -------------------------------------------------------- -->
    <div class="calendar-box">
       <Calendar bind:this={ec} plugins={[TimeGrid]} {options} /> 
    </div>
</div>