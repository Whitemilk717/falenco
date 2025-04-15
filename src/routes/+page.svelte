<!-- script section 
------------------------------------------------------------ -->
<script>
    import '../style.css';

    if ('serviceWorker' in navigator) {                                             // true: the browser supports service workers
        navigator.serviceWorker
            .register('/service-worker.js', { type: 'module' })                     // 'type: module' is required for manual service workers
            .then(serviceWorker => {
                console.log('Service Worker registered: ', serviceWorker);
            })
            .catch(error => {
                console.error('Error registering the Service Worker: ', error);
            })
    }
</script>


<!-- HTML section 
------------------------------------------------------------ -->
<div class='main-box'>
    <p class='main-title'>FaLenCo</p>

    <button>Accedi</button>
    <button>Registrati</button>
    <button>Crea famiglia</button>
</div>


<!-- CSS section
------------------------------------------------------------ -->
<style>
    
</style>