import { App } from './app';
import { HelmetProvider } from 'react-helmet-async';
import ReactDOM from 'react-dom/client';
import 'sanitize.css/sanitize.css';
import store from './Store/Index';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <Provider store={store}>
      <App />
      <ToastContainer position="bottom-center" />
    </Provider>
  </HelmetProvider>,
);

