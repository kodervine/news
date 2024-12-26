import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from '@/routes';
import { ErrorBoundary } from 'react-error-boundary';
import { useState } from 'react';
import ErrorFallback from '@/pages/Errors/ErrorFallback';

const App = () => {
  const [resetKey, setResetKey] = useState('');

  return (
    <ErrorBoundary
      fallbackRender={ErrorFallback}
      onReset={() => setResetKey('')}
      resetKeys={[resetKey]}
    >
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'text-sm md:text-base ',
          }}
        />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
