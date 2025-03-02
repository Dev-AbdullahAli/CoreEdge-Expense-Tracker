# Group Expense Tracker

A simple group expense tracking application built with Next.js, TypeScript, and Supabase.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Copy `.env.example` to `.env.local` and add your Supabase credentials
4. Create the following tables in your Supabase database:

```sql
-- Groups table
create table groups (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  user_id uuid references auth.users not null
);

-- Expenses table
create table expenses (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  description text not null,
  amount decimal not null,
  group_id uuid references groups not null,
  user_id uuid references auth.users not null
);
```

5. Run the development server:
```bash
npm run dev
```

## AI Usage Documentation

This project was developed with the assistance of GitHub Copilot:

- Initial project structure and setup
- Basic component structure and routing
- Supabase integration and authentication logic
- API route implementations
- Database schema design

All generated code was reviewed and modified to ensure it meets the project requirements.
