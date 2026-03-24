---
title: "Building an Interactive Vietnam Map for KPI Visualization in React Native"
date: "2026-03-24"
description: "How I built a touch-interactive Vietnam regional map in React Native to visualize business KPIs per province for the NetBI mobile app."
slug: "react-native-geospatial-visualization"
published: true
tags: ["Mobile", "React Native", "Data Visualization"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"
---

# Building an Interactive Vietnam Map for KPI Visualization in React Native

One of the most visually striking features in **NetBI** — our business intelligence mobile app — is the Vietnam regional map. Business managers tap on a province, and instantly see that region's revenue, orders, and growth metrics. It sounds simple. Building it was not.

This post covers the SVG-based approach I chose, the touch interaction challenges, and how I kept performance acceptable when rendering data for 63 provinces.

## Why Not a Map Library?

My first instinct was to reach for `react-native-maps` (Mapbox/Google Maps). But standard map libraries have significant drawbacks for this use case:

1. **Tile-based maps** show geographic detail (roads, buildings) that's noise for a KPI dashboard. We wanted a clean, stylized choropleth map.
2. **Licensing costs**: Google Maps SDK charges per map load. With thousands of daily active users, this adds up fast.
3. **Interaction model**: Standard maps support pan, zoom, and marker taps. We needed province-level polygon taps with custom tooltips — awkward to implement on a tile map.

The alternative: render Vietnam's provinces as **SVG paths** directly in React Native.

## Getting the GeoJSON Data

I sourced Vietnam's province boundaries from a public GeoJSON dataset (simplified to 10% resolution using [Mapshaper](https://mapshaper.org/) to reduce file size).

The raw GeoJSON was 2.8 MB. After simplification: 180 KB. That's a meaningful difference when you're parsing it on a mobile device.

Next, I converted the GeoJSON coordinates to SVG path strings using a custom script:

```typescript
// scripts/geoJsonToSvg.ts
import * as d3 from 'd3-geo';
import { Feature, Geometry } from 'geojson';

export function geoJsonToSvgPaths(
  features: Feature<Geometry>[],
  width: number,
  height: number
): Record<string, string> {
  const projection = d3.geoMercator()
    .center([107.5, 16.5]) // Center on Vietnam
    .scale(2000)
    .translate([width / 2, height / 2]);

  const pathGenerator = d3.geoPath().projection(projection);

  const paths: Record<string, string> = {};

  for (const feature of features) {
    const provinceCode = feature.properties?.code as string;
    const pathData = pathGenerator(feature);
    if (pathData) {
      paths[provinceCode] = pathData;
    }
  }

  return paths;
}
```

I ran this as a build-time script and committed the output — a JSON file mapping province codes to SVG path strings. This avoids doing the projection math at runtime on the device.

## Rendering the Map

React Native doesn't have a built-in SVG renderer, so I used `react-native-svg`:

```typescript
// components/VietnamMap.tsx
import React, { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { interpolateColor } from '../utils/colorScale';
import provincePaths from '../data/vietnam-provinces.json';

interface ProvinceData {
  code: string;
  value: number;
  label: string;
}

interface Props {
  data: ProvinceData[];
  onProvincePress: (code: string) => void;
  selectedProvince?: string;
  width: number;
  height: number;
}

export const VietnamMap: React.FC<Props> = ({
  data,
  onProvincePress,
  selectedProvince,
  width,
  height,
}) => {
  const dataMap = useMemo(() => {
    return new Map(data.map((d) => [d.code, d]));
  }, [data]);

  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const getColor = useCallback((code: string) => {
    const item = dataMap.get(code);
    if (!item) return '#E5E7EB'; // Gray for provinces with no data

    const normalized = item.value / maxValue;
    return interpolateColor(normalized, '#DBEAFE', '#1D4ED8'); // Light to dark blue
  }, [dataMap, maxValue]);

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <G>
          {Object.entries(provincePaths).map(([code, pathData]) => (
            <Path
              key={code}
              d={pathData as string}
              fill={getColor(code)}
              stroke={selectedProvince === code ? '#F59E0B' : '#FFFFFF'}
              strokeWidth={selectedProvince === code ? 2 : 0.5}
              onPress={() => onProvincePress(code)}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
};
```

## Color Interpolation for the Choropleth Effect

I implemented a simple linear interpolation function for the blue gradient:

```typescript
// utils/colorScale.ts
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

export function interpolateColor(t: number, from: string, to: string): string {
  const [r1, g1, b1] = hexToRgb(from);
  const [r2, g2, b2] = hexToRgb(to);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r}, ${g}, ${b})`;
}
```

## Touch Interaction and Tooltip

When a province is tapped, I display a floating tooltip with the KPI data. The challenge is positioning it — you want the tooltip near the tapped province but still within screen bounds.

```typescript
// hooks/useMapTooltip.ts
import { useState, useCallback } from 'react';
import { GestureResponderEvent } from 'react-native';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  code: string;
}

export function useMapTooltip(mapWidth: number, mapHeight: number) {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false, x: 0, y: 0, code: '',
  });

  const handleProvincePress = useCallback((
    code: string,
    event: GestureResponderEvent
  ) => {
    const { locationX, locationY } = event.nativeEvent;

    // Keep tooltip within map bounds
    const tooltipWidth = 160;
    const tooltipHeight = 80;
    const x = Math.min(locationX, mapWidth - tooltipWidth);
    const y = Math.max(locationY - tooltipHeight - 10, 0);

    setTooltip({ visible: true, x, y, code });
  }, [mapWidth]);

  const dismissTooltip = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  return { tooltip, handleProvincePress, dismissTooltip };
}
```

## Performance with 63 Provinces

Rendering 63 SVG paths isn't inherently expensive, but re-rendering all of them on every data update was causing visible lag when the dashboard auto-refreshed.

The fix: memoize each province's color and only re-render paths whose data changed.

I wrapped each `Path` in a `React.memo` component:

```typescript
const ProvincePath = React.memo<{
  code: string;
  pathData: string;
  color: string;
  isSelected: boolean;
  onPress: (code: string) => void;
}>(({ code, pathData, color, isSelected, onPress }) => (
  <Path
    d={pathData}
    fill={color}
    stroke={isSelected ? '#F59E0B' : '#FFFFFF'}
    strokeWidth={isSelected ? 2 : 0.5}
    onPress={() => onPress(code)}
  />
), (prev, next) => (
  prev.color === next.color && prev.isSelected === next.isSelected
));
```

With this optimization, a data update only triggers re-renders for provinces whose values changed — typically 5-10 out of 63. Frame rate during updates went from 45 FPS to a smooth 60 FPS.

## Lessons Learned

**Pre-compute everything you can at build time.** The GeoJSON-to-SVG conversion is deterministic. Running it at build time rather than app startup saved ~300ms on cold start.

**SVG is great for this use case, but has limits.** If you need pan/zoom (like a drill-down to district level), you'll want `react-native-svg` + gesture handler with transform matrices. It's doable but complex.

**Use logarithmic scale for heavily skewed data.** Ho Chi Minh City and Hanoi completely dominated the color scale with linear interpolation — every other province looked identical. Switching to a logarithmic scale gave much more useful visual differentiation.

The Vietnam map became one of NetBI's signature features, and I'm proud of how well it performs on a $150 Android device. SVG + memoization + build-time precomputation is a pattern I'll reach for again.
