import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'
// import store from './redux/store'
import './config/axios-options'
import App from './App';

// store.dispatch({
//     type: 'userInfo',
//     data: JSON.parse(sessionStorage.getItem('user'))
// });

ReactDOM.render(
    <BrowserRouter>
        {/* <Provider store={store}> */}
        <App />
        {/* </Provider> */}
    </BrowserRouter>,
    document.getElementById('root')
);