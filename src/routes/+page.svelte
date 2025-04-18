<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth } from "$lib/firebase";

    // service worker registration
    if ("serviceWorker" in navigator) {                                             // true: the browser supports service workers
        navigator.serviceWorker
            .register("/service-worker.js", { type: "module" })                     // "type: module" is required for manual service workers
            .then(serviceWorker => {
                console.log("Service Worker registered: ", serviceWorker);
            })
            .catch(error => {
                console.error("Error registering the Service Worker: ", error);
            })
    }

    // input declarations
    let email = "";
    let password = "";
    let family = "";

    
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<form class="main-box">
    <h1 class="main-title">FaLenCo</h1>

    <input class="main-input" type="email" bind:value={email} placeholder="Email" required><br>
    <input class="main-input" type="password" bind:value={password} placeholder="Password" required><br>
    <input class="main-input" type="text" bind:value={family} placeholder="Nome famiglia" required><br>

    <button class="access-button" onclick={ () => goto("/calendar") }>Accedi</button>

    <span>Prima volta? 
        <a class="link" href="/registration">Crea un account</a> 
        oppure 
        <a class="link" href="/family-creation">crea un gruppo famiglia</a>
    </span>
</form>


<!-- CSS section 
------------------------------------------------------------ -->
<style>    
    .access-button {
        color: white;
        font-family: inherit;
        font-size: calc(0.8vw + 0.8vh);
        
        width: 15vw;
        min-width: 20px;
        height: 7vh;
        min-height: 10px;
        margin: calc(0.2vw + 0.2vh);
        border-radius: 15px;
        background-color: #008A5A;
    }
    
    span {
        font-size: calc(0.5vw + 0.5vh);
    
        margin: calc(0.2vw + 0.2vh);
    }
    
    .link {
        color: aqua;
    }
</style>