<!-- script section 
------------------------------------------------------------ -->
<script>
    import { auth } from "$lib/firebase";
    import { updatePassword } from "firebase/auth";
    
    const props = $props();
    let newPassword = $state("");

    function changePassword() {
        updatePassword(auth.currentUser, newPassword)
            .then(() => {
                props.setMenuState(0);
                alert("Password aggiornata con successo!");
            })
            .catch((error) => {
                if(error.code === "auth/weak-password") {
                    alert("La password dovrebbe essere lunga almeno 6 caratteri. Riprova!");
                    newPassword = "";
                }
                else {
                    console.error(error);
                }
            })
    }
</script>



<!-- HTML section 
------------------------------------------------------------ -->
<div class="menu-div">
    <p>Modifica password:<p>
    <form class="menu-input-box" id="edit-password-form" onsubmit={ () => changePassword() }>
        <input class="menu-input" type="password" bind:value={newPassword} placeholder="Nuova password" required><br>
    </form>
</div>

<div class="menu-buttons-box">
    <button class="menu-green-button" type="submit" form="edit-password-form">Salva</button>
    <button class="menu-red-button" onclick={ () => props.setMenuState(0) }>Annulla</button>
</div>