// Mock data for the entire application

// ─── URL Routes ─────────────────────────────────────────────────────────────
export const routeTree = [
  {
    id: 'r1', path: '/api/v1', label: 'API v1', children: [
      { id: 'r1a', path: '/api/v1/auth', label: 'auth', method: 'POST', latency: '12ms', desc: 'Authenticate user credentials' },
      {
        id: 'r1b', path: '/api/v1/users', label: 'users', children: [
          { id: 'r1b1', path: '/api/v1/users', label: '{userId}', method: 'GET', latency: '8ms', desc: 'Fetch user profile' },
          { id: 'r1b2', path: '/api/v1/users/create', label: 'create', method: 'POST', latency: '24ms', desc: 'Create new user account' },
          { id: 'r1b3', path: '/api/v1/users/update', label: 'update', method: 'PUT', latency: '18ms', desc: 'Update user data' },
          { id: 'r1b4', path: '/api/v1/users/delete', label: 'delete', method: 'DELETE', latency: '15ms', desc: 'Remove user account' },
        ]
      },
      {
        id: 'r1c', path: '/api/v1/traffic', label: 'traffic', children: [
          { id: 'r1c1', path: '/api/v1/traffic/stats', label: 'stats', method: 'GET', latency: '6ms', desc: 'Real-time traffic metrics' },
          { id: 'r1c2', path: '/api/v1/traffic/limit', label: 'limit', method: 'PATCH', latency: '10ms', desc: 'Modify rate limits' },
        ]
      },
      {
        id: 'r1d', path: '/api/v1/containers', label: 'containers', children: [
          { id: 'r1d1', path: '/api/v1/containers/list', label: 'list', method: 'GET', latency: '9ms', desc: 'List all active containers' },
          { id: 'r1d2', path: '/api/v1/containers/deploy', label: 'deploy', method: 'POST', latency: '320ms', desc: 'Deploy new container instance' },
          { id: 'r1d3', path: '/api/v1/containers/scale', label: 'scale', method: 'PUT', latency: '45ms', desc: 'Scale container instances' },
        ]
      },
    ]
  },
  {
    id: 'r2', path: '/api/v2', label: 'API v2', children: [
      {
        id: 'r2a', path: '/api/v2/gateway', label: 'gateway', children: [
          { id: 'r2a1', path: '/api/v2/gateway/routes', label: 'routes', method: 'GET', latency: '11ms', desc: 'List all registered routes' },
          { id: 'r2a2', path: '/api/v2/gateway/policies', label: 'policies', method: 'POST', latency: '28ms', desc: 'Apply security policies' },
          { id: 'r2a3', path: '/api/v2/gateway/healthcheck', label: 'healthcheck', method: 'GET', latency: '3ms', desc: 'System health endpoint' },
        ]
      },
      {
        id: 'r2b', path: '/api/v2/network', label: 'network', children: [
          { id: 'r2b1', path: '/api/v2/network/topology', label: 'topology', method: 'GET', latency: '20ms', desc: 'Get network map' },
          { id: 'r2b2', path: '/api/v2/network/path', label: 'path', method: 'POST', latency: '35ms', desc: 'Calculate optimal path' },
        ]
      },
    ]
  },
  {
    id: 'r3', path: '/internal', label: 'Internal', children: [
      { id: 'r3a', path: '/internal/metrics', label: 'metrics', method: 'GET', latency: '4ms', desc: 'Prometheus metrics endpoint' },
      { id: 'r3b', path: '/internal/debug', label: 'debug', method: 'GET', latency: '2ms', desc: 'Debug information endpoint' },
    ]
  },
];

// ─── Security Log ────────────────────────────────────────────────────────────
export const generateSecurityLog = () => [
  { id: 's1', ts: '2026-06-14 12:18:43', user: 'admin@cachenode.io', type: 'FIREWALL', action: 'Added IP block rule', target: '192.168.44.0/24', reverted: false, prev: 'No rule for subnet' },
  { id: 's2', ts: '2026-06-14 12:09:11', user: 'ops@cachenode.io', type: 'RATE_LIMIT', action: 'Changed limit 100→500 rps', target: 'customer-3320', reverted: false, prev: '100 rps' },
  { id: 's3', ts: '2026-06-14 11:55:00', user: 'admin@cachenode.io', type: 'ACL', action: 'Granted read access', target: 'team-alpha', reverted: false, prev: 'No access' },
  { id: 's4', ts: '2026-06-14 11:33:22', user: 'devops@cachenode.io', type: 'AUTH', action: 'Disabled token expiry', target: 'service-account-7', reverted: false, prev: 'Expiry: 1hr' },
  { id: 's5', ts: '2026-06-14 11:01:58', user: 'admin@cachenode.io', type: 'FIREWALL', action: 'Opened port 8443', target: 'edge-gateway-3', reverted: false, prev: 'Port closed' },
  { id: 's6', ts: '2026-06-14 10:44:07', user: 'ops@cachenode.io', type: 'RATE_LIMIT', action: 'Changed limit 200→50 rps', target: 'customer-0091', reverted: false, prev: '200 rps' },
];

// ─── Traffic Limit Queue ─────────────────────────────────────────────────────
export const generateTrafficData = () => [
  { id: 't1', customer: 'Acme Corp', customerId: 'CID-3301', requests: 487, limit: 500, windowSec: 60 },
  { id: 't2', customer: 'NovaTech', customerId: 'CID-8820', requests: 1240, limit: 1000, windowSec: 60 },
  { id: 't3', customer: 'ByteStream Inc', customerId: 'CID-0042', requests: 78, limit: 300, windowSec: 60 },
  { id: 't4', customer: 'CloudBurst Ltd', customerId: 'CID-5591', requests: 300, limit: 300, windowSec: 60 },
  { id: 't5', customer: 'DataPulse', customerId: 'CID-2287', requests: 0, limit: 200, windowSec: 60 },
  { id: 't6', customer: 'SkyNet Services', customerId: 'CID-6612', requests: 890, limit: 750, windowSec: 60 },
  { id: 't7', customer: 'Vertex Systems', customerId: 'CID-9904', requests: 145, limit: 400, windowSec: 60 },
  { id: 't8', customer: 'Orion Analytics', customerId: 'CID-1173', requests: 203, limit: 250, windowSec: 60 },
];

// ─── Servers ─────────────────────────────────────────────────────────────────
export const serverRegistry = [
  { id: 'srv-a1b2c3d4', region: 'us-east-1', type: 'edge-gateway', status: 'active', uptime: '14d 6h 22m', heartbeat: '2s ago', cpu: 34, mem: 58, ip: '10.0.1.12' },
  { id: 'srv-e5f6g7h8', region: 'eu-west-2', type: 'api-gateway', status: 'active', uptime: '7d 14h 01m', heartbeat: '1s ago', cpu: 71, mem: 66, ip: '10.2.0.5' },
  { id: 'srv-i9j0k1l2', region: 'ap-southeast-1', type: 'cache-server', status: 'active', uptime: '3d 2h 55m', heartbeat: '3s ago', cpu: 22, mem: 41, ip: '10.5.3.9' },
  { id: 'srv-m3n4o5p6', region: 'us-west-2', type: 'load-balancer', status: 'inactive', uptime: 'N/A', heartbeat: '5m ago', cpu: 0, mem: 0, ip: '10.1.7.4' },
  { id: 'srv-q7r8s9t0', region: 'eu-central-1', type: 'edge-gateway', status: 'active', uptime: '22d 1h 09m', heartbeat: '2s ago', cpu: 45, mem: 52, ip: '10.3.2.11' },
  { id: 'srv-u1v2w3x4', region: 'ca-central-1', type: 'api-gateway', status: 'warning', uptime: '1d 18h 33m', heartbeat: '12s ago', cpu: 88, mem: 94, ip: '10.6.0.3' },
  { id: 'srv-y5z6a7b8', region: 'sa-east-1', type: 'cache-server', status: 'active', uptime: '5d 9h 17m', heartbeat: '1s ago', cpu: 15, mem: 38, ip: '10.4.1.7' },
];

// ─── Data Usage ───────────────────────────────────────────────────────────────
export const dataUsageAccounts = [
  { id: 'u1', name: 'SkyNet Services', plan: 'Enterprise', egress: 9840, egressUnit: 'GB', ingressRatio: 0.3, tier: 'platinum' },
  { id: 'u2', name: 'NovaTech', plan: 'Business', egress: 7200, egressUnit: 'GB', ingressRatio: 0.45, tier: 'gold' },
  { id: 'u3', name: 'CloudBurst Ltd', plan: 'Enterprise', egress: 5930, egressUnit: 'GB', ingressRatio: 0.5, tier: 'gold' },
  { id: 'u4', name: 'Acme Corp', plan: 'Business', egress: 4120, egressUnit: 'GB', ingressRatio: 0.6, tier: 'silver' },
  { id: 'u5', name: 'DataPulse', plan: 'Startup', egress: 2880, egressUnit: 'GB', ingressRatio: 0.7, tier: 'silver' },
  { id: 'u6', name: 'Vertex Systems', plan: 'Business', egress: 1740, egressUnit: 'GB', ingressRatio: 0.8, tier: 'bronze' },
  { id: 'u7', name: 'Orion Analytics', plan: 'Startup', egress: 920, egressUnit: 'GB', ingressRatio: 0.9, tier: 'bronze' },
  { id: 'u8', name: 'ByteStream Inc', plan: 'Free', egress: 340, egressUnit: 'GB', ingressRatio: 1.2, tier: 'free' },
];

// ─── Network Graph ────────────────────────────────────────────────────────────
export const networkNodes = [
  { id: 'n1', label: 'US-East', x: 180, y: 130, type: 'gateway', status: 'active' },
  { id: 'n2', label: 'US-West', x: 80, y: 230, type: 'gateway', status: 'active' },
  { id: 'n3', label: 'EU-West', x: 310, y: 90, type: 'gateway', status: 'active' },
  { id: 'n4', label: 'EU-Central', x: 390, y: 170, type: 'cache', status: 'active' },
  { id: 'n5', label: 'AP-SE', x: 510, y: 200, type: 'gateway', status: 'active' },
  { id: 'n6', label: 'SA-East', x: 230, y: 310, type: 'cache', status: 'active' },
  { id: 'n7', label: 'CA-Central', x: 130, y: 160, type: 'edge', status: 'warning' },
];

export const networkEdges = [
  { id: 'e1', from: 'n1', to: 'n3', latency: 82, bw: '10Gbps', active: true },
  { id: 'e2', from: 'n1', to: 'n2', latency: 64, bw: '40Gbps', active: true },
  { id: 'e3', from: 'n1', to: 'n7', latency: 14, bw: '100Gbps', active: true },
  { id: 'e4', from: 'n3', to: 'n4', latency: 12, bw: '40Gbps', active: true },
  { id: 'e5', from: 'n4', to: 'n5', latency: 145, bw: '10Gbps', active: true },
  { id: 'e6', from: 'n2', to: 'n6', latency: 110, bw: '10Gbps', active: false },
  { id: 'e7', from: 'n1', to: 'n6', latency: 95, bw: '10Gbps', active: true },
  { id: 'e8', from: 'n7', to: 'n2', latency: 22, bw: '40Gbps', active: true },
  { id: 'e9', from: 'n3', to: 'n5', latency: 180, bw: '5Gbps', active: true },
];

// ─── Containers ───────────────────────────────────────────────────────────────
export const initialContainers = [
  { id: 'c1', name: 'fn-auth-handler', region: 'us-east-1', load: 45, maxLoad: 100, requests: 1240, status: 'active' },
  { id: 'c2', name: 'fn-data-processor', region: 'eu-west-2', load: 78, maxLoad: 100, requests: 3201, status: 'active' },
  { id: 'c3', name: 'fn-cache-service', region: 'ap-se-1', load: 22, maxLoad: 100, requests: 580, status: 'active' },
  { id: 'c4', name: 'fn-image-resize', region: 'us-west-2', load: 91, maxLoad: 100, requests: 4890, status: 'hot' },
  { id: 'c5', name: 'fn-notification', region: 'eu-central-1', load: 12, maxLoad: 100, requests: 302, status: 'active' },
  { id: 'c6', name: 'fn-payment-svc', region: 'ca-central-1', load: 55, maxLoad: 100, requests: 1892, status: 'active' },
];
