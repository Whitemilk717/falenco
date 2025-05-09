<!-- script section 
------------------------------------------------------------ -->
<script>
    import { goto } from "$app/navigation";
    import { auth } from "$lib/firebase";
    import { signInWithEmailAndPassword } from "firebase/auth";


    /* service worker registration
    -------------------------------------------------------- */
    if ("serviceWorker" in navigator) {                                         // true: the browser supports service workers
        navigator.serviceWorker
            .register("/service-worker.js", { type: "module" })                 // "type: module" is required for manual service workers
            .then(serviceWorker => {
                console.log("Service Worker registered: ", serviceWorker);
            })
            .catch(error => {
                console.error("Error registering the Service Worker: ", error); 
            })
    }


    /* sign in function
    -------------------------------------------------------- */
    let email = "";
    let password = "";

    function signIn() {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                goto("/calendar-selection");
            })
            .catch((error) => {
                if (error.code === "auth/invalid-credential") {
                    alert("Email e/o password errati. Riprovare!");
                    email = "";
                    password = "";
                    return;
                }
                console.log(error);
            })
    }
</script>



<!-- HTML section 
------------------------------------------------------------ -->
<form class="main-box" onsubmit={ () => signIn() }>
    <h1 class="main-title">FaLenCo</h1>

    <input class="main-input" type="email" bind:value={email} placeholder="Email" required><br>
    <input class="main-input" type="password" bind:value={password} placeholder="Password" required><br>

    <button type="submit" class="big-green-button">Accedi</button>

    <p class="small-text">Prima volta? <a class="link" href="/registration">Crea un account</a></p>
    <p class="small-text">Password dimenticata? <a class="link" href="/password-recover">Recupera password</a></p>
</form>