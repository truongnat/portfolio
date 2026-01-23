---
title: "Hardening Mobile: Keychains, SSL Pinning, and Biometrics"
date: "2024-05-30"
description: "Is your mobile app secure? Learn how to store tokens in the native Keychain, implement SSL Pinning to prevent MITM, and use Biometrics for secure auth."
slug: "react-native-security-and-hardening-guide"
published: true
tags: ["Frontend", "React Native"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Hardening Mobile: Keychains, SSL Pinning, and Biometrics

Security on mobile is unique because the user often has physical access to the device. You must protect the data "at rest" and "in transit."

## 1. Secure Storage (Keychain / Keystore)

**The Pitfall:** Storing auth tokens in `AsyncStorage`.
**The Risk:** `AsyncStorage` is just a plain text file on the device. Any root-level exploit can read it.
**The Fix:** Use `expo-secure-store` or `react-native-keychain`. These utilize the hardware-backed **iOS Keychain** and **Android Keystore**.

## 2. SSL Pinning

Prevent "Man-in-the-middle" (MITM) attacks by ensuring your app *only* talks to your specific server certificate.
*   **The Tool:** `react-native-ssl-pinning`.
*   **The Benefit:** Even if a user installs a malicious proxy on their phone, the app will refuse to connect.

## 3. Native Biometrics

Don't just ask for a PIN.
*   **The Power:** Use `expo-local-authentication` to integrate **FaceID** and **TouchID**.
*   **Best Practice:** Use biometrics to unlock the *Keychain*, rather than just checking a boolean `isLoggedIn` flag.

## 4. Obfuscation (ProGuard / DexGuard)

*   **Android:** Enable ProGuard to minify and obfuscate your Java/Kotlin code.
*   **Why?** It makes it much harder for an attacker to reverse-engineer your app logic from the `.apk`.

## Summary

Security in React Native is about **Leveraging the Hardware**. Use the Keystore for data, the TPM for biometrics, and certificate pinning for the network. Don't trust the JS layer for sensitive operations.