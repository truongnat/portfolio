---
title: "The TanStack Ecosystem: Building a Full-Stack App with Query, Table, Router, and Form"
date: "2026-03-24"
description: "How I built a full-stack demo with TanStack Start (SSR), TanStack Query, Table, Router, and Form — and why the headless, composable philosophy makes this ecosystem worth investing in."
slug: "tanstack-full-stack-guide"
published: true
tags: ["Frontend", "React", "TanStack"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"
---

TanStack started as one library — React Query, which changed how I think about server state in React. But over the past few years, Tanner Linsley and the contributors have expanded it into a full ecosystem: TanStack Query for server state, Table for headless data grids, Router for type-safe routing, Form for form state management, and most recently TanStack Start for full-stack SSR. I built a full demo project using all of them together, deployed on Vercel, and this post is what I learned about how they compose.

## The TanStack Philosophy: Headless and Composable

Every TanStack library shares a core philosophy: **headless**. They provide state management, logic, and behavior — but zero styles, zero opinionated UI. You bring your own UI layer. This is different from component libraries like MUI or Chakra, which give you styled components.

The benefit is total flexibility. The cost is more integration work upfront. For the demo project, I paired TanStack with Tailwind CSS and built UI components from scratch. For a team with a design system, this approach is ideal. For rapid prototyping where visual design matters immediately, something more batteries-included might serve better.

## TanStack Query: The Foundation

TanStack Query (formerly React Query) manages server state: fetching, caching, background updates, and mutations. The mental model it gives you is: **server state and client state are fundamentally different**. Server state is remote, potentially out of date, and needs synchronization. Client state (form inputs, UI toggles) is local and synchronous. Mixing them in a single state management solution causes complexity.

The basic pattern:

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

function ProductList() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then(r => r.json()),
    staleTime: 60_000,  // Consider fresh for 60 seconds
  })
  
  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />
  
  return <ul>{products.map(p => <ProductItem key={p.id} product={p} />)}</ul>
}
```

### Optimistic Updates

For the demo, I implemented optimistic updates for a cart feature. When a user clicks "Add to Cart," the UI updates immediately — before the server confirms — and rolls back if the request fails.

```tsx
function useAddToCart() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (productId: string) => 
      fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId })
      }).then(r => r.json()),
    
    onMutate: async (productId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cart"] })
      
      // Snapshot current cart
      const previousCart = queryClient.getQueryData(["cart"])
      
      // Optimistically update cart
      queryClient.setQueryData(["cart"], (old: Cart) => ({
        ...old,
        items: [...old.items, { productId, quantity: 1 }]
      }))
      
      return { previousCart }
    },
    
    onError: (err, productId, context) => {
      // Roll back on error
      queryClient.setQueryData(["cart"], context?.previousCart)
    },
    
    onSettled: () => {
      // Always refetch to sync with server truth
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    }
  })
}
```

The `onMutate` / `onError` / `onSettled` pattern is clean, and the automatic rollback on error gives you resilient UX with minimal boilerplate.

## TanStack Table: Headless Data Grids

For the demo's admin panel, I built a data grid with sorting, filtering, pagination, and virtualization using TanStack Table + TanStack Virtual.

TanStack Table is entirely logic-only. You define columns, hand it data, and it gives you a table model. You render whatever HTML you want:

```tsx
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table"

const columns = [
  columnHelper.accessor("name", {
    header: "Product Name",
    cell: info => <span className="font-medium">{info.getValue()}</span>
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: info => `$${info.getValue().toFixed(2)}`
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => <RowActions product={row.original} />
  })
]

function ProductTable({ data }: { data: Product[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                {flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.getIsSorted() === "asc" ? " ↑" : " ↓"}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

For tables with thousands of rows, I added TanStack Virtual to render only visible rows, which kept the admin panel responsive even with large datasets.

## TanStack Router: Type-Safe Routing

TanStack Router brings end-to-end type safety to routing. Route params, search params, and loaders are all fully typed. The key difference from Next.js or React Router: search params are first-class, typed citizens, not untyped strings.

```tsx
const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$productId",
  validateSearch: z.object({
    tab: z.enum(["details", "reviews", "related"]).optional(),
    page: z.number().optional().default(1)
  }),
  loader: ({ params }) => fetchProduct(params.productId)
})

function ProductPage() {
  const { productId } = productRoute.useParams()
  const { tab, page } = productRoute.useSearch()
  const product = productRoute.useLoaderData()
  
  // All fully typed — TypeScript catches typos and wrong types at compile time
}
```

The loader system runs before the component renders, which enables SSR and prefetching. In the TanStack Start demo, loaders run on the server for the initial render and on the client during navigation — exactly like Next.js data fetching but with stronger types.

## TanStack Form: Form State Without the Pain

TanStack Form handles form state with validation (via Zod or Valibot), async validation, and field-level error management without the heavy magic of Formik or React Hook Form.

```tsx
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"

function CheckoutForm() {
  const form = useForm({
    defaultValues: { email: "", address: "" },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: z.object({
        email: z.string().email(),
        address: z.string().min(5)
      })
    },
    onSubmit: async ({ value }) => {
      await submitOrder(value)
    }
  })
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field name="email">
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.map(e => (
              <span key={e} className="text-red-500">{e}</span>
            ))}
          </div>
        )}
      </form.Field>
    </form>
  )
}
```

## How They Compose Together

The real power of TanStack is the composition. In the demo's admin panel, a single page uses: TanStack Router for type-safe params and loaders, TanStack Query for server state with cache invalidation, TanStack Table for the data grid, and TanStack Form for inline row editing. Each library handles its slice of state cleanly. There's no state duplication, no conflicting update patterns.

The ecosystem takes an investment to learn — each library has its own API surface. But the return is high once you know it: consistent patterns, end-to-end type safety, and a UI layer that you fully control. For teams building complex data-heavy applications, I now reach for TanStack as a default.
