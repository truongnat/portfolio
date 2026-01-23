---
title: "Modern Data Engineering with Python and DuckDB: A Case Study"
date: "2023-10-15"
description: "How we replaced a complex Spark cluster with a single Python process and DuckDB, achieving a 10x reduction in cost and 2x faster processing."
slug: "python-a-practical-case-study"
published: true
tags: ["Backend", "Python"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
---

# Modern Data Engineering with Python and DuckDB: A Case Study

Python is the undisputed king of data, but the "standard" stack (Spark/Hadoop) is often overkill for many mid-sized datasets. This case study details how we simplified our data pipeline using the modern "Local-First" data stack.

## The Challenge: The "Spark Tax"

Our data pipeline processed 50GB of daily logs.
*   **Infrastructure:** A 5-node Spark cluster that cost $1,200/month.
*   **Complexity:** Simple changes required complex JAR packaging and cluster deployment.
*   **Startup Time:** The cluster took 5 minutes just to spin up before processing any data.

## The Solution: Python + DuckDB + Pydantic

We moved to a "Scale Up, not Out" strategy using a single large EC2 instance.

### 1. DuckDB (The OLAP Engine)
We replaced Spark SQL with **DuckDB**.
*   **Benefit:** DuckDB is a zero-dependency C++ engine that runs inside the Python process. It is optimized for vectorized execution on multi-core CPUs.

### 2. Pydantic for Data Validation
We used **Pydantic v2** to enforce strict schemas on incoming JSON logs.
*   **Result:** Caught data corruption issues at the entry point rather than mid-pipeline.

### 3. Async Log Ingestion
Using `httpx` and `asyncio`, we built a concurrent fetcher that pulled logs from 50 different S3 buckets simultaneously.

## Implementation Example

```python
import duckdb
import asyncio
from pydantic import BaseModel

class LogEntry(BaseModel):
    user_id: int
    event: str
    timestamp: str

async def process_data():
    # Load 10M rows into an in-memory DuckDB instance
    con = duckdb.connect()
    con.execute("CREATE TABLE logs AS SELECT * FROM read_json_auto('s3://bucket/*.json')")
    
    # Run high-speed analytical query
    result = con.execute("""
        SELECT event, count(*) 
        FROM logs 
        GROUP BY 1 
        ORDER BY 2 DESC
    """).df()
    
    print(result)

asyncio.run(process_data())
```

## Results

| Metric | Spark (Old) | Python + DuckDB |
| :--- | :--- | :--- |
| **Execution Time** | 18 Mins | 7 Mins |
| **Monthly Cost** | $1,200 | $150 |
| **Codebase Size** | 5,000 Lines | 800 Lines |

## Conclusion

Bigger isn't always better. By leveraging the high-performance C++ internals of DuckDB through a clean Python interface, we built a pipeline that is faster, cheaper, and much easier to maintain than a distributed cluster.