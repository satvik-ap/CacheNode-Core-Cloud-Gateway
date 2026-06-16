# CacheNode Core — Cloud Gateway Control Panel

CacheNode Core is a professional, high-fidelity React dashboard built for administrators to monitor and orchestrate cloud server gateways, serverless function runtimes, and virtual topology paths. 

Built as a product-grade solution for the ITM Skills University React.js Case Study evaluation, this application features real-time state synchronization, live REST API integrations, and direct visual network manipulation.

---

## 🚀 Key Product Features

### A. 🌐 URL Path Viewer
- **collapsible Routing Tree:** View nested API and sitemap path registry structures (e.g. `/api/v1/users`).
- **Dynamic Endpoint Registration:** Inline form to register new custom pathways, specify HTTP methods (GET, POST, PUT, DELETE, PATCH), targets, and latency.

### B. 🔐 Security Undo Log
- **Firewall Policy Log:** Live stream log of firewall block subnets, rate limits, ACL grants, and authentication rule changes.
- **Reversion Engine:** Instantly roll back rule modifications with the **Undo** button, or re-apply them with **Redo** (saves states persistently).
- **Rule Creator:** Interactive form to apply new policies to active subnets or accounts.

### C. ⏳ Traffic Limit Queue
- **Live API Integration:** Fetches client names and profile identifiers from the [JSONPlaceholder Users API](https://jsonplaceholder.typicode.com/users) with simulated loading skeletons.
- **Rate Policing:** Displays request loads in active 60s windows compared against quotas.
- **Operator Actions:** Manually toggle the gateway **Block/Unblock** access for any client, or slide quota limit thresholds directly in the table row.

### D. 🔍 Server ID Checker
- **Signature Validation:** Instantly search and verify cloud server unique IDs or IP signatures against active clusters.
- **Diagnostics Controls:** 
  - **Reboot Node:** Triggers a 3-second reboot sequence, showing offline flags and zeroed resources before joining the pool back.
  - **Maintenance Mode:** Toggles server flags between Active and Warning states.

### E. 📊 Data Usage Sorter
- **Bandwidth Consumption Ranker:** Ranks all API consumers by download (egress) volume.
- **Controls:** Toggle sort directions (Ascending/Descending) or filter client views based on Service Tiers (Platinum, Gold, Silver, Bronze, Free).

### F. 🛰️ Network Link Hub & Canvas
- **SVG Topology Canvas:** Visual map rendering regional cluster nodes and virtual connection lines.
- **Animated Data Packets:** Shows flow speed based on active connection latency.
- **Connection severing:** Click any connection line to disable it on the fly, simulating a network node failure.

### G. 🔀 Dijkstra Fastest Path Finder
- **GPS-Routing Simulator:** Calculates the optimal shortest-latency path between start and end node gateways using **Dijkstra's Algorithm**.
- **Interactive SVG Nodes:** Click nodes directly on the visual map to assign source/destination endpoints.
- **Topology Sync:** Dynamically recalculates routes when connection lines are disabled in the Network Link Hub.

### H. ⚖️ Traffic Balancer
- **Gateway load balancing:** Simulates incoming traffic routing using **Least Connections** or **Round Robin** policies.
- **Auto-Scale Controls:** Dynamically **Scale Up (Add Worker Node)** or **Terminate** serverless containers, watching load balance weights adjust in real-time.

---

## 🛠️ Technology Stack
- **Core:** React.js 19 (Hooks, Context, Providers)
- **Tooling:** Vite, ESLint
- **Styling:** Vanilla CSS (Glassmorphism, curated HSL palettes, CSS variables, and slide-in keyframe animations)
- **Data Integration:** JSONPlaceholder REST API (using standard `fetch` and loading states)
- **State Management:** Persistent browser synchronization hook (`localStorage` synced across active tabs/components)

---

## 💻 Local Setup Instructions

Follow these steps to run the gateway control panel locally:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/satvik-ap/CacheNode-Core-Cloud-Gateway.git
   cd CacheNode-Core-Cloud-Gateway
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Compile Production Build:**
   ```bash
   npm run build
   ```
