# Todo App

This is a simple Todo application built with [Next.js](https://nextjs.org/) using the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/). The app allows users to:

- Fetch and display a list of todos
- Add a new todo
- Delete a todo

## Technologies Used

- **Next.js** with React Hooks (`useState`, `useEffect`)
- **Tailwind CSS** for styling
- **Axios** for API requests
- **React Query** for data fetching and caching (optional)
- **React-toastify** for notifications and better UI

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com/todos
```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
# or
yarn dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## API Endpoints

The app interacts with the JSONPlaceholder API using the following endpoints:

- **Fetch Todos**: `GET https://jsonplaceholder.typicode.com/todos?_limit=10`
- **Create Todo**: `POST https://jsonplaceholder.typicode.com/todos`
- **Delete Todo**: `DELETE https://jsonplaceholder.typicode.com/todos/{id}`

## Contributions

Feel free to fork this repository and submit pull requests with improvements!

---

Made for Veel as a test task.

