


https://github.com/user-attachments/assets/8ca53ed6-12a8-488f-82f4-e5eca75a2c94



# TrailCurrent App

Cross-platform mobile app for monitoring and controlling TrailCurrent vehicle systems. Built with React Native and Expo.

## Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| Framework    | Expo SDK 54, React Native 0.81, TypeScript    |
| Routing      | Expo Router (file-based)                      |
| State        | React Context + useReducer                    |
| HTTP         | fetch (built-in)                              |
| WebSocket    | Built-in WebSocket API with auto-reconnect    |
| Storage      | AsyncStorage (prefs), SecureStore (API key)   |
| Maps         | react-native-maps                             |
| Icons        | @expo/vector-icons (Ionicons)                 |

## Screens

- **Home** -- Thermostat dial (drag to adjust) + light grid (tap toggle, long-press brightness)
- **Trailer** -- Bubble level indicators + GNSS details (satellites, speed, course)
- **Energy** -- Solar input, battery level/voltage, charge status, time remaining
- **Water** -- Fresh / grey / black tank levels with color-coded thresholds
- **Air Quality** -- Temperature, humidity, IAQ index, CO2 with recommendations
- **Map** -- Vehicle position marker, compass, position info card
- **Settings** -- Server URL, API key, dark mode toggle

## Project Structure

```
TrailCurrentApp/
  app/                        # Expo Router pages
    _layout.tsx               # Root layout (providers, auth redirect)
    server-config.tsx         # First-run server setup
    (tabs)/                   # Tab navigation
      _layout.tsx             # Bottom tab bar (7 tabs)
      index.tsx               # Home
      trailer.tsx             # Trailer
      energy.tsx              # Energy
      water.tsx               # Water
      air-quality.tsx         # Air Quality
      map.tsx                 # Map
      settings.tsx            # Settings
  src/
    components/               # Reusable UI components
    context/AppContext.tsx     # Global state (vehicle data, config, connection)
    services/
      api.ts                  # REST client
      websocket.ts            # WebSocket with exponential backoff
      storage.ts              # Persistent storage helpers
    theme/                    # Colors, typography, spacing, ThemeProvider
    types.ts                  # TypeScript interfaces
  STYLEGUIDE.md               # Design reference
```

## Getting Started

### Prerequisites

- **Node.js 18+** -- required for all platforms
- **iOS Simulator** -- requires Xcode installed (for the simulator binary; you don't need to open or configure Xcode)
- **Android Emulator** -- requires Android Studio installed (for the emulator binary; you don't need to open or configure Android Studio)
- **Physical device** -- requires neither Xcode nor Android Studio. Install [Expo Go](https://expo.dev/go) on your phone and scan the QR code

### Install

```bash
cd TrailCurrentApp
npm install --legacy-peer-deps
```

### Run

```bash
# Start Metro bundler
npx expo start

# Or open directly on a platform
npx expo start --ios
npx expo start --android
```

Press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code with Expo Go on a physical device.

### First Launch

The app opens to a **Server Configuration** screen. Enter your TrailCurrent server URL (e.g. `http://192.168.1.100:3000`) and optional API key. Tap **Test Connection** to verify, then **Save & Continue**.

To explore the UI without a backend, enter any URL and tap Save & Continue. Screens will show empty/default states but all navigation and theming will be functional.

## API Compatibility

The app connects to the same backend as the native Android app (TrailCurrentAndroidApp). All REST endpoints and WebSocket event types are identical:

- `GET/PUT /api/thermostat`
- `GET /api/lights`, `PUT /api/lights/:id`
- `GET /api/trailer/level`
- `GET /api/energy`
- `GET /api/water`
- `GET /api/airquality`
- `GET/PUT /api/settings`
- `GET /api/health`
- WebSocket events: `thermostat`, `light`, `energy`, `water`, `airquality`, `temphumid`, `latlon`, `alt`, `gnss_details`, `level`

## Troubleshooting

**"Could not connect to development server"**

This means the device/simulator can't reach Metro bundler.

1. Make sure Metro is running (`npx expo start`).
2. Try restarting with a clean cache: `npx expo start --clear`.
3. If using iOS Simulator and localhost fails, start with your LAN IP:
   ```bash
   export REACT_NATIVE_PACKAGER_HOSTNAME="<your-ip>"
   npx expo start --clear --host lan
   ```
   Find your IP with `ipconfig getifaddr en0` (macOS).
4. Check that macOS Firewall allows incoming connections for `node` (System Settings > Network > Firewall > Options).
5. If Expo Go gets stuck on its splash screen, uninstall it from the simulator and let Expo reinstall it:
   ```bash
   xcrun simctl uninstall booted host.exp.Exponent
   npx expo start --clear --ios
   ```

**Blank screen after app loads**

- Press `r` in the Metro terminal to force a reload.
- Check the Metro terminal for error output.

**TypeScript errors**

Run the type checker to see all issues:
```bash
npx tsc --noEmit
```

**Port 8081 already in use**

Kill the existing process and restart:
```bash
lsof -ti:8081 | xargs kill -9
npx expo start --clear
```

## Platform Support

- iOS 16+
- Android 7+ (API 26)
- Web (experimental, via Expo)
