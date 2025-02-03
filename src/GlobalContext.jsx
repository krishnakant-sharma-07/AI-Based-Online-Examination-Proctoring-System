import React, { createContext, useReducer, useContext } from 'react';

// Initial State
const initialState = {
  user_email: null,
  role: null,
  token: null,
  access: null,
};

// Reducer Function
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_EMAIL':
      return { ...state, user_email: action.payload };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_ACCESS':
      return { ...state, access: action.payload };
    case 'LOGOUT':
      return { user_email: null, role: null, token: null, access: null };
    default:
      return state;
  }
};

// Create Context
const GlobalContext = createContext();

// Provider Component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook
export const useGlobalContext = () => useContext(GlobalContext);
