import {SET_USER, SET_ERRORS, LOADING_UI, CLEAR_ERRORS } from '../types'
import axios from 'axios';

const loginUser = (userData, history) => (dispatch) => {
  dispatch({type:LOADING_UI})
  axios
  .post('/login', userData)
  .then( response => {
    const SocialDemoFBToken = `Bearer ${response.data.token}`
    localStorage.setItem('SocialDemoFBToken', SocialDemoFBToken)
    axios.defaults.headers.common['Authorization'] = SocialDemoFBToken
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

export {
  loginUser,
  getUserData
}