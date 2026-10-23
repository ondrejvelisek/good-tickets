import { createBrowserRouter } from 'react-router'
import { Layout } from '../components/Layout'
import { TicketDetailPanel } from '../features/ticket-detail/TicketDetailPanel'
import { TicketListPage } from '../features/tickets/TicketListPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <TicketListPage />,
          children: [{ path: 'tickets/:ticketId', element: <TicketDetailPanel /> }],
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)
