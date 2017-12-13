let socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
    console.log('Socket open');
    socket.send('User connected.'); // JSON.stringify({msg});
};

socket.onerror = (err) => {
    console.log('There was an error with a socket connection ' + err);
};

socket.onmessage = (e) => {
    console.log('Socket message received ' + e.data);
};

socket.onclose = (e) => {
    console.log('Socket closed ' + e);
};
