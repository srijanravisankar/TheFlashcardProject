import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import App from './App.jsx';
import FolderTree from './components/FolderTree.jsx';
import Deck from './components/Deck.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FolderTree />,
  }, 
  {
    path: '/decks/:deckId',
    element: <Deck />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
