import React, {useEffect, useState} from 'react';
import {Button, Card, Input} from 'antd';
import io from 'socket.io-client';
import StateProvider, {useStateValue} from "./StateProvider";
import Layout from './Layout';

import 'antd/dist/antd.min.css';

window.socket = null;
const App = () => {
	const [{user}, dispatch] = useStateValue();
	const [username, setUsername] = useState('');

	const handleLogin = () => {
		/*window.socket = io('http://localhost:3030', {
			query: {username}
		});

		window.socket.on('loginUsers', data => {
			console.log(data);
		});*/
		fetch('/login', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({username})
		})
			.then(res => res.json())
			.then(res => {
				dispatch({type: 'LOGIN_USER', username: res.username});
				localStorage.setItem('token', res.token)
			})
			.catch(err => console.log(err));
	};
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token === null)
			return;

		fetch('/check-auth', {
			headers: {
				'Authorization': token
			}
		})
			.then(res => res.json())
			.then(res => {
				dispatch({type: 'LOGIN_USER', username: res.username});
			})
			.catch(err => console.log('err', err));
	}, [user]);

	return user === null ? (
		<Card
			title="Login"
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				width: 400,
				transform: 'translate(-50%, -50%)'
			}}
		>
			<Input
				type="text"
				value={username}
				onChange={e => setUsername(e.target.value)}
				placeholder="Username"
				style={{width: '100%', marginBottom: 20}}
			/>
			<Button
				type="primary"
				icon="login"
				block={true}
				disabled={username.trim().length < 2}
				onClick={handleLogin}
			>
				Login
			</Button>

		</Card>
	) : (
		<Layout/>
	);
};
const AppContainer = () => (
	<StateProvider>
		<App/>
	</StateProvider>
);
export default AppContainer;
