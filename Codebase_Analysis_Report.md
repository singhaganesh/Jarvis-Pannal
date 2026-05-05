# Codebase Analysis Report

## Project Summary
**JARVIS WEBSERVER** is a lightweight, responsive web-based control panel designed for managing a security or industrial alarm system. It is likely hosted on an embedded microcontroller (such as an ESP32) given its use of WebSockets on port 81 and references to OTA (Over-The-Air) updates. The application provides real-time monitoring and control of multiple "Zones," system configurations, audio message management, and GSM/MQTT connectivity.

---

## Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (ES6+). No heavy frameworks (React/Vue/Angular) are used, making it highly efficient for resource-constrained environments.
- **Styling**: Vanilla CSS with custom properties (CSS variables) and media queries for mobile-first responsive design.
- **Icons**: [FontAwesome 6.5.1](https://fontawesome.com/) (loaded via CDN).
- **Communication**: [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for low-latency, real-time data streaming between the browser and the hardware.
- **Protocol**: Ad-hoc string-based messaging protocol (e.g., `Prefix:Value` or `COMMAND_DATA`).

---

## Architecture Overview
The application follows a **Single Page Application (SPA)** pattern where all views are contained within a single HTML file and toggled via JavaScript.

### Diagram
```
[ Browser / User Interface ]
      |
      | (WebSocket - Port 81)
      |
[ Embedded Web Server (e.g. ESP32) ]
      |
      |-- [ Hardware / GPIO ] (Zone Status, Sirens, Battery)
      |-- [ GSM Module ] (APN, Signal, SMS/Call)
      |-- [ Audio Controller ] (Record/Play Fire & Intruder Messages)
      |-- [ Storage / EEPROM ] (Config, MQTT/WiFi Credentials, Logs)
      |-- [ Network Stack ] (WiFi, LAN, MQTT)
```

---

## Module / Component Breakdown

### 1. Global Header & Status Bar
- **Header**: Contains the menu toggle for mobile, the system title, and a logout button.
- **Status Bar**: A horizontally scrolling badge area providing real-time health checks:
    - **ComIP**: WebSocket connection status (Blinking Green = Connected, Red = Disconnected).
    - **Health**: Battery, WiFi, LAN, GSM, Power, Mode, Tamp (Tamper), and System state.

### 2. Sidebar Navigation
Provides access to nine distinct control areas:
- **Zone Control**: Real-time status of 8 physical zones.
- **System Configuration**: Date/Time, Protocol (SIA/Contact ID), and Notifications.
- **Zone Time**: Scheduling for Day/Night and ARM/DISARM modes.
- **GSM Setting**: Modem control, APN settings, and signal monitoring.
- **REC & PLAY**: Audio management for alarm voice messages.
- **Event/Contact/Holiday Views**: Data viewers for system logs and configurations.
- **Device Credential**: Setup for MQTT and WiFi access.

---

## File-by-File Reference

### `JARVIS.html`
- **Purpose**: Defines the structure and UI of the entire application.
- **Role**: Entry point and container for all SPA sections.
- **Key Contents**: 
    - Layout split into `<header>`, `<aside>` (Sidebar), and `<main>`.
    - Hardcoded sections (`<section id="...">`) for each module.
    - Modal-like overlays for mobile navigation.
- **Notable Patterns**: Uses `data-section` attributes on buttons to link to section IDs for navigation.

### `JARVIS.css`
- **Purpose**: Handles all visual styling, layout, and responsiveness.
- **Role**: Presentation layer.
- **Key Contents**:
    - **CSS Variables**: `--bg`, `--accent`, `--sidebar-width` for easy skinning.
    - **Flexbox/Grid**: Used for the main container and zone card layouts.
    - **Media Queries**: Extensive support for Mobile (Portrait/Landscape) and Tablets.
    - **Animations**: `fadeIn` for page transitions and `pulse`/`blink` for alerts.
- **Notable Decisions**: Custom scrollbar styling for the status bar to ensure a "dashboard" feel on mobile.

### `JARVIS.js`
- **Purpose**: Orchestrates WebSocket communication and UI interactions.
- **Role**: Application logic and controller.
- **Key Contents**:
    - **WebSocket Lifecycle**: `connect()`, `onopen`, `onmessage`, `onclose`, and auto-reconnect logic.
    - **`handleMsg(raw)`**: A massive switch-like parser that identifies incoming hardware updates by string prefix.
    - **UI Helpers**: `qs()` (querySelector) and `qsa()` (querySelectorAll) for DOM manipulation.
    - **Dynamic Injection**: Handles `NUM:` prefix to inject raw HTML tables for Contact View.
- **Notable Decisions**: Uses an IIFE to encapsulate the core WebSocket logic while providing a separate `DOMContentLoaded` listener for UI initialization.

---

## Data Flow

### Outbound (User -> Hardware)
1. User interacts with a UI element (e.g., clicks "Save MQTT").
2. JS event listener retrieves input values.
3. JS sends a formatted string over the WebSocket:
   - Example: `MQTTINFO_authKey,user,pass`
   - Example: `ZoneMode:ZONE01|DAY`
4. The hardware receives the string and executes the corresponding internal function.

### Inbound (Hardware -> User)
1. Hardware state changes (e.g., Zone 1 is triggered).
2. Hardware sends a string over WebSocket: `Zone01: : :Trigger`.
3. `ws.onmessage` receives the data.
4. `handleMsg` identifies the prefix `Zone`, parses the status, and updates the DOM (e.g., changes the badge color to Red).

---

## Key Patterns & Design Decisions
- **Prefix-Based Protocol**: Instead of JSON (which requires more overhead to parse on small microcontrollers), the system uses simple string prefixes.
- **State-Driven UI**: The UI doesn't store state; it reflects whatever the latest WebSocket message dictates.
- **Mobile-First Sidebar**: The sidebar transforms from a fixed column on desktop to a slide-out drawer on mobile.
- **Toast Notifications**: Provides immediate feedback for async WebSocket commands.

---

## Things to Watch Out For
1. **Security**: The "Logout" button simply redirects to `/`. There is no apparent authentication token management in the frontend, suggesting security might be handled at the web server level (e.g., Basic Auth or IP filtering).
2. **Plain-Text Credentials**: MQTT and WiFi passwords are sent in the clear via WebSockets and are visible in input fields (`type="password"` only masks locally).
3. **Hardcoded Limits**: The HTML contains 8 zone cards; if the hardware supports more, the UI must be manually updated.
4. **Error Handling**: The WebSocket `onerror` is currently silent, and some `try-catch` blocks are commented out.
5. **DOM Injection**: Injecting raw HTML (as seen in `NUM:`) is powerful but poses a risk if the source (hardware) is ever compromised (XSS).

---

## Recommended Starting Points for a New Developer
1. **`JARVIS.js` -> `handleMsg()`**: This is the heart of the app. Understanding how hardware strings map to UI changes is critical.
2. **`JARVIS.html` Sections**: To add a new feature, you must create a new `<section>` and add a corresponding button in the `<nav>`.
3. **Responsive Debugging**: Use Chrome DevTools in Mobile mode to verify changes to the Sidebar and Status Bar, as they behave differently across breakpoints.
4. **WebSocket Simulation**: If hardware isn't available, use a WebSocket testing tool (like [wscat](https://www.npmjs.com/package/wscat)) to send strings like `Battery:Connected` to the UI to see how it reacts.
