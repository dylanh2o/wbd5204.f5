const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'FOOBAR';

const users = [];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const server = http.Server(app);
const io = socketio(server);

app.post('/login', (req, res) => {
	const {username} = req.body;
	const token = jwt.sign({username}, JWT_SECRET, {expiresIn: '7d'});
	res.json({username, token});
});
app.get('/check-auth', (req, res) => {
	const token = req.headers.authorization;

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err === null)
			res.json({username: decoded.username});
		else
			res.status(403).end();
	});
});


io
	.use((req, next) => {
		const token = req.handshake.query.token
		;
		jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if (err === null) {
				users.push(decoded.username);
				next();
			} else
				next(new Error('Authentication error'));
		});

	})
	.on('connection', socket => {
		console.log('New client connection ', socket.id);

		io.emit('hydrateUsers', users);



		socket.on('sendMessage', data => {
			data.date = new Date();
			io.emit('receiveMessage', data)
		});

		socket.on('disconnect', () => {
			const token = socket.handshake.query.token;
			jwt.verify(token, JWT_SECRET, (err, decoded) => {
				const index = users.findIndex(i => i === decoded.username);
				users.splice(index, 1);
			});
			console.log('Client disconnected from websocket');
			io.emit('hydrateUsers', users);
		});
	});


server.listen(3030, () => console.log('Server started on localhost:3030'));