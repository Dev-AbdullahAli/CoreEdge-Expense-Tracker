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

This project was developed with the assistance of multiple AI tools:

### GitHub Copilot
Generated the majority of the codebase including:
- Initial project structure and Next.js setup
- Components and pages implementation
- Supabase database integration
- Authentication flows and protected routes
- API endpoints and data handling
- TypeScript types and interfaces
- Database schema design

### Cursor AI Editor
Contributed to:
- UI/UX design implementations
- Design fixes and improvements
- Component styling adjustments

### Manual Modifications
The following changes were implemented manually:
- Authentication flow improvements (user login state redirects)
- Bug fixes in Supabase function calls
- Code review and optimization
- Quality assurance and testing

All generated code was reviewed and modified to ensure it meets the project requirements.
