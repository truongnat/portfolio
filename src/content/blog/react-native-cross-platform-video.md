---
title: "Real-Time Video Conferencing Across Web, Desktop, and Mobile with Jitsi Meet"
date: "2026-03-24"
description: "How our team integrated Jitsi Meet into Vue.js, Electron, and React Native for a unified video conferencing experience in Naver Cloud Meeting."
slug: "react-native-cross-platform-video"
published: true
tags: ["Mobile", "React Native", "Real-Time", "WebRTC"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=1000"
---

# Real-Time Video Conferencing Across Web, Desktop, and Mobile with Jitsi Meet

Video conferencing sounds straightforward until you have to make it work on three completely different platforms simultaneously. That was the reality of **Naver Cloud Meeting**, a project where our team had to deliver a seamless meeting experience on Vue.js web, Electron desktop, and React Native mobile — all pointing at the same Jitsi Meet backend.

Here's what we learned the hard way.

## Why Jitsi Meet

We could have built on top of raw WebRTC, but that path is paved with browser compatibility nightmares, STUN/TURN server headaches, and codec negotiation bugs. Jitsi Meet gave us:

- A battle-tested SFU (Selective Forwarding Unit) with Jicofo and Jitsi Videobridge
- SDKs for web (IFrame API), iOS, and Android
- Built-in features: screen sharing, noise suppression, virtual backgrounds
- Self-hosted option for data sovereignty (Naver required this)

The trade-off: Jitsi's mobile SDK is a native module that adds ~40MB to your bundle and doesn't follow the same API conventions as the web IFrame API. Keeping UX consistent across platforms required significant abstraction work.

## Web Integration: Vue.js + Jitsi IFrame API

On web, the integration is relatively painless. We wrapped the IFrame API in a Vue composable:

```typescript
// composables/useJitsiMeet.ts
import { ref, onUnmounted } from 'vue';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export function useJitsiMeet() {
  const api = ref<any>(null);

  async function joinMeeting(roomName: string, displayName: string, token: string) {
    await loadJitsiScript('https://meet.yourserver.com/external_api.js');

    api.value = new window.JitsiMeetExternalAPI('meet.yourserver.com', {
      roomName,
      userInfo: { displayName },
      jwt: token,
      parentNode: document.getElementById('jitsi-container'),
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup', 'chat', 'screenshare'],
      },
    });

    api.value.addEventListener('readyToClose', () => leaveMeeting());
  }

  function leaveMeeting() {
    api.value?.dispose();
    api.value = null;
  }

  onUnmounted(() => leaveMeeting());

  return { joinMeeting, leaveMeeting, api };
}
```

## Desktop Integration: Electron

For Electron, we initially tried using the web IFrame approach inside a `BrowserView`. This worked but felt hacky — the IFrame had no access to native audio device APIs, so users couldn't switch microphones without digging into OS settings.

We switched to loading the full Jitsi Meet web app in a dedicated `BrowserWindow` with custom preload scripts to inject our configuration:

```typescript
// main/meetingWindow.ts
import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';

export function createMeetingWindow(roomName: string, jwt: string): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  const url = new URL(`https://meet.yourserver.com/${roomName}`);
  url.searchParams.set('jwt', jwt);
  url.searchParams.set('config.startWithAudioMuted', 'true');

  win.loadURL(url.toString());

  // Forward meeting events back to renderer
  ipcMain.on('meeting:leave', () => win.close());

  return win;
}
```

This gave us native audio device switching, better screen share quality, and access to system notifications.

## Mobile Integration: React Native

This is where things got genuinely tricky. The `react-native-jitsi-meet` SDK wraps the native iOS and Android SDKs, but it comes with opinions about how you launch the meeting view.

```typescript
// components/JitsiMeetScreen.tsx
import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import JitsiMeet, { JitsiMeetView } from '@jitsi/react-native-sdk';

interface Props {
  roomName: string;
  token: string;
  displayName: string;
  onConferenceTerminated: () => void;
}

export const JitsiMeetScreen: React.FC<Props> = ({
  roomName, token, displayName, onConferenceTerminated,
}) => {
  const serverUrl = 'https://meet.yourserver.com';

  return (
    <View style={{ flex: 1 }}>
      <JitsiMeetView
        room={`${serverUrl}/${roomName}`}
        token={token}
        userInfo={{ displayName, email: '', avatar: '' }}
        config={{
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          callIntegrationEnabled: Platform.OS === 'ios', // CallKit on iOS
        }}
        style={{ flex: 1 }}
        onConferenceTerminated={onConferenceTerminated}
        onConferenceJoined={() => console.log('Joined meeting')}
        onConferenceFailed={(e) => console.error('Failed:', e)}
      />
    </View>
  );
};
```

### Handling Permissions on iOS and Android

Permissions were the biggest source of bugs. On iOS, you need `NSCameraUsageDescription` and `NSMicrophoneUsageDescription` in `Info.plist`, but the SDK's CallKit integration also requires `NSLocalNetworkUsageDescription`. Missing that caused silent failures on iOS 14+.

On Android, we needed to request permissions at runtime before launching the meeting view:

```typescript
import { PermissionsAndroid, Platform } from 'react-native';

async function requestMeetingPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const grants = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, // Android 12+
  ]);

  return Object.values(grants).every(
    (status) => status === PermissionsAndroid.RESULTS.GRANTED
  );
}
```

The `BLUETOOTH_CONNECT` permission caught us off guard on Android 12 devices — users with Bluetooth earbuds couldn't hear audio without it.

## Keeping UX Consistent Across Platforms

Our product team wanted the same meeting controls on all three platforms. We achieved this by hiding Jitsi's native UI controls and building our own control bar that communicated with the SDK via events:

- On web: `api.executeCommand('toggleAudio')`
- On Electron: IPC message → preload script → postMessage to Jitsi window
- On mobile: `JitsiMeet.setAudioMuted(true)`

All three were wrapped behind a single `MeetingControls` interface that the UI consumed, keeping the components clean and platform-agnostic.

## What I'd Do Differently

**Test on real devices early.** The simulators lie about audio/video behavior. We wasted two sprints debugging issues that only appeared on real hardware.

**Budget for SDK updates.** Jitsi's native SDKs update frequently and sometimes break APIs without deprecation warnings. Pin your versions and budget time for upgrades.

**Consider LiveKit for greenfield projects.** Jitsi is excellent and battle-tested, but LiveKit's modern API and React Native SDK are significantly easier to work with. If I were starting fresh today, I'd evaluate it seriously.

Despite the challenges, Naver Cloud Meeting shipped on all three platforms within the same release window, and the Jitsi backbone handled hundreds of concurrent meetings without breaking a sweat.
