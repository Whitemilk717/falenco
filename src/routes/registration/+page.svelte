<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth } from "$lib/firebase";
    import { createUserWithEmailAndPassword } from "firebase/auth";

    // input declarations
    let email = "";
    let password = "";

    // user creation
    function userCreation() {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Registrazione avvenuta con successo!");
                goto("/");
            })
            .catch((error) => {
                if(error.code === "auth/weak-password") {
                    alert("La password dovrebbe essere lunga almeno 6 caratteri. Riprova!");
                    password = "";
                }
                else if(error.code === "auth/email-already-in-use") {
                    alert("La mail è già in uso. Riprova!");
                    email = "";
                }
                else {
                    console.error(error);
                }
            })
    }
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<form class="main-box" onsubmit={ () => userCreation() }>
    <h1 class="main-title">FaLenCo</h1>
    
    <input class="main-input" type="email" bind:value={email} placeholder="Email" required><br>
    <input class="main-input" type="password" bind:value={password} placeholder="Password" required><br>

    <div class="inline-buttons">
        <button type="button" class="small-red-button" onclick={ () => goto('/') }>Annulla</button>
        <button type="submit" class="small-green-button">Registrati</button>
    </div>
</form>