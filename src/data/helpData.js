export const helpData = {
  // --- Modules ---
  'url-viewer': {
    title: 'URL Path Viewer',
    icon: '🌐',
    summary: 'See all the website links and API paths in one place.',
    whatIsIt: 'Think of this like a folder explorer for your website\'s links. Just like Windows Explorer shows your folders and files in a tree, this shows all your website\'s paths (like /home, /login, /api/users) in a nice collapsible tree. You can click to expand or collapse any folder of links.',
    usedFor: [
      'Quickly see all the pages and links your website has — like a sitemap.',
      'Check what type of action each link does — GET (read), POST (create), PUT (update), DELETE (remove).',
      'See how fast each page responds (e.g., 14ms means it replies in 14 milliseconds — very fast!).',
      'Search for a specific link by typing its name, so you don\'t have to scroll through everything.'
    ],
    deepDive: 'Every time someone visits a page on your website, the system checks a list of all known links (called a "routing table") to figure out which page to show. The speed number (ms) shows how long that lookup takes on average.'
  },
  'security-log': {
    title: 'Security Undo Log',
    icon: '🔐',
    summary: 'A history of all security rule changes with an "undo" button.',
    whatIsIt: 'Imagine you\'re editing a document and you accidentally delete something important — you press Ctrl+Z to undo it. This tool does the same thing for security rules. Every time someone changes a firewall rule or login setting, it gets recorded here. If something breaks, you can instantly undo that change with one click.',
    usedFor: [
      'See a clear history of who changed what security rule and when — great for catching mistakes.',
      'Undo a bad change if it accidentally blocked users or caused issues.',
      'Re-apply a change you undid, if you realize the undo was a mistake.',
      'Filter the list to only show specific types of changes — like only Firewall changes or only Login (Auth) changes.'
    ],
    deepDive: 'Every security change is saved like a "save point" in a video game. When you undo, the system goes back to the last save point and restores the old settings automatically.'
  },
  'traffic-queue': {
    title: 'Traffic Limit Queue',
    icon: '⏳',
    summary: 'Watches how many requests each user sends and stops them if they send too many.',
    whatIsIt: 'Imagine a fast food counter — there\'s a limit to how many orders they can take at once. If someone tries to order 1000 burgers at once, they\'d get told to slow down! This tool does the same for websites. Each customer/user has a request limit per minute. If they go over it, they get slowed down (throttled) or blocked.',
    usedFor: [
      'Watch live traffic — see exactly how many requests each customer is sending right now.',
      'Spot suspicious activity — if someone is sending way too many requests, it might be a bot attack.',
      'Check how much of their limit each customer has used (the progress bar shows this clearly).',
      'Pause the live view to take a closer look at a snapshot of traffic without the numbers constantly changing.'
    ],
    deepDive: 'It\'s like a speed limit on a highway. If you drive normally — no problem. If you go too fast, you get a warning (throttled = slowed down). If you keep going too fast, you get pulled over (blocked = requests rejected).'
  },
  'server-checker': {
    title: 'Server ID Checker',
    icon: '🔍',
    summary: 'Look up any server by its ID or IP address to see if it\'s healthy.',
    whatIsIt: 'Think of this like a hospital patient lookup system. You type in a server\'s name or address, and it instantly shows you its "health report" — is it running fine? Is it overloaded? When was it last active? Every server has a unique ID (like srv-a1b2c3) and you can search for it here.',
    usedFor: [
      'Quickly check if a specific server is online and running well.',
      'See details like which region it\'s in, how long it\'s been running (uptime), and its last check-in time (heartbeat).',
      'Spot if a server is using too much CPU (processing power) or memory (RAM) — shown as easy-to-read progress bars.',
      'Use the quick suggestion buttons to instantly look up any server without typing.'
    ],
    deepDive: 'Each server sends a "I\'m alive!" signal every few seconds — called a heartbeat. If a server stops sending heartbeats, it gets flagged as a problem. This tool lets you quickly check those signals.'
  },
  'data-sorter': {
    title: 'Data Usage Sorter',
    icon: '📊',
    summary: 'Ranks all customers by how much data they\'ve downloaded/used.',
    whatIsIt: 'Like a mobile data usage screen on your phone, but for all your business customers at once. It shows you who is downloading the most data, who the least, and lets you sort and filter by plan type (Platinum, Gold, Silver, Bronze, Free). The one using the most data is at the top.',
    usedFor: [
      'Quickly see which customers are using the most bandwidth — the biggest data consumers.',
      'Filter by plan type — e.g., only show "Gold" plan customers to see how they compare.',
      'Sort the list from most to least data usage (or flip it to least to most) with one click.',
      'See the Upload vs Download ratio — if someone downloads a lot more than they upload, you can spot that here.'
    ],
    deepDive: '"Egress" just means data going OUT (downloads from the server to the user). "Ingress" means data coming IN (uploads from user to the server). A high download-to-upload ratio means the user mostly consumes content rather than creating it.'
  },
  'network-hub': {
    title: 'Network Link Hub',
    icon: '🛰️',
    summary: 'A live map showing all your servers and how they\'re connected.',
    whatIsIt: 'Picture a subway map, but instead of train stations, it shows your servers (nodes), and instead of train lines, it shows the connections between them (links). You can click on any server or connection line to see details about it. The small moving dots on the lines represent real data traveling between servers!',
    usedFor: [
      'See at a glance which servers are connected to which — like a visual wiring diagram.',
      'Click on a connection line to see how fast it is (latency in ms) and how much data it can carry (bandwidth).',
      'Turn off a connection line to simulate "what happens if this connection fails?" — useful for testing.',
      'Turn a connection back on to restore the normal path.'
    ],
    deepDive: 'When you disable a link (connection line), the system automatically finds a different path to route data — just like how Google Maps finds an alternate route when a road is closed. You can see the new route in the Fastest Path Finder tool.'
  },
  'path-finder': {
    title: 'Fastest Path Finder',
    icon: '🔀',
    summary: 'Finds the quickest route between two servers, like GPS for your network.',
    whatIsIt: 'This works exactly like Google Maps — you pick a starting server and a destination server, and it automatically calculates the fastest route between them. It uses a famous algorithm called Dijkstra\'s (the same concept used in real GPS systems!) to find the path with the lowest delay (latency). The step-by-step log on the right shows exactly how it makes its decision.',
    usedFor: [
      'Find the fastest route between any two servers in your network.',
      'See the minimum possible delay (in milliseconds) for that route.',
      'Read the step-by-step calculation log to understand HOW it found the best path.',
      'Visually see the chosen route highlighted on the mini network map.'
    ],
    deepDive: 'Dijkstra\'s Algorithm works like this: start at your source, explore all nearby servers, always pick the one with the shortest total travel time so far, keep going until you reach the destination. It\'s guaranteed to always find the absolutely fastest route!'
  },
  'balancer': {
    title: 'Traffic Balancer',
    icon: '⚖️',
    summary: 'Spreads incoming requests fairly across all servers so no single server gets overwhelmed.',
    whatIsIt: 'Imagine a cashier manager at a supermarket. When new customers arrive, the manager directs them to the shortest queue. This tool does the same for server requests — when a new request comes in, it decides which server should handle it. You can switch between two strategies: "Least Connections" (send to the least busy server) or "Round Robin" (take turns sending to each server).',
    usedFor: [
      'See live requests being routed to servers in real-time — the animation shows this happening.',
      'Switch between "Least Connections" and "Round Robin" to see how each strategy performs.',
      'Monitor each server\'s current load (busy-ness percentage) — red means overloaded, green means fine.',
      'Check the "Load Deviation" number — a small number means the load is evenly spread (good!), a big number means one server is doing most of the work (bad!).'
    ],
    deepDive: '"Least Connections" is smarter — it always sends new requests to whichever server is currently doing the least work. "Round Robin" is simpler — it just takes turns regardless of how busy each server is, which can sometimes overload one server while others are idle.'
  },

  // --- Sub-topics & Stat card explanations ---
  'total-routes': {
    title: 'Total Routes',
    icon: '📊',
    summary: 'How many URL paths your website/API has registered.',
    whatIsIt: 'This number tells you how many different web addresses (paths) your application has set up. For example, /login, /dashboard, /api/users each count as one route. This is the total count of all of them.',
    usedFor: [
      'Check how "big" your API is — more routes usually means more features.',
      'Verify that a newly added page or API endpoint actually got registered correctly.'
    ]
  },
  'namespaces': {
    title: 'Namespaces (API Groups)',
    icon: '🏷️',
    summary: 'How many main groups or sections your API is divided into.',
    whatIsIt: 'Think of namespaces like chapters in a book. Instead of one giant list of all routes, they\'re organized into groups like "v1 API", "v2 API", "Auth routes", "User routes", etc. This number tells you how many top-level groups exist.',
    usedFor: [
      'See how well-organized your API is — more groups usually means better structure.',
      'Quickly understand the overall layout of your application.'
    ]
  },
  'avg-latency': {
    title: 'Average Response Speed',
    icon: '⏱️',
    summary: 'How fast your server replies on average, in milliseconds.',
    whatIsIt: 'Latency is the time delay between asking for something and getting the answer. Like the time between pressing "search" on Google and seeing results. Measured in milliseconds (ms). 14ms is very fast — you\'d need 1000ms to equal 1 second. Lower is always better!',
    usedFor: [
      'Quickly tell if your server is fast or slow — anything under 100ms is generally great.',
      'Spot if speed is getting worse over time — a rising average means something might be wrong.'
    ]
  },
  'total-changes': {
    title: 'Total Security Changes Today',
    icon: '📝',
    summary: 'How many times security settings were changed today.',
    whatIsIt: 'Every time an admin changes a firewall rule, blocks an IP, or updates a login setting — it counts as one change. This number shows how many total changes happened today. Think of it like a "number of edits" counter for your security settings.',
    usedFor: [
      'Know how active your team has been in managing security today.',
      'If this number is unexpectedly high, someone might be making a lot of changes — worth checking!'
    ]
  },
  'reverted-changes': {
    title: 'Undone Changes',
    icon: '↩️',
    summary: 'How many security changes were rolled back (undone).',
    whatIsIt: 'When an admin makes a change but then realizes it was wrong, they can "undo" it — this is called reverting. This counter shows how many times that happened. Like the number of times Ctrl+Z was pressed today.',
    usedFor: [
      'See how many mistakes were caught and corrected.',
      'A high revert count might mean your team is making changes without enough testing first.'
    ]
  },
  'active-policies': {
    title: 'Active Security Rules',
    icon: '🛡️',
    summary: 'How many security rules are currently turned ON and protecting your system.',
    whatIsIt: 'Security policies are rules that protect your system — like "block all traffic from country X", "require login for this page", "limit to 100 requests per minute". This number shows how many of those rules are currently active and being enforced.',
    usedFor: [
      'Quickly check how well-protected your system is right now.',
      'Cross-check that all expected rules are active after changes.'
    ]
  },
  'egress-load': {
    title: 'Current Traffic Volume',
    icon: '📈',
    summary: 'Total number of requests handled in the last 60 seconds.',
    whatIsIt: 'This is a live counter of how much traffic is flowing through your gateway right now. Think of it like a car counter on a highway — it counts every car that passes in the last 60 seconds. In our case, it counts every request instead of cars.',
    usedFor: [
      'See if your system is currently busy or quiet.',
      'Spot sudden traffic spikes — a sudden jump could mean a popular post went viral, or a bot attack is happening.'
    ]
  },
  'aggregated-limit': {
    title: 'Total Allowed Capacity',
    icon: '🏁',
    summary: 'The maximum total requests all your customers are allowed to send.',
    whatIsIt: 'Each customer has a limit on how many requests they can send per minute. This number is the sum of ALL those limits added together. It represents the maximum traffic your gateway is expected to handle if every customer uses their full allowance at the same time.',
    usedFor: [
      'Understand the total theoretical maximum your system needs to handle.',
      'Use for planning — if this number keeps growing, you might need more server capacity soon.'
    ]
  },
  'policy-violations': {
    title: 'Limit Violations (Blocked/Slowed)',
    icon: '⚠️',
    summary: 'How many customers are currently sending too many requests.',
    whatIsIt: 'When a customer sends more requests than their allowed limit, they get a "violation". This number shows how many customers are currently over their limit — either being slowed down (throttled) or completely blocked. Think of it like people getting a speeding ticket on the highway.',
    usedFor: [
      'Immediately see if any customers are abusing the system right now.',
      'A high number could indicate a bot attack or a poorly-written app making too many requests.'
    ]
  },
  'active-nodes': {
    title: 'Online Servers',
    icon: '🟢',
    summary: 'How many servers are currently healthy and working.',
    whatIsIt: 'This is the count of servers that are currently online, responding normally, and accepting traffic. Like checking how many cash registers at a store are open and serving customers. Green and healthy!',
    usedFor: [
      'Quickly confirm all your servers are up and running.',
      'If this number drops unexpectedly, some servers may have crashed or gone offline.'
    ]
  },
  'alert-flags': {
    title: 'Problem Servers',
    icon: '🟠',
    summary: 'Servers that are having issues and need attention.',
    whatIsIt: 'These are servers that aren\'t completely broken, but are showing warning signs — like running too hot, using too much memory, or responding slowly. Think of it like a "check engine" light in your car — something needs a look, even if it\'s not broken yet.',
    usedFor: [
      'Know immediately if any server needs human attention before it completely fails.',
      'Prioritize which servers to investigate first.'
    ]
  },
  'total-servers': {
    title: 'Total Servers in System',
    icon: '🖥️',
    summary: 'The total count of all servers, including healthy, warning, and offline ones.',
    whatIsIt: 'This is the full inventory of every server registered in the system — whether they\'re working fine, having problems, or completely offline. Like counting all the cars in a parking lot — running, broken, and everything in between.',
    usedFor: [
      'Know the full size of your server fleet.',
      'Compare with "Online Servers" to see if any are missing or offline.'
    ]
  },
  'total-egress': {
    title: 'Total Data Sent Out',
    icon: '💾',
    summary: 'How much data your servers have sent to all customers combined.',
    whatIsIt: '"Egress" is just a fancy word for data going OUT — like when you download a file or watch a video, that\'s egress from the server\'s perspective. This number (in Terabytes) shows the total amount of data your servers have sent to all customers combined. 1 TB = 1,000 GB.',
    usedFor: [
      'Track how much bandwidth your system is consuming — this often directly affects your cloud hosting bill.',
      'See if data usage is trending up (more popular) or down over time.'
    ]
  },
  'peak-consumer': {
    title: 'Biggest Data User',
    icon: '👑',
    summary: 'The customer who has downloaded the most data.',
    whatIsIt: 'Out of all your customers, this is the one who has used the most download bandwidth. Like the heaviest data user on a shared WiFi network — they\'re downloading the most.',
    usedFor: [
      'Identify your heaviest users — they might need a higher-tier plan.',
      'Check if one user is consuming an unusually large share of your total bandwidth.'
    ]
  },
  'avg-egress': {
    title: 'Average Data Per Customer',
    icon: '⚖️',
    summary: 'How much data a typical customer uses on average.',
    whatIsIt: 'Add up all the data used by every customer, then divide by the number of customers — that gives you the average. This helps you understand what a "normal" customer looks like in terms of data usage.',
    usedFor: [
      'Set fair pricing tiers based on what typical customers actually use.',
      'Compare any single customer against the average to see if they\'re a light or heavy user.'
    ]
  },
  'active-links': {
    title: 'Active Connections',
    icon: '🔗',
    summary: 'How many server-to-server connections are currently working.',
    whatIsIt: 'In your network map, servers are connected to each other by "links" (like roads between cities). This shows how many of those links are currently active and working vs. the total number of possible links. For example, "5 / 7" means 5 out of 7 links are currently online.',
    usedFor: [
      'Quickly see if any connections between servers are down.',
      'Ensure you have enough redundant paths — if too many links are down, your network has no backup routes.'
    ]
  },
  'avg-link-latency': {
    title: 'Average Connection Speed',
    icon: '⚡',
    summary: 'How fast data travels between servers on average, in milliseconds.',
    whatIsIt: 'When data travels from one server to another, there\'s a tiny delay — like the ping in an online game. This is the average of that delay across all active connections. Lower is better! Under 50ms is generally excellent for server-to-server communication.',
    usedFor: [
      'Tell if your overall network is fast or slow between servers.',
      'A rising average might mean network congestion or a failing connection.'
    ]
  },
  'region-clusters': {
    title: 'Server Locations',
    icon: '🗺️',
    summary: 'How many different physical locations your servers are in.',
    whatIsIt: 'Your servers might be spread across different cities or countries — New York, London, Singapore, etc. Each location is a "region cluster". Having servers in multiple regions means users get faster service because they connect to the nearest server.',
    usedFor: [
      'See how geographically spread out your infrastructure is.',
      'More regions = faster service for global users, but also more complexity to manage.'
    ]
  },
  'source-node': {
    title: 'Starting Server',
    icon: '🛫',
    summary: 'Where the data journey begins — the "from" server.',
    whatIsIt: 'This is the server you selected as the starting point for the path calculation. Think of it as "where you are" when using GPS navigation. The algorithm will find the fastest route FROM this server to the destination server.',
    usedFor: [
      'Choose your starting server to see the best route to any other server from that point.'
    ]
  },
  'destination-node': {
    title: 'Destination Server',
    icon: '🛬',
    summary: 'Where the data is trying to reach — the "to" server.',
    whatIsIt: 'This is the target server — the endpoint where data needs to arrive. Like entering a destination in GPS. The algorithm finds the fastest way to get data from the source server TO this destination server.',
    usedFor: [
      'Choose your target server to find the optimal route leading to it.'
    ]
  },
  'min-latency': {
    title: 'Fastest Possible Speed',
    icon: '⚡',
    summary: 'The minimum delay to get data from source to destination.',
    whatIsIt: 'After calculating all possible routes, this is the lowest possible delay (in milliseconds) between your chosen source and destination servers. It\'s the theoretical "best case" speed — the fastest your data can travel through the network taking the optimal path.',
    usedFor: [
      'Know the baseline performance between two servers.',
      'If actual speeds are much slower than this number, something in the network is not working optimally.'
    ]
  },
  'total-handled': {
    title: 'Requests Handled',
    icon: '📥',
    summary: 'Total number of requests the load balancer has processed.',
    whatIsIt: 'Every time a user makes a request (like loading a page or calling an API), the load balancer handles it by deciding which server should respond. This counter shows how many total requests have been handled since the session started. It keeps going up as new requests come in!',
    usedFor: [
      'Track how busy your load balancer has been.',
      'See the rate at which requests are coming in — if this number climbs fast, traffic is high.'
    ]
  },
  'average-cluster-load': {
    title: 'Average Server Busyness',
    icon: '💻',
    summary: 'How busy all your servers are on average, shown as a percentage.',
    whatIsIt: 'Each server has a "load" — how busy it is right now, from 0% (idle) to 100% (completely maxed out). This is the average load across ALL your servers. Like averaging out how full all the gas stations in a city are. 50% means on average, servers are half-busy.',
    usedFor: [
      'Get a quick feel for overall system health — high average load means the system is under pressure.',
      'If this stays above 80% consistently, you probably need more servers.'
    ]
  },
  'load-deviation': {
    title: 'Load Balance Quality',
    icon: '📉',
    summary: 'How evenly spread the work is across all servers.',
    whatIsIt: 'This measures how well the load balancer is distributing work. If one server is at 90% and another is at 10%, that\'s a huge imbalance (deviation = 80%). If all servers are around 50%, that\'s perfect balance (deviation = small). Lower deviation = better balancing!',
    usedFor: [
      'Judge how effective your chosen load balancing algorithm is.',
      'A high deviation means one server is doing most of the work while others are sitting idle — not efficient!'
    ]
  },
  'cpu-utilization': {
    title: 'CPU Usage',
    icon: '⚙️',
    summary: 'How much of the server\'s processor is being used right now.',
    whatIsIt: 'The CPU (processor) is the brain of a server. When it\'s at 0%, it\'s just sitting there doing nothing. At 100%, it\'s working as fast as it possibly can and might start slowing down or dropping requests. Think of it like how tired you get when you\'re multitasking too many things at once.',
    usedFor: [
      'Check if a server is under too much computational strain.',
      'Anything above 85% is a warning sign — the server might struggle to keep up with requests.'
    ]
  },
  'mem-allocation': {
    title: 'Memory Usage (RAM)',
    icon: '🧠',
    summary: 'How much of the server\'s memory is being used right now.',
    whatIsIt: 'RAM (memory) is like the server\'s short-term workspace — the more apps and requests it\'s handling simultaneously, the more memory it uses. When memory fills up, the server slows dramatically or crashes. Like having too many browser tabs open — your computer starts struggling.',
    usedFor: [
      'Spot if a server is running low on memory — might need a restart or more RAM.',
      'Memory above 85% is a red flag — the server could crash or become very slow soon.'
    ]
  },
  'optimal-pipeline': {
    title: 'Optimal Route',
    icon: '🛣️',
    summary: 'The exact step-by-step path the data takes from source to destination.',
    whatIsIt: 'After the algorithm calculates the fastest route, this shows the actual sequence of servers the data travels through — like turn-by-turn GPS directions. For example: Server A → Server C → Server E means data goes through 3 servers to get to its destination.',
    usedFor: [
      'See exactly which intermediate servers your data passes through.',
      'Understand why the system chose this particular route over others.'
    ]
  },
  'dijkstra-trace': {
    title: 'Algorithm Step Log',
    icon: '🔬',
    summary: 'A step-by-step log of how the algorithm found the fastest path.',
    whatIsIt: 'This is like showing your work in a math exam — it logs every decision the Dijkstra algorithm made as it searched for the fastest route. Each line explains: which server it checked, what the current best distance to that server was, and whether it found a shorter path. It\'s super useful for learning how the algorithm works!',
    usedFor: [
      'Understand HOW the algorithm made its decisions, step by step.',
      'Educational — great for learning about graph algorithms in a real, visual context.',
      'Debug unusual route choices — the log reveals exactly why one path was chosen over another.'
    ]
  }
};
