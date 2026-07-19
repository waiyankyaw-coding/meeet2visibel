
## Tech Stack

- Frontend: React (Vite), TypeScript, Tailwind CSS, react-datepicker
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)

## Live Demo

- Frontend: `https://meeting.waiyankyaw.com`
- Backend API: `https://meeet2visibel.onrender.com/api`

## Roles and Permissions

| Action                        | User | Owner | Admin |
|--------------------------------|------|-------|-------|
| Create booking                 | Yes  | Yes   | Yes   |
| View all bookings              | Yes  | Yes   | Yes   |
| Delete own booking              | Yes  | Yes   | Yes   |
| Delete any booking              | No   | Yes   | Yes   |
| View bookings grouped by user   | No   | Yes   | Yes   |
| View usage summary              | No   | Yes   | Yes   |
| Create or delete users          | No   | No    | Yes   |
| Change user roles               | No   | No    | Yes   |

All permission checks are enforced server-side, not only hidden in the UI. The frontend sends
the current user's id and role with requests that require permission checks, such as deleting a
booking. The backend independently verifies the action is allowed before performing it.

## Authentication

There is no password or session-based authentication. Per the assignment's allowance for
non-production-grade auth, login works as a user picker: the frontend fetches the list of
existing users, and the person selects who they are from that list. The selected user is
stored in localStorage so a page refresh keeps them signed in.

This is a deliberate simplification, not an attempt at secure authentication. In a production
system, role and identity would be derived from a verified session or token on the server,
not trusted from values supplied by the client.

## Booking Rules and Assumptions

startTime must be strictly before endTime. This is enforced both client-side, for immediate
feedback, and server-side, as the source of truth.

Bookings cannot be created in the past. startTime must be later than the current server time
at the moment of creation.

Overlap detection: two bookings are considered overlapping if
`existingStart < newEnd AND existingEnd > newStart`. This was tested against the required
cases:

- Identical ranges: rejected
- Partial overlap: rejected
- One range fully inside another: rejected
- Back-to-back bookings, where one ends exactly when another starts, are allowed. Because the
  comparison uses strict inequalities rather than inclusive ones, a booking ending at 2:00 PM
  and another starting at 2:00 PM are not treated as overlapping.

Time handling: all times are stored and compared as UTC Date objects, using MongoDB's native
Date type. The frontend displays times in the browser's local timezone using
`toLocaleString()`. No explicit timezone conversion or multi-timezone support is implemented.
The system assumes all users are booking a single physical room in one timezone.

## User Deletion Behavior

Deleting a user cascades: all bookings created by that user are deleted along with the user
record. This happens in a single backend operation, in this order:

1. All bookings where userId matches the deleted user are removed.
2. The user record itself is deleted.

This was chosen over alternatives such as orphaning bookings or blocking deletion while
bookings exist, to keep the data model simple and avoid references to a user that no longer
exists.

## API Endpoints

### Users

| Method | Endpoint         | Access | Description                         |
|--------|-------------------|--------|---------------------------------------|
| GET    | /api/users        | All    | List all users                        |
| POST   | /api/users        | Admin  | Create a new user                     |
PATCH /api/users/:id/role   | Admin  | Update a user's role                  |
| DELETE | /api/users/:id    | Admin  | Delete a user, cascades to bookings   |

### Bookings

| Method | Endpoint              | Access                     | Description                                   |
|--------|-------------------------|-----------------------------|-------------------------------------------------|
| GET    | /api/bookings           | All                         | List all bookings                                |
| POST   | /api/bookings           | All                         | Create a booking                                 |
| DELETE | /api/bookings/:id       | Owner, Admin, or creator    | Delete a booking, permission enforced server-side|
| GET    | /api/bookings/summary   | Owner, Admin                | Aggregated booking counts per user               |

## Local Setup

### Backend

```
cd backend
npm install
```

Create a .env file in the backend directory with:

```
DB=<your MongoDB connection string>
```

Then run:

```
npm start
```

The server runs on http://localhost:4000.

### Frontend

```
cd frontend
npm install
npm run dev
```

The app runs on http://localhost:5173.

