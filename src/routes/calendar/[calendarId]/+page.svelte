<!-- script section 
------------------------------------------------------------ -->
<script>
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import Header from "$lib/Header.svelte";
    import AddEvent from "$lib/AddEvent.svelte";
    import DefaultMenu from "$lib/DefaultMenu.svelte";
    import ShoppingList from "$lib/ShoppingList.svelte";
    import EditCalendar from "$lib/EditCalendar.svelte";
    import ChangePassword from "$lib/ChangePassword.svelte";
    import { Calendar, TimeGrid } from "@event-calendar/core";


    let calendarState = $state(0);                      // determines what the menu shows
    let calendarId = $state(page.params.calendarId);

    /* calendar options
    -------------------------------------------------------- */
    let ec = $state();
    let options = $state({
        view: "timeGridWeek",
        events: []
    });

    /* function to change calendarState
    -------------------------------------------------------- */
    function setCalendarState(newState) {
        calendarState = newState;
    }
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div class="app-grid">

    <!-- header
    -------------------------------------------------------- -->
    <Header 
        calendarId={calendarId} 
        setCalendarState={setCalendarState}
    />

    <!-- menu 
    -------------------------------------------------------- -->
    <div class="menu-box">

        <!-- 0: default 
        ---------------------------------------------------- -->
        {#if calendarState === 0}
            <DefaultMenu 
                setCalendarState={setCalendarState} 
                calendarId={calendarId}
            />
        
        <!-- 1: shopping list
        ---------------------------------------------------- -->
        {:else if calendarState === 1}
            <ShoppingList
                setCalendarState={setCalendarState}
                calendarId={calendarId}
            />
        
        <!-- 2: add event
        ---------------------------------------------------- -->
        {:else if calendarState === 2}
            <AddEvent
                setCalendarState={setCalendarState}
            />
            

        <!-- 3: change password
        ---------------------------------------------------- -->
        {:else if calendarState === 3}
            <ChangePassword 
                setCalendarState={setCalendarState} 
            />


        <!-- 4: edit calendar
        ---------------------------------------------------- -->
        {:else if calendarState === 4}
            <EditCalendar 
                calendarId={calendarId}
                setCalendarState={setCalendarState}
            />

        {/if}
    </div>
    
    <!-- calendar
    -------------------------------------------------------- -->
    <div class="calendar-box">
        <Calendar 
            bind:this={ec}
            plugins={[TimeGrid]}
            {options} 
        /> 
    </div>
</div>