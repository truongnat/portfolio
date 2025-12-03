-- Create a table to track page views
create table if not exists page_views (
  path text primary key,
  view_count integer default 0,
  last_viewed timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table page_views enable row level security;

-- Allow anyone to increment view count (via a function is safer, but direct update for simplicity if public)
-- Actually, for security, it's better to have a function to increment.
-- But for now, let's allow public insert/update for this specific table if we want simple client-side tracking.
-- A better approach is a stored procedure.

create or replace function increment_page_view(page_path text)
returns void
language plpgsql
security definer
as $$
begin
  insert into page_views (path, view_count, last_viewed)
  values (page_path, 1, now())
  on conflict (path)
  do update set
    view_count = page_views.view_count + 1,
    last_viewed = now();
end;
$$;

-- Allow public to call the function
grant execute on function increment_page_view to anon, authenticated;

-- Allow only authenticated users (admins) to select (view analytics)
create policy "Enable read access for authenticated users only"
on page_views for select
to authenticated
using (true);

-- No direct insert/update/delete policies for anon, they must use the function.
