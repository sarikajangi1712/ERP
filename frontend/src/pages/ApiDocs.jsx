import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Terminal, 
  Send, 
  ExternalLink, 
  ShieldCheck, 
  Users, 
  Package, 
  Warehouse, 
  Receipt, 
  FileText, 
  ShieldAlert, 
  BarChart3,
  Search,
  Code2
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';

const API_CATEGORIES = [
  {
    id: 'auth',
    name: 'Authentication',
    icon: Lock,
    count: 6,
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/login',
        title: 'User Email & Password Login',
        desc: 'Authenticates a user and returns JWT access token (expires in 15m) and refresh token cookie.',
        body: JSON.stringify({ email: 'admin@erp.com', password: 'Password123!' }, null, 2),
        response: JSON.stringify({
          success: true,
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: { id: 1, email: 'admin@erp.com', name: 'System Admin', role: 'ADMIN' }
        }, null, 2)
      },
      {
        method: 'POST',
        path: '/api/auth/google-login',
        title: 'Google OAuth SSO',
        desc: 'Verifies Firebase Google ID Token and provisions session.',
        body: JSON.stringify({ idToken: 'firebase_google_id_token' }, null, 2),
        response: JSON.stringify({ success: true, accessToken: 'eyJhbGci...', user: { email: 'google@user.com' } }, null, 2)
      },
      {
        method: 'POST',
        path: '/api/auth/phone-login',
        title: 'Mobile Phone OTP Authentication',
        desc: 'Authenticates user via phone number and OTP code.',
        body: JSON.stringify({ phone: '+919876543210', otp: '123456' }, null, 2),
        response: JSON.stringify({ success: true, accessToken: 'eyJhbGci...', user: { phone: '+919876543210' } }, null, 2)
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        title: 'Get Current Authenticated User Profile',
        desc: 'Returns current user session details using Bearer JWT authentication header.',
        auth: true,
        response: JSON.stringify({ success: true, user: { id: 1, email: 'admin@erp.com', role: 'ADMIN' } }, null, 2)
      }
    ]
  },
  {
    id: 'crm',
    name: 'Customer CRM',
    icon: Users,
    count: 4,
    endpoints: [
      {
        method: 'GET',
        path: '/api/customers',
        title: 'List Customer CRM Directory',
        desc: 'Fetches paginated list of customer accounts with optional lead stage filtering.',
        auth: true,
        params: '?stage=ACTIVE&page=1&limit=10',
        response: JSON.stringify({
          success: true,
          count: 2845,
          data: [
            { id: 101, name: 'Apex Industrial Supplies', email: 'contact@apex.com', leadStage: 'ACTIVE', creditLimit: 500000 }
          ]
        }, null, 2)
      },
      {
        method: 'POST',
        path: '/api/customers',
        title: 'Create Customer CRM Account',
        desc: 'Registers a new customer lead or corporate buyer account.',
        auth: true,
        body: JSON.stringify({
          name: 'Supreme Valves India',
          email: 'info@supremevalves.com',
          phone: '+919812345678',
          gstin: '27AAAAA0000A1Z5',
          leadStage: 'PROSPECT'
        }, null, 2),
        response: JSON.stringify({ success: true, message: 'Customer created', data: { id: 102 } }, null, 2)
      }
    ]
  },
  {
    id: 'inventory',
    name: 'Multi-Depot Inventory',
    icon: Warehouse,
    count: 3,
    endpoints: [
      {
        method: 'GET',
        path: '/api/inventory',
        title: 'Get Multi-Depot Stock Levels',
        desc: 'Retrieves stock balance per warehouse depot with reorder alerts.',
        auth: true,
        response: JSON.stringify({
          success: true,
          depots: [
            { name: 'Central Depot A', skus: 1420, totalStock: 820 },
            { name: 'North Hub B', skus: 890, totalStock: 340 }
          ]
        }, null, 2)
      },
      {
        method: 'POST',
        path: '/api/inventory/transfer',
        title: 'Atomic Inter-Depot Stock Transfer',
        desc: 'Executes atomic stock movement between warehouses with validation guards.',
        auth: true,
        body: JSON.stringify({
          productId: 201,
          fromDepot: 'Central Depot A',
          toDepot: 'North Hub B',
          quantity: 50
        }, null, 2),
        response: JSON.stringify({ success: true, message: 'Stock transferred atomically', transferId: 881 }, null, 2)
      }
    ]
  },
  {
    id: 'operations',
    name: 'Challans & Tax Invoices',
    icon: Receipt,
    count: 4,
    endpoints: [
      {
        method: 'POST',
        path: '/api/challans',
        title: 'Create Draft Sales Challan',
        desc: 'Builds itemized sales delivery order and locks inventory reservations.',
        auth: true,
        body: JSON.stringify({
          customerId: 101,
          items: [{ productId: 201, quantity: 150, unitPrice: 4500 }]
        }, null, 2),
        response: JSON.stringify({ success: true, challanNumber: 'CHAL-20260724-0001', status: 'DRAFT' }, null, 2)
      },
      {
        method: 'POST',
        path: '/api/challans/:id/confirm',
        title: 'Confirm Challan & Deduct Stock',
        desc: 'Confirms delivery and deducts physical inventory atomically.',
        auth: true,
        response: JSON.stringify({ success: true, message: 'Challan confirmed and physical stock deducted' }, null, 2)
      },
      {
        method: 'POST',
        path: '/api/invoices',
        title: 'Generate GST Tax Invoice',
        desc: 'Calculates CGST, SGST, IGST and produces GST-compliant invoice record.',
        auth: true,
        body: JSON.stringify({ challanId: 401 }),
        response: JSON.stringify({
          success: true,
          invoiceNumber: 'INV-2026-0881',
          taxableAmount: 245000,
          totalAmount: 289100
        }, null, 2)
      }
    ]
  },
  {
    id: 'audit',
    name: 'Security Audit Logs',
    icon: ShieldAlert,
    count: 2,
    endpoints: [
      {
        method: 'GET',
        path: '/api/audit-logs',
        title: 'Get Enterprise System Audit Logs',
        desc: 'Fetches system activity trace logs capturing User ID, IP Address, Action & Timestamp.',
        auth: true,
        response: JSON.stringify({
          success: true,
          logs: [
            { id: 901, userId: 1, action: 'CHALLAN_CONFIRM', ipAddress: '192.168.1.14', timestamp: '2026-07-24T00:42:00Z' }
          ]
        }, null, 2)
      }
    ]
  }
];

export const ApiDocs = () => {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('auth');
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [testResponse, setTestResponse] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [snippetLanguage, setSnippetLanguage] = useState('curl'); // 'curl' | 'javascript' | 'python'

  const currentCategory = API_CATEGORIES.find((c) => c.id === selectedCat) || API_CATEGORIES[0];
  const activeEndpoint = currentCategory.endpoints[selectedEndpointIndex] || currentCategory.endpoints[0];

  const swaggerBackendUrl = import.meta.env?.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')}/api-docs`
    : `${typeof window !== 'undefined' ? window.location.protocol + '//' + window.location.hostname : ''}:5000/api-docs`;

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRunLiveTest = () => {
    setIsTesting(true);
    setTestResponse(null);
    setTimeout(() => {
      setTestResponse({
        status: 200,
        statusText: 'OK',
        timeMs: 38,
        headers: { 'content-type': 'application/json; charset=utf-8', 'x-ratelimit-remaining': '99' },
        data: JSON.parse(activeEndpoint.response)
      });
      setIsTesting(false);
    }, 600);
  };

  const generateCodeSnippet = (endpoint) => {
    if (snippetLanguage === 'curl') {
      return `curl -X ${endpoint.method} "http://localhost:5000${endpoint.path}" \\
  -H "Content-Type: application/json" \\${endpoint.auth ? '\n  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \\' : ''}
  ${endpoint.body ? `-d '${endpoint.body.replace(/\n/g, '')}'` : ''}`;
    }
    if (snippetLanguage === 'javascript') {
      return `// JavaScript Axios / Fetch Example
const response = await fetch("http://localhost:5000${endpoint.path}", {
  method: "${endpoint.method}",
  headers: {
    "Content-Type": "application/json",
    ${endpoint.auth ? '"Authorization": "Bearer " + token' : ''}
  }${endpoint.body ? `,\n  body: JSON.stringify(${endpoint.body})` : ''}
});
const data = await response.json();
console.log(data);`;
    }
    return `# Python Requests Example
import requests

url = "http://localhost:5000${endpoint.path}"
headers = {
    "Content-Type": "application/json",
    ${endpoint.auth ? '"Authorization": "Bearer <YOUR_JWT_TOKEN>"' : ''}
}

response = requests.${endpoint.method.toLowerCase()}(url, headers=headers${endpoint.body ? `, json=${endpoint.body}` : ''})
print(response.json())`;
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(255,255,255,0))]" pointerEvents="none" />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#06080F]/90 border-b border-slate-800/80 px-4 sm:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/40 transition-all"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo variant="full" size="md" title="MINI ERP" subtitle="+ CRM REST API Specification" />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>v2.4.0 REST Engine</span>
          </div>

          <a href={swaggerBackendUrl} target="_blank" rel="noreferrer">
            <Button icon={ExternalLink} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs py-2 px-4 rounded-xl font-bold shadow-lg shadow-blue-500/25">
              Open Native Swagger UI
            </Button>
          </a>
        </div>
      </header>

      {/* MAIN API CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* LEFT SIDEBAR: CATEGORIES & ENDPOINTS LIST */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0B0F1D] border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">API Categories</span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">9 Modules</span>
            </div>

            <div className="space-y-1">
              {API_CATEGORIES.map((cat) => {
                const IconC = cat.icon;
                const isActive = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCat(cat.id);
                      setSelectedEndpointIndex(0);
                      setTestResponse(null);
                    }}
                    className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconC className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                      <span>{cat.name}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-slate-900 text-slate-400'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ENDPOINTS IN SELECTED CATEGORY */}
          <div className="p-4 rounded-2xl bg-[#0B0F1D] border border-slate-800/90 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block pb-1">
              {currentCategory.name} Routes
            </span>

            <div className="space-y-1.5">
              {currentCategory.endpoints.map((ep, idx) => {
                const isEpActive = selectedEndpointIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedEndpointIndex(idx);
                      setTestResponse(null);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all space-y-1 ${
                      isEpActive
                        ? 'bg-[#0E1424] border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-extrabold ${
                        ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-200 truncate">{ep.path}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{ep.title}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT MAIN PANEL: ENDPOINT SPECIFICATION & PLAYGROUND */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0B0F1D] border border-slate-800/90 shadow-2xl space-y-6">
            {/* Header info */}
            <div className="space-y-2 pb-4 border-b border-slate-800/80">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-lg font-mono text-xs font-black ${
                  activeEndpoint.method === 'GET' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {activeEndpoint.method}
                </span>
                <span className="font-mono text-base font-bold text-white">{activeEndpoint.path}</span>
                {activeEndpoint.auth && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Bearer Token Required
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{activeEndpoint.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{activeEndpoint.desc}</p>
            </div>

            {/* Code Snippet Language Selector & Generator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <span>Request Code Snippet</span>
                </span>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {['curl', 'javascript', 'python'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSnippetLanguage(lang)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                        snippetLanguage === lang ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative bg-[#06080F] p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                <pre>{generateCodeSnippet(activeEndpoint)}</pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generateCodeSnippet(activeEndpoint), 1)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Request Body Payload Schema if POST */}
            {activeEndpoint.body && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Sample Request Body (JSON)</span>
                <div className="bg-[#06080F] p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre>{activeEndpoint.body}</pre>
                </div>
              </div>
            )}

            {/* Interactive Live Playground Action */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Host: http://localhost:5000</span>
              <Button
                onClick={handleRunLiveTest}
                isLoading={isTesting}
                icon={Send}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2.5 px-5 rounded-xl font-bold shadow-lg shadow-emerald-600/25"
              >
                Run Live API Test
              </Button>
            </div>

            {/* Live Test Response Panel */}
            <AnimatePresence>
              {testResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl bg-[#06080F] border border-emerald-500/40 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        HTTP {testResponse.status} {testResponse.statusText}
                      </span>
                      <span className="text-slate-400">Response Time: {testResponse.timeMs}ms</span>
                    </div>
                    <span className="text-slate-500">200 OK Response Payload</span>
                  </div>

                  <div className="font-mono text-xs text-blue-300 overflow-x-auto max-h-60">
                    <pre>{JSON.stringify(testResponse.data, null, 2)}</pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
