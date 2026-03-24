---
title: "Introduction to Graph Databases with Neo4j: Why Relationships Matter"
date: "2026-03-24"
description: "A beginner's look at graph databases and Neo4j — what they are, how they work, and why I explored them for building a knowledge graph in an Agentic SDLC project."
slug: "neo4j-graph-database-intro"
published: true
tags: ["Database", "Neo4j", "Backend"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000"
---

Most developers learn about relational databases (like PostgreSQL) first — tables, rows, foreign keys. For a long time, that was all I used too. But when I started exploring **Agentic SDLC** — a system where AI agents assist with software development workflows — I realized some data is better modeled as a network of relationships, not rows and columns. That's when I found **Neo4j**.

## What Is a Graph Database?

A graph database stores data as **nodes**, **relationships**, and **properties** — not tables.

- **Node** — an entity, like a `User`, `Task`, or `Concept`
- **Relationship** — a named connection between two nodes, like `DEPENDS_ON` or `CREATED_BY`
- **Property** — key-value data attached to nodes or relationships

Think of it like a mind map, where ideas are connected to other ideas.

## When Should You Use One?

Graph databases shine when **relationships are first-class citizens** in your data. Great use cases include:

- **Knowledge graphs** — mapping concepts and how they connect
- **Recommendation engines** — "users who liked X also liked Y"
- **Social networks** — friends, followers, connections
- **Dependency trees** — like package dependencies or task workflows

For my Agentic SDLC project, I needed to map how software components, tasks, agents, and decisions relate to each other. A relational database would require many complex JOINs. Neo4j made it feel natural.

## Basic Cypher Queries

Neo4j uses a query language called **Cypher**. It's surprisingly readable:

```cypher
// Create nodes and a relationship
CREATE (a:Agent {name: "PlannerBot"})
CREATE (t:Task {name: "Write Tests"})
CREATE (a)-[:ASSIGNED_TO]->(t)

// Find all tasks assigned to PlannerBot
MATCH (a:Agent {name: "PlannerBot"})-[:ASSIGNED_TO]->(t:Task)
RETURN t.name
```

The arrow syntax `-->` literally looks like a graph — which makes queries easy to reason about.

## My Takeaway

If your data has complex, deeply connected relationships, a graph database like Neo4j is worth exploring. It changed the way I think about data modeling. Sometimes, the right tool makes a hard problem feel simple.
