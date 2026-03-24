---
title: "Building Offline-First Mobile Apps with React Native and Realm DB"
date: "2026-03-24"
description: "How I built GoPass, a Japanese exam app that works seamlessly without internet using Realm DB and a robust sync strategy."
slug: "react-native-offline-first-architecture"
published: true
tags: ["Mobile", "React Native", "Architecture"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000"
---

# Building Offline-First Mobile Apps with React Native and Realm DB

When I started building **GoPass** — a Japanese language exam preparation app — I quickly ran into a problem that every mobile developer eventually faces: users in Japan frequently study on the subway, in dead zones, or with spotty 4G. If your app depends on a live API for every interaction, you're going to frustrate your users badly.

The solution was obvious in hindsight: **offline-first architecture**. But the implementation? That took a few painful iterations.

## The Challenge

GoPass needed to support:
- Downloading entire lesson packs (vocabulary, kanji, grammar)
- Tracking progress locally (correct/incorrect answers, study streaks)
- Syncing back to a remote server when connectivity returned
- Handling conflict resolution when a user studied on two devices

A naive approach — just caching API responses in AsyncStorage — wasn't going to cut it. I needed a real local database with querying capability and a sync protocol.

## Why Realm DB

I evaluated three options: **SQLite** (via expo-sqlite), **WatermelonDB**, and **Realm**. Here's how they compared for my use case:

| Feature | SQLite | WatermelonDB | Realm |
|---|---|---|---|
| TypeScript support | Manual | Good | Excellent |
| Built-in sync | No | No | Atlas Device Sync |
| Query performance | Fast | Fast | Very fast (reactive) |
| Schema migrations | Manual | Manual | Versioned |

Realm won because of **Atlas Device Sync** — MongoDB's hosted sync solution. It gave me CRDT-based conflict resolution out of the box, which was exactly what I needed.

## Schema Design

Getting the schema right was the most critical decision. I modeled the core entities like this:

```typescript
// models/Lesson.ts
import Realm, { BSON } from 'realm';

export class Lesson extends Realm.Object<Lesson> {
  _id!: BSON.ObjectId;
  title!: string;
  language!: string;
  level!: number;
  cards!: Realm.List<FlashCard>;
  downloadedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Lesson',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
      language: 'string',
      level: 'int',
      cards: 'FlashCard[]',
      downloadedAt: 'date',
    },
  };
}

export class FlashCard extends Realm.Object<FlashCard> {
  _id!: BSON.ObjectId;
  front!: string;
  back!: string;
  reading!: string;
  lastReviewedAt?: Date;
  easeFactor!: number; // for spaced repetition

  static schema: Realm.ObjectSchema = {
    name: 'FlashCard',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      front: 'string',
      back: 'string',
      reading: 'string',
      lastReviewedAt: 'date?',
      easeFactor: { type: 'double', default: 2.5 },
    },
  };
}

export class StudySession extends Realm.Object<StudySession> {
  _id!: BSON.ObjectId;
  userId!: string;
  lessonId!: BSON.ObjectId;
  completedAt!: Date;
  score!: number;
  answers!: Realm.List<Answer>;

  static schema: Realm.ObjectSchema = {
    name: 'StudySession',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userId: 'string',
      lessonId: 'objectId',
      completedAt: 'date',
      score: 'double',
      answers: 'Answer[]',
    },
  };
}
```

Notice the `easeFactor` field on `FlashCard` — that's the spaced repetition multiplier. It needs to persist locally and sync back, which makes it a great test of the conflict resolution strategy.

## Opening Realm with Atlas Sync

```typescript
// lib/realmConfig.ts
import Realm from 'realm';
import { Lesson, FlashCard, StudySession, Answer } from '../models';

export async function openRealm(userId: string): Promise<Realm> {
  const app = new Realm.App({ id: process.env.EXPO_PUBLIC_REALM_APP_ID! });

  const credentials = Realm.Credentials.jwt(await getAuthToken());
  const user = await app.logIn(credentials);

  return await Realm.open({
    schema: [Lesson, FlashCard, StudySession, Answer],
    sync: {
      user,
      flexible: true,
      initialSubscriptions: {
        update: (subs, realm) => {
          // Only sync data for this user
          subs.add(
            realm.objects(StudySession).filtered('userId == $0', userId)
          );
          // Lessons are shared — sync all
          subs.add(realm.objects(Lesson));
        },
      },
      onError: (session, error) => {
        console.error('Sync error:', error);
        if (error.name === 'ClientReset') {
          handleClientReset(session, error);
        }
      },
    },
  });
}
```

## Sync Strategy and Conflict Resolution

The beauty of Atlas Device Sync is its **last-write-wins** CRDT strategy for scalar fields. But I still had to think carefully about the `StudySession` records.

The key insight: **never mutate study sessions after creation**. Each study session is append-only. This makes conflict resolution trivial — there's no state to reconcile, just records to accumulate.

For `easeFactor` on `FlashCard`, I used a conservative merge: when two devices update the same card offline, I take the lower ease factor (harder difficulty, safer for the user):

```typescript
// hooks/useFlashCard.ts
export function useUpdateEaseFactor(realm: Realm) {
  return (cardId: BSON.ObjectId, newFactor: number) => {
    realm.write(() => {
      const card = realm.objectForPrimaryKey(FlashCard, cardId);
      if (!card) return;

      // Conservative merge: take the harder difficulty
      card.easeFactor = Math.min(card.easeFactor, newFactor);
      card.lastReviewedAt = new Date();
    });
  };
}
```

## Handling the "First Open" Experience

On first install, the user has no data and Realm hasn't synced yet. I built a download progress UI that hooks into Realm's progress notifications:

```typescript
export function useSyncProgress() {
  const [progress, setProgress] = useState<number>(0);
  const realm = useRealm();

  useEffect(() => {
    const session = realm.syncSession;
    if (!session) return;

    const token = session.addProgressNotification(
      Realm.ProgressDirection.Download,
      Realm.ProgressMode.ReportIndefinitely,
      (transferred, total) => {
        setProgress(total > 0 ? transferred / total : 0);
      }
    );

    return () => session.removeProgressNotification(token);
  }, [realm]);

  return progress;
}
```

## Lessons Learned

**1. Design for append-only where possible.** Mutable shared state is the root of all sync headaches. If you can model your domain as an event log, do it.

**2. Flexible sync subscriptions are powerful but tricky.** It took me a few tries to get the subscription filters right. Over-subscribing means you're downloading too much data on mobile.

**3. Schema migrations need to be tested on old app versions.** I broke the schema once by adding a required field without a default value. Old clients crashed on the next sync. Always provide defaults.

**4. Realm's reactive queries are a game-changer.** Components that subscribe to `useQuery(StudySession)` re-render automatically when sync delivers new data. No manual cache invalidation needed.

After shipping GoPass with this architecture, we saw a dramatic drop in support tickets related to connectivity issues. Users can now study anywhere, sync when they get home, and their progress is always consistent. That's the offline-first promise delivered.
