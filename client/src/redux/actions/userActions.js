import {SET_USER, SET_ERRORS, LOADING_UI, CLEAR_ERRORS, SET_UNAUTHENTICATED } from '../types'
import axios from 'axios';

const loginUser = (userData, history) => (dispatch) => {
  dispatch({type:LOADING_UI})
  axios
  .post('/login', userData)
  .then( response => {
    setAuthorizationHeader(response.data.token);
    dispatch(getUserData());
    dispatch({type: CLEAR_ERRORS})
    history.push('/')
  })
  .catch( error => {
    console.log('login error', error)
    dispatch({
      type: SET_ERRORS,
      payload: error
    })
  })
}

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('SocialDemoFBToken');
  delete axios.defaults.headers.common['Authorization']
  dispatch({type: SET_UNAUTHENTICATED})
}

const getUserData = () => (dispatch) =>{
  axios.get('/user')
    .then( response => {
      dispatch({
        type: SET_USER,
        payload: response.data
      })
    })
    .catch( error => console.log({error}))
}

const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({type:LOADING_UI})
  axios
  .post('/signup', newUserData)
  .then( response => {
    setAuthorizationHeader(response.data.token);
    dispatch(getUserData());
    dispatch({type: CLEAR_ERRORS});
    history.push('/')
  })
  .catch( error => {
    console.log('signup error', error)
    dispatch({
      type: SET_ERRORS,
      payload: error
    })
  })
}

const setAuthorizationHeader = (token) => {
  const SocialDemoFBToken = `Bearer ${token}`;
  localStorage.setItem('SocialDemoFBToken', SocialDemoFBToken);
  axios.defaults.headers.common['Authorization'] = SocialDemoFBToken;
}

export {
  getUserData,
  loginUser,
  signupUser
}