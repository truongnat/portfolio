---
title: "Migrating to Expo Managed Workflow: EAS Build, OTA Updates, and What I Learned"
date: "2026-03-24"
description: "How I migrated a React Native delivery app to Expo managed workflow, cut build times by 70%, and streamlined OTA updates for 50k users."
slug: "react-native-expo-managed-workflow"
published: true
tags: ["Mobile", "React Native", "Expo", "DevOps"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=1000"
---

# Migrating to Expo Managed Workflow: EAS Build, OTA Updates, and What I Learned

There's a moment every bare React Native project eventually reaches: the Android build takes 25 minutes on CI, the iOS Xcode project has merge conflicts every week, and onboarding a new developer requires half a day of Gradle troubleshooting. Our delivery app hit that moment after two years of growth. It was time to migrate to **Expo managed workflow**.

This is the story of that migration — what was easy, what wasn't, and the 70% build time reduction we achieved at the end.

## Why Bare React Native Becomes Painful

In the early days, bare React Native (with or without Expo) feels liberating. You have full control. You can patch native modules, modify the Android manifest, add custom Gradle plugins.

But that freedom accumulates debt:

- **Native module incompatibilities**: Different native modules require different Gradle/NDK versions. You end up with a fragile dependency tree.
- **Xcode project drift**: iOS project files are binary-ish XML that doesn't diff well. Team members constantly get conflicts in `.xcodeproj` files.
- **Build environment maintenance**: We had a dedicated EC2 instance for Android builds and a Mac mini for iOS builds. Both needed constant babysitting.
- **No OTA for hotfixes**: Shipping a typo fix required a full app store review cycle.

The delivery app had ~50,000 active users. A bug in the order confirmation screen meant angry customers and a 5-7 day wait for an App Store fix. That was unsustainable.

## Migration Strategy

I didn't attempt a big-bang migration. Instead, I followed a phased approach over four sprints:

**Sprint 1: Audit native dependencies**
- Catalogued every native module: `react-native-maps`, `react-native-camera`, `react-native-push-notification`, etc.
- Checked each against the [Expo compatibility list](https://docs.expo.dev/versions/latest/)
- Most had Expo equivalents. Two didn't: a custom barcode scanner and a signature capture module.

**Sprint 2: Replace incompatible modules**
- Replaced the custom barcode scanner with `expo-camera` (which includes barcode scanning)
- Replaced signature capture with a pure JS canvas implementation
- Added `expo-modules-core` to the project

**Sprint 3: Convert to Expo managed**
- Created `app.json` with the full Expo config
- Ran `npx expo-modules-core install` to migrate the native project
- Moved native configurations from `AndroidManifest.xml` / `Info.plist` into `app.json` plugins

**Sprint 4: EAS Build setup and testing**

## EAS Build Configuration

The `eas.json` configuration ended up looking like this:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "channel": "production",
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "enterpriseProvisioning": "automatic"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "team@company.com",
        "ascAppId": "1234567890"
      }
    }
  }
}
```

The `channel` field is important — it's what links EAS Update (OTA) to a specific build. More on that below.

## OTA Update Strategy

This was the feature I was most excited about. With `expo-updates`, we can push JavaScript changes to users without a store review.

Our update strategy:

```typescript
// lib/updates.ts
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export async function checkForUpdates(): Promise<void> {
  if (__DEV__) return; // No OTA in development

  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();

      Alert.alert(
        'Update Available',
        'A new version has been downloaded. Restart to apply?',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Restart Now',
            onPress: () => Updates.reloadAsync(),
          },
        ]
      );
    }
  } catch (error) {
    // Fail silently — don't crash the app over an update check
    console.warn('Update check failed:', error);
  }
}
```

I call `checkForUpdates()` when the app comes to the foreground. For critical hotfixes, I use a more aggressive approach: fetch and reload immediately without prompting.

The `expo-updates` config in `app.json`:

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/your-project-id",
      "fallbackToCacheTimeout": 0,
      "checkAutomatically": "ON_LOAD"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

The `runtimeVersion` policy is critical. Using `"appVersion"` means OTA updates are only delivered to users on the same app version. If you change a native module, you bump the app version and create a new native build — users get the native update from the store, then OTA updates resume.

## The Gotchas

**1. EAS Secrets management.** In bare RN, we had secrets in `.env` files and Gradle properties. In Expo, secrets go through EAS Secrets. The migration was tedious but the result is cleaner.

**2. `expo-dev-client` is required for native debugging.** You can't just do `npx expo start` and test native features in the Expo Go app. You need to build a dev client first: `eas build --profile development`.

**3. OTA updates can't change native code.** This is obvious but easy to forget. Updating a native module version requires a full store build. We had one incident where a developer pushed an OTA update that referenced a new native API — it crashed for all users until I rolled back.

**4. iOS simulator builds are slow on EAS.** We moved iOS simulator builds to local `npx expo run:ios` and only use EAS for device builds and production.

## Results

| Metric | Before (Bare RN) | After (Expo Managed) |
|---|---|---|
| Android CI build | 24 min | 7 min |
| iOS CI build | 38 min | 11 min |
| New dev setup time | ~4 hours | ~30 minutes |
| Hotfix deploy time | 5-7 days (store review) | 10 minutes (OTA) |
| Monthly CI cost | $340 (self-hosted) | $89 (EAS) |

The 70% build time reduction comes from EAS's remote build infrastructure with pre-warmed build agents and cached dependencies. No more waiting for Gradle to download the internet on every build.

Expo managed workflow won't work for every project — if you have deep native customizations, you'll fight the abstraction layer. But for most business apps, the productivity gains are substantial.
