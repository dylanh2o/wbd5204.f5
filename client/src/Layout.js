import React, {useEffect, useState} from 'react';
import io from 'socket.io-client'
import {useStateValue} from "./StateProvider";

window.socket = null;

const Layout = () => {
	const [{user, list}, dispatch] = useStateValue();

	const [message, setMessage] = useState('');
	const [chat, setChat] = useState([]);

	const sendMessage = () => {
		window.socket.emit('sendMessage', {
			user,
			message
		});
		setMessage('');
	};

	useEffect(() => {
		const token = localStorage.getItem('token')
		window.socket = io({
			query: {token}
		});
		window.socket.on('hydrateUsers', data => {
			dispatch({type: 'HYDRATE_LIST', list: data})
		});
		window.socket.on('receiveMessage', data => {
			setChat(state => {
				let tmp = [...state];
				tmp.push(data);
				localStorage.setItem('chat', JSON.stringify(tmp));
				return (tmp)
			});
		});
		const localChat = localStorage.getItem('chat');
		if (localChat !== null) {
			setChat(JSON.parse(localChat));
		}
	}, []);

	return (
		<div style={{display: 'flex'}}>

			<ul style={{flex: '0 0 20vm'}}>
				<a><li >room</li></a>
			<a><li>room2</li></a>
			</ul>
			<ul style={{flex: '0 0 20vm'}}>
				Utilisateur connectés
				{list.map((user, index) => (<li key={index}>{user}</li>))}

			</ul>
			<div style={{flex: '1 1 auto'}}>
	<br/>
				{chat.map((i, index) => (
					<div key={index} style={{marginTop: 10}}>
						<p>{i.message}</p>
						<em>By {i.user} on {i.date}</em>
					</div>
				))}
				<textarea
					value={message}
					onChange={e => setMessage(e.target.value)}
				/>
				<button onClick={sendMessage}>Envoyer</button>
			</div>
		</div>

	)
};

export default Layout;