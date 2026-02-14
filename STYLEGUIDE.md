# TrailCurrent Style Guide

Design reference for the TrailCurrent cross-platform app.
All values extracted from the Android app's Jetpack Compose theme.

---

## Color Palette

### Brand Colors

| Name           | Hex       | Usage                          |
| -------------- | --------- | ------------------------------ |
| Primary        | `#52A441` | Forest / Moss Green            |
| Primary Light  | `#7BC96A` | Lighter green (dark theme primary) |
| Primary Dark   | `#3D7B31` | Darker green (containers)      |
| Secondary      | `#D0E2C7` | Pale Sage                      |
| Secondary Dark | `#9AB090` | Darker sage (dark theme)       |
| Link / Accent  | `#83A79C` | Dusty Teal / Eucalyptus        |

### Status Colors

| Name     | Hex       | Usage                    |
| -------- | --------- | ------------------------ |
| Success  | `#74FE00` | Electric Lime            |
| Info     | `#48E6FE` | Bright Cyan              |
| Danger   | `#FF5453` | Soft Red / Coral         |
| Warning  | `#FFC107` | Amber                    |

### Neutrals

| Name    | Hex       | Usage              |
| ------- | --------- | ------------------ |
| White   | `#FFFFFF` | Pure white         |
| Light   | `#EBEBEB` | Off-white / Gray   |
| Dark    | `#000000` | True black         |

### Surface Colors

| Context           | Light Theme | Dark Theme |
| ----------------- | ----------- | ---------- |
| Background        | `#FAFAFA`   | `#121212`  |
| Card / Surface    | `#FFFFFF`   | `#1E1E1E`  |
| Surface Variant   | `#EBEBEB`   | `#2D2D2D`  |
| On Surface        | `#000000`   | `#EBEBEB`  |
| On Surface Variant| `#505050`   | `#BDBDBD`  |
| Primary BG Subtle | `#DCEDD9`   | `#3D5035`  |
| Secondary BG Subtle| `#EDF3EA`  | `#3D5035`  |

### Semantic Colors

| Purpose       | Color     | Hex       |
| ------------- | --------- | --------- |
| Solar         | Amber     | `#FFC107` |
| Battery Good  | Lime      | `#74FE00` |
| Battery Low   | Coral     | `#FF5453` |
| Heating       | Coral     | `#FF5453` |
| Cooling       | Cyan      | `#48E6FE` |
| Fresh Water   | Cyan      | `#48E6FE` |
| Grey Water    | Grey      | `#9E9E9E` |
| Black Water   | Dark Grey | `#424242` |

---

## Typography

System font (San Francisco on iOS, Roboto on Android).
Follows the Material 3 type scale.

| Role           | Size | Weight   | Line Height | Letter Spacing |
| -------------- | ---- | -------- | ----------- | -------------- |
| Display Large  | 57   | Normal   | 64          | -0.25          |
| Display Medium | 45   | Normal   | 52          | 0              |
| Display Small  | 36   | Normal   | 44          | 0              |
| Headline Large | 32   | Normal   | 40          | 0              |
| Headline Medium| 28   | Normal   | 36          | 0              |
| Headline Small | 24   | Normal   | 32          | 0              |
| Title Large    | 22   | Bold     | 28          | 0              |
| Title Medium   | 16   | Medium   | 24          | 0.15           |
| Title Small    | 14   | Medium   | 20          | 0.1            |
| Body Large     | 16   | Normal   | 24          | 0.5            |
| Body Medium    | 14   | Normal   | 20          | 0.25           |
| Body Small     | 12   | Normal   | 16          | 0.4            |
| Label Large    | 14   | Medium   | 20          | 0.1            |
| Label Medium   | 12   | Medium   | 16          | 0.5            |
| Label Small    | 11   | Medium   | 16          | 0.5            |

---

## Spacing

Base unit: 4px. Standard scale:

| Token | Value |
| ----- | ----- |
| xs    | 4     |
| sm    | 8     |
| md    | 12    |
| lg    | 16    |
| xl    | 20    |
| 2xl   | 24    |
| 3xl   | 32    |
| 4xl   | 48    |

---

## Border Radius

| Usage          | Radius |
| -------------- | ------ |
| Card           | 12     |
| Button         | 8      |
| Badge / Pill   | 16     |
| Input          | 8      |
| Full Circle    | 9999   |

---

## Elevation / Shadows

Cards use subtle elevation:

```
shadowColor: #000
shadowOffset: { width: 0, height: 1 }
shadowOpacity: 0.1
shadowRadius: 3
elevation: 2 (Android)
```

---

## Component Patterns

### Cards
- Full width with horizontal margin of `lg` (16)
- Padding: `lg` (16)
- Background: surface color
- Border radius: 12
- Subtle shadow

### Status Badges
- Pill shape (border radius 16)
- Horizontal padding: `md` (12), vertical: `xs` (4)
- Icon + text, colored by status level:
  - Good = success green
  - Warning = amber
  - Critical = coral red
  - Info = cyan

### Progress Bars
- Height: 8
- Border radius: 4
- Background: surface variant
- Fill: colored by value threshold

### Tank Bars (Water Screen)
- Vertical fill bars
- Height: 200, width: full card
- Border radius: 8
- Fill from bottom up, percentage-based
- Fresh = cyan, Grey = grey, Black = dark grey

### Bottom Tab Bar
- 7 tabs: Home, Trailer, Energy, Water, Air Quality, Map, Settings
- Icons from Ionicons
- Active tab: primary color
- Inactive tab: on-surface-variant color
- On small screens: show first N tabs + "More" overflow

### Thermostat Dial
- Circular arc (270 degrees, gap at bottom)
- Drag gesture to adjust temperature
- Color changes by mode: heating = coral, cooling = cyan, off = grey
- Center shows target temp (large) and current temp (small)

---

## Screen Layouts

All screens use a `ScrollView` with vertical padding.
Section titles use `titleMedium` weight.
Data values use `headlineSmall` or `titleLarge`.
Unit labels use `bodySmall` in muted color.

---

## Dark Mode

The app supports light and dark themes. Theme is toggled via Settings.
All colors have light/dark variants defined in the surface colors table above.
Status and semantic colors remain the same in both themes.
