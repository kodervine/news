import { Navigate, useRoutes } from 'react-router-dom';
import RegisterPage from '@/pages/RegisterPage';
import PostPage from '@/pages/PostPage';
import AppLayout from '@/layouts/AppLayout';
import ProtectedRoutes from '@/layouts/ProtectedRoutes';
import LoginPage from '@/pages/LoginPage';
import PostDetailsPage from '@/pages/PostDetailsPage';
import PostForm from '@/pages/PostForm';

const AppRoutes = () => {
  const allPages = useRoutes([
    {
      element: <ProtectedRoutes />,
      children: [
        {
          element: <AppLayout />,
          children: [
            { path: '/', element: <Navigate to="/register" /> },
            {
              path: '/posts',
              element: <PostPage />,
            },
            {
              path: '/posts/:id',
              element: <PostDetailsPage />,
            },
            {
              path: '/posts/new',
              element: <PostForm />,
            },
            {
              path: '/posts/edit/:id',
              element: <PostForm />,
            },
          ],
        },
      ],
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/*',
      element: <>Error page</>,
    },
  ]);

  return allPages;
};

export default AppRoutes;
