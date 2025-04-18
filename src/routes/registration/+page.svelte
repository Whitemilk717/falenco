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
                goto("/");
            })
            .catch((error) => {
                if(error.code === "auth/weak-password") {
                    alert("La password dovrebbe essere lunga almeno 6 caratteri. Riprova!")
                }
                else if(error.code === "auth/email-already-in-use") {
                    alert("La mail è già in uso. Riprova!")
                }
                else {
                    console.error(error);
                }
            })
    }
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<form class="main-box">
    <h1 class="main-title">FaLenCo</h1>
    
    <input class="main-input" type="email" bind:value={email} placeholder="Email" required><br>
    <input class="main-input" type="password" bind:value={password} placeholder="Password" required><br>

    <div class="inline-buttons">
        <button type="button" class="cancel-button" onclick={ () => goto('/') }>Annulla</button>
        <button type="button" class="registration-button" onclick={ () => userCreation() }>Registrati</button>
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