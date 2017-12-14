let socket = new WebSocket('ws://localhost:8080');

// ensure all data is sent and close the socket before leaving the page
window.onbeforeunload = () => {

    // close sockets before refresh
    if (window.performance) { // check browser compatibility
        if (performance.navigation.type === 1)
            console.info("This page is reloaded");
}

    if (socket.readyState !== WebSocket.CLOSED && !socket.bufferedAmount)
        socket.close();
    console.log('socket closed');
};


socket.onopen = () => {
    console.log('Socket open');
    socket.send('User connected.');
    document.getElementById('socket-status').setAttribute('class', 'badge badge-success');
};

socket.onerror = (err) => {
    console.log('There was an error with a socket connection ' + err);
    document.getElementById('socket-status').setAttribute('class', 'badge badge-danger');
};

socket.onmessage = (e) => {
    console.log('Socket message received ' + e.data);
    let data = JSON.parse(e.data);
    document.getElementById('mayer-index').innerText = data.mayerIndex;
    document.getElementById('200dma').innerText = data.twoHundredDayMovingAverage;
    document.getElementById('current-price').innerText = data.currentPrice;
};

socket.onclose = (e) => {
    console.log('Socket closed');
    document.getElementById('socket-status').setAttribute('class', 'badge badge-warning');
};
