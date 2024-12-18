import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';

import store from './store/store';

import Main from './main';

ReactDOM.createRoot(document.getElementById('root')!).render(<Provider store={store}>
    <Main />
</Provider>);
