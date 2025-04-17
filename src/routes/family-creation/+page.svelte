<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from '$app/navigation';
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<form class="main-box">
    <h1 class="main-title">FaLenCo</h1>
    
    <input class="main-input" type="text" placeholder="Nome famiglia" required><br>
    <input class="main-input" type="number" placeholder="Numero membri" required><br>

    <div class="inline-buttons">
        <button class="cancel-button" onclick={ () => goto('/') }>Annulla</button>
        <button class="registration-button">Registrati</button>
    </div>
</form>


<!-- CSS section 
------------------------------------------------------------ -->
<style>
    .inline-buttons {
        display: flex;
        flex-direction: row;
    }

    .cancel-button {
        color: white;
        font-family: inherit;
        font-size: calc(0.8vw + 0.8vh);
        
        width: 10vw;
        min-width: 20px;
        height: 7vh;
        min-height: 10px;
        margin: calc(0.2vw + 0.2vh);
        border-radius: 15px;
        background-color: #7A0000;
    }

    .registration-button {
        color: white;
        font-family: inherit;
        font-size: calc(0.8vw + 0.8vh);
        
        width: 10vw;
        min-width: 20px;
        height: 7vh;
        min-height: 10px;
        margin: calc(0.2vw + 0.2vh);
        border-radius: 15px;
        background-color: #008A5A;
    }
</style>