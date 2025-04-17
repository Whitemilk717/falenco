<!-- script section 
------------------------------------------------------------ -->
<script>

</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div class="app-grid-header">
    <h1>FaLenCo</h1>

    <div class="header-buttons-box">
        <button class="header-button" onclick={ () => console.log('Click') }>
            <img src="/icons/shopping-cart.png" alt="shopping cart icon">
        </button>

        <button class="header-button" onclick={ () => console.log('Click') }>
            <img src="/icons/plus.png" alt="shopping cart icon">
        </button>
    </div>
</div>


<!-- CSS section 
------------------------------------------------------------ -->
<style>
    .app-grid-header {
        background-color: #191919;

        grid-row-start: 1;
        grid-row-end: 2;

        grid-column-start: 1;
        grid-column-end: 7;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        padding: 10px 20px 10px 20px;
    }

    .header-buttons-box {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 10px;
    }

    .header-button {
        background-color: #191919;

        border-radius: 50px;
    }
</style>