const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join('../build')));

const port = process.env.PORT || 1337;

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});


io.on('connection', socket => {
  console.log('new client connected');
  socket.on('join room', async ({ name }) => {
    try {
      socket.join('chat', name);
      io.to('chat').emit('connection success', `${name} joined the chat!`);
    } catch {
      console.error(`Couldn't join room!`);
      socket.emit('connection error', `${name} failed to join the room!`);
    }
  });

  socket.on('send message', async ({ message, name }) => {
    console.log(message);
    try {
      socket.broadcast.emit('message', { message, sender: name });
    } catch {
      console.error(`Something went wrong`);
      socket.emit('message error', `Failed to send message`);
    }
  });

  socket.on('start typing', ({name}) => {
    socket.broadcast.emit('typing', `${name} is typing...`);
  });
});
