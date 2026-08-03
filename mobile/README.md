# Gray Space — Mobile (Expo)

Expo SDK **54** app for Expo Go (current iOS Expo Go max).

## Run

```bash
cd mobile
pnpm install
pnpm start:tunnel
```

Scan the QR code with **Expo Go** (iOS Camera / Android Expo Go).

> Use `start:tunnel` when Metro shows `127.0.0.1` or your phone is not on the same LAN (cloud agents, remote VMs). Plain `pnpm start` only works on the same network.

### Shell demo (no Apple / Supabase)

1. Open the app in Expo Go  
2. Tap **Explore the shell**  
3. Switch White / Gray / Black, open Notifications & Messages, tap the orb to create  

## Scripts

| Command | Purpose |
|--------|---------|
| `pnpm start` | Metro (LAN) |
| `pnpm start:tunnel` | Metro via tunnel (Expo Go off-LAN) |
| `pnpm web` | Web preview |
| `npx expo-doctor` | Dependency health check |
