---
title: "Advanced Next.js: Parallel Routes, Intercepting, and Server Actions"
date: "2023-11-10"
description: "Master the complex features of the App Router. Learn how to build sophisticated layouts with Parallel Routes and handle forms with Server Actions."
slug: "next-js-advanced-patterns-and-best-practices"
published: true
tags: ["Frontend", "Next.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000"
---

# Advanced Next.js: Parallel Routes, Intercepting, and Server Actions

Next.js 14 provides patterns for UI complexity that were previously impossible without heavy third-party libraries.

## 1. Parallel Routes (`@slot`)

Need to show a Dashboard with 3 independent sections that have their own loading and error states?
*   **The Pattern:** Use folder names starting with `@` (e.g., `@analytics`, `@user`).
*   **The Benefit:** You can render multiple pages in the same layout simultaneously.

## 2. Intercepting Routes (`(..)folder`)

Ever clicked a photo on Instagram and saw it open in a modal, but refreshing the page shows it as a standalone page?
*   **The Power:** Intercepting routes allows you to "mask" the URL change and show a modal over the current page while keeping the link shareable.

## 3. Server Actions (The End of `fetch`)

Forms in React used to require `useState`, `onSubmit`, and an API route.
*   **Modern Way:**
    ```typescript
    async function createInvoice(formData: FormData) {
      'use server';
      const rawFormData = {
        amount: formData.get('amount'),
      };
      await db.save(rawFormData);
      revalidatePath('/invoices');
    }
    ```
*   **Benefit:** Native form handling with zero client-side JS needed for the submission.

## 4. Middleware for Edge Logic

Use `middleware.ts` to handle authentication and geo-routing at the **Edge** (before the request even hits your server).

## Summary

Advanced Next.js is about **Reducing Client-Side Complexity**. By moving routing and state changes to the server and the edge, you build apps that are lighter, faster, and more secure.