-- Enable full access for authenticated users (admins) on posts table
CREATE POLICY "Enable all access for authenticated users" ON posts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Enable full access for authenticated users (admins) on projects table
CREATE POLICY "Enable all access for authenticated users" ON projects
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Enable full access for authenticated users (admins) on github_projects table
CREATE POLICY "Enable all access for authenticated users" ON github_projects
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
