let startTime = new Date().getTime();
let timeout = setInterval(() => {
    let current = new Date().getTime();
    if (current > startTime + 3000) {
        clearInterval(timeout);
        window.location.replace('/cb-alerts/dashboard')
    }
    document.getElementById('timer').innerText = (((startTime - current) / 1000) + 3).toString().slice(0, 4);
}, 10);
