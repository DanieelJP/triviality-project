import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home, Login, Signup, TriviaGame, Dashboard } from '../components/features';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/dashboard/*',
      element: <Dashboard />,
    },
    {
      path: '/trivia',
      element: <TriviaGame />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
); 