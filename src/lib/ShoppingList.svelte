<!-- script section 
------------------------------------------------------------ -->
<script>

</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div>
    <p>Lista della spesa:<p>
</div>

<div class="menu-buttons-box">
    <button class="menu-green-button" onclick= { () => console.log('click') }>Aggiungi prodotto</button>
    <button class="menu-red-button" onclick={ () => props.setCalendarState(0) }>Esci</button>
</div>