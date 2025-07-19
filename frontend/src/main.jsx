import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import FolderTree from './components/tree/FolderTree.jsx';
import Deck from './components/deck/Deck.jsx';
import Flashcard from './components/flashcard/Flashcard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FolderTree />,
  }, 
  {
    path: '/deck/:deckId',
    element: <Deck />
  },
  {
    path: '/deck/:deckId/study',
    element: <Flashcard />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
