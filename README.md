This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## To-Do App

This project includes a simple to-do app styled with [Tailwind CSS](https://tailwindcss.com) that uses localStorage for data persistence.

### Getting Started with the Todo App:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to [http://localhost:3000/todo](http://localhost:3000/todo) to manage your tasks.

## localStorage-Based Todo Features

The todo app now uses localStorage instead of a database for persistence. This means:

- **No database required**: All tasks are stored in your browser's localStorage
- **Instant persistence**: Changes are saved immediately to localStorage
- **Export/Import**: You can export your tasks to a JSON file and import them later
- **Browser-specific**: Tasks are stored per browser and won't sync across devices
- **Data management**: Includes options to clear all tasks and manage your data

### localStorage Features:
- Add, edit, and delete tasks
- Mark tasks as complete/incomplete
- Set priority levels (High, Medium, Low) with visual indicators
- Automatic sorting by priority and completion status
- View task completion statistics
- Export tasks to JSON file
- Import tasks from JSON file
- Clear all tasks with confirmation

### Usage:
1. Start the development server: `npm run dev`
2. Navigate to the todo page: `http://localhost:3000/todo`
3. Add tasks, set priorities, and manage your todo list
4. Use export/import features to backup or transfer your tasks

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
