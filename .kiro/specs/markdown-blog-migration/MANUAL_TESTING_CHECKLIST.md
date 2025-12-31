# Manual Testing Checklist - Markdown Blog Migration

## Prerequisites
- Run `npm run dev` to start the development server
- Open browser to `http://localhost:3000`

## Test Cases

### 1. Blog Listing Page (`/blog`)

#### Test 1.1: Page Loads Successfully
- [ ] Navigate to `/blog`
- [ ] Page loads without errors
- [ ] Header displays "Blog" title
- [ ] Subtitle displays correctly

#### Test 1.2: Post Cards Display
- [ ] At least one post card is visible (test-post)
- [ ] Post card shows title: "Test Blog Post"
- [ ] Post card shows description
- [ ] Post card shows date: "January 15, 2024"
- [ ] Post card shows tags: test, markdown, nextjs
- [ ] Post card is clickable

#### Test 1.3: Empty State (if no posts)
- [ ] If no posts exist, displays "No blog posts yet. Check back soon!"

### 2. Individual Post Page (`/blog/test-post`)

#### Test 2.1: Page Loads Successfully
- [ ] Navigate to `/blog/test-post`
- [ ] Page loads without errors
- [ ] "Back to Blog" link is visible and functional

#### Test 2.2: Post Header
- [ ] Title displays: "Test Blog Post"
- [ ] Date displays: "January 15, 2024"
- [ ] Reading time displays (e.g., "1 min read")
- [ ] Author displays: "by Test Author"
- [ ] Tags display: test, markdown, nextjs

#### Test 2.3: Markdown Rendering

##### Headers
- [ ] H1 header "Test Blog Post" renders correctly
- [ ] H2 header "Features" renders correctly
- [ ] H2 header "Code Example" renders correctly

##### Lists
- [ ] Unordered list renders with bullets
- [ ] List items display:
  - Markdown support
  - Frontmatter parsing
  - Static generation
  - Blog listing

##### Code Blocks
- [ ] Code block displays with proper formatting
- [ ] Syntax highlighting is applied (TypeScript)
- [ ] Code shows:
  ```typescript
  const greeting = "Hello, World!";
  console.log(greeting);
  ```
- [ ] Code block has background color
- [ ] Code block has border

##### Paragraphs
- [ ] Regular paragraphs render correctly
- [ ] Text is readable and properly spaced

#### Test 2.4: Styling
- [ ] Content uses prose classes (proper typography)
- [ ] Dark mode works correctly (if applicable)
- [ ] Links are styled with primary color
- [ ] Responsive layout works on mobile/tablet/desktop

### 3. 404 Handling

#### Test 3.1: Non-existent Post
- [ ] Navigate to `/blog/non-existent-post`
- [ ] 404 page displays
- [ ] No JavaScript errors in console

### 4. Navigation

#### Test 4.1: Blog Listing to Post
- [ ] Click on "Test Blog Post" card from `/blog`
- [ ] Navigates to `/blog/test-post`
- [ ] URL updates correctly

#### Test 4.2: Post to Blog Listing
- [ ] Click "Back to Blog" link from `/blog/test-post`
- [ ] Navigates back to `/blog`
- [ ] URL updates correctly

### 5. GitHub Flavored Markdown (GFM) Features

To test GFM features, create a new test post with the following content:

#### Test 5.1: Tables
Create a post with a table:
```markdown
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
```
- [ ] Table renders correctly
- [ ] Headers are bold
- [ ] Borders are visible

#### Test 5.2: Strikethrough
Add strikethrough text: `~~strikethrough~~`
- [ ] Text displays with strikethrough

#### Test 5.3: Task Lists
Add task list:
```markdown
- [ ] Unchecked item
- [x] Checked item
```
- [ ] Checkboxes display
- [ ] Checked items show as checked

### 6. Performance & Build

#### Test 6.1: Static Generation
- [ ] Run `npm run build`
- [ ] Build completes successfully
- [ ] Check `.next/server/app/blog/test-post.html` exists
- [ ] Check `.next/server/app/blog.html` exists

#### Test 6.2: Production Build
- [ ] Run `npm run build && npm start`
- [ ] Navigate to `/blog` in production mode
- [ ] Navigate to `/blog/test-post` in production mode
- [ ] Pages load quickly (static)
- [ ] No runtime database queries

### 7. SEO & Metadata

#### Test 7.1: Meta Tags
- [ ] View page source for `/blog/test-post`
- [ ] Title tag includes post title
- [ ] Meta description includes post description
- [ ] Open Graph tags present
- [ ] Twitter card tags present

### 8. Accessibility

#### Test 8.1: Keyboard Navigation
- [ ] Tab through blog listing page
- [ ] Tab through individual post page
- [ ] All interactive elements are focusable

#### Test 8.2: Screen Reader
- [ ] Headings have proper hierarchy (H1 → H2)
- [ ] Links have descriptive text
- [ ] Images have alt text (if any)

## Test Results

### Date Tested: _______________
### Tester: _______________
### Browser: _______________
### Device: _______________

### Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Blocked: ___

### Issues Found
1. 
2. 
3. 

### Notes
