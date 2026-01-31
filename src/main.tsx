// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { Suspense } from 'react';
import { CustomizerContextProvider } from './context/CustomizerContext';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

import Spinner from './views/spinner/Spinner';
import './utils/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <CustomizerContextProvider>
    <AuthProvider>
      <Suspense fallback={<Spinner />}>
        <App />
      </Suspense>
    </AuthProvider>
  </CustomizerContextProvider>,
)
