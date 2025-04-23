<!-- script section 
------------------------------------------------------------ -->
<script>
    let props = $props();
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div>
    <p>Nuovo evento<p>
</div>

<div class="menu-buttons-box">
    <button class="menu-green-button" onclick= { () => console.log('click') }>Salva</button>
    <button class="menu-red-button" onclick={ () => props.setCalendarState(0) }>Annulla</button>
</div>
