<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth } from "$lib/firebase";
    import { sendPasswordResetEmail } from "firebase/auth";


    /* password recover function
    -------------------------------------------------------- */
    let email = "";

    function passwordRecover() {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Email inviata con successo!");
                email = "";
            })
            .catch((error) => {
                console.log(error);
            });
    }
</script>



<!-- HTML section 
------------------------------------------------------------ -->
<form class="main-box" onsubmit={ () => passwordRecover() }>
    <h1 class="main-title">FaLenCo</h1>

    <p class="center-paragraph">
        Inserisci la tua email e riceverai le
        <br> 
        instruzioni per il reset della password
    </p>

    <input class="main-input" type="email" bind:value={email} placeholder="Email" required><br>

    <div class="inline-buttons">
        <button type="button" class="small-red-button" onclick={ () => goto("/") }>Annulla</button>
        <button type="submit" class="small-green-button">Invia email</button>
    </div>
</form>