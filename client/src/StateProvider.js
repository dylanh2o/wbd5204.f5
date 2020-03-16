import React, {createContext, useContext, useReducer} from 'react';

const initialState = {
	user: null,
	list: [],
	drawing: [],
	image: null
};

const reducer = (state, action) => {

	switch (action.type) {
		case 'LOGIN_USER':
			return Object.assign({}, state, {user: action.username});

		case 'HYDRATE_LIST':
			return Object.assign({}, state, {list: action.list});

		case 'HYDRATE_DRAWING':
			return Object.assign({}, state, {drawing: action.drawing});

		case 'HYDRATE_IMAGE':
			return Object.assign({}, state, {image: action.image});


		default:
			return state;
	}
};

const StateContext = createContext();

export const useStateValue = () => useContext(StateContext);

export default ({children}) => (
	<StateContext.Provider value={useReducer(reducer, initialState)}>
		{children}
	</StateContext.Provider>

);
