import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchModalProvider } from './context/SearchModalContext';
import { router } from './router';

export default function App() {
  return (
    <AuthProvider>
      <SearchModalProvider>
        <RouterProvider router={router} />
      </SearchModalProvider>
    </AuthProvider>
  );
}
