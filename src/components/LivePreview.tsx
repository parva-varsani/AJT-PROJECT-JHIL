import { FormEvent, useState } from 'react';

type PageId =
  | 'index'
  | 'products'
  | 'product-details'
  | 'prescription-form'
  | 'my-orders'
  | 'login'
  | 'register'
  | 'customer-dashboard'
  | 'admin-dashboard'
  | 'manage-inventory'
  | 'manage-prescriptions'
  | 'manage-orders'
  | 'billing';

interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface ProductRecord {
  id: number;
  name: string;
  category: string;
  price: number;
  material: string;
  description: string;
}

interface PrescriptionRecord {
  id: number;
  recordCode: string;
  customerName: string;
  rxDate: string;
  rightSph: string;
  rightCyl: string;
  rightAxis: string;
  rightAdd: string;
  leftSph: string;
  leftCyl: string;
  leftAxis: string;
  leftAdd: string;
  status: string;
}

interface OrderRecord {
  id: number;
  orderCode: string;
  customerName: string;
  productName: string;
  quantity: number;
  orderDate: string;
  totalAmount: number;
  status: string;
}

interface InventoryRecord {
  id: number;
  productName: string;
  category: string;
  available: number;
  reorderLevel: number;
}

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  { id: 1, name: 'Customer A', email: 'customer.a@example.com', phone: '9876543210', password: 'customer123' },
  { id: 2, name: 'Customer B', email: 'customer.b@example.com', phone: '9876543211', password: 'customer123' },
  { id: 3, name: 'Customer C', email: 'customer.c@example.com', phone: '9876543212', password: 'customer123' },
];

const INITIAL_PRODUCTS: ProductRecord[] = [
  { id: 1, name: 'Classic Everyday Frame', category: 'Eyeglasses', price: 1850, material: 'Lightweight acetate', description: 'Comfortable frame for everyday use.' },
  { id: 2, name: 'UV protection', category: 'Sunglasses', price: 2400, material: 'Polarized UVA/UVB', description: 'Protective sunglasses with crisp clarity.' },
  { id: 3, name: 'Daily lens pack', category: 'Contact lenses', price: 980, material: 'Comfort & clarity', description: 'Daily disposable contact lenses for all-day hydration.' },
  { id: 4, name: 'Cleaning kit', category: 'Accessories', price: 350, material: 'Anti-fog spray & cloth', description: 'Complete lens cleaning spray and soft cloth.' },
];

const INITIAL_PRESCRIPTIONS: PrescriptionRecord[] = [
  { id: 1, recordCode: 'RX-0021', customerName: 'Customer A', rxDate: '2026-11-02', rightSph: '-1.50', rightCyl: '-0.50', rightAxis: '90', rightAdd: '+1.25', leftSph: '-1.25', leftCyl: '-0.25', leftAxis: '85', leftAdd: '+1.25', status: 'Submitted' },
  { id: 2, recordCode: 'RX-0018', customerName: 'Customer B', rxDate: '2026-10-29', rightSph: '-2.00', rightCyl: '-0.75', rightAxis: '85', rightAdd: '+1.00', leftSph: '-2.00', leftCyl: '-0.50', leftAxis: '95', leftAdd: '+1.00', status: 'Reviewed' },
  { id: 3, recordCode: 'RX-0014', customerName: 'Customer C', rxDate: '2026-10-21', rightSph: '+1.00', rightCyl: '0.00', rightAxis: '0', rightAdd: '+1.50', leftSph: '+1.25', leftCyl: '0.00', leftAxis: '0', leftAdd: '+1.50', status: 'Reviewed' },
];

const INITIAL_ORDERS: OrderRecord[] = [
  { id: 1, orderCode: '#OS-1024', customerName: 'Customer A', productName: 'Classic Everyday Frame', quantity: 1, orderDate: '2026-11-02', totalAmount: 1850, status: 'Processing' },
  { id: 2, orderCode: '#OS-1023', customerName: 'Customer B', productName: 'UV protection', quantity: 1, orderDate: '2026-11-01', totalAmount: 2400, status: 'Confirmed' },
  { id: 3, orderCode: '#OS-1022', customerName: 'Customer C', productName: 'Daily lens pack', quantity: 1, orderDate: '2026-10-31', totalAmount: 980, status: 'Delivered' },
  { id: 4, orderCode: '#OS-1018', customerName: 'Customer A', productName: 'Blue-light glasses', quantity: 1, orderDate: '2026-10-27', totalAmount: 2400, status: 'Delivered' },
  { id: 5, orderCode: '#OS-1009', customerName: 'Customer A', productName: 'Daily lens pack', quantity: 1, orderDate: '2026-10-15', totalAmount: 980, status: 'Delivered' },
];

const INITIAL_INVENTORY: InventoryRecord[] = [
  { id: 1, productName: 'Classic frame', category: 'Eyeglasses', available: 32, reorderLevel: 10 },
  { id: 2, productName: 'UV protection', category: 'Sunglasses', available: 18, reorderLevel: 8 },
  { id: 3, productName: 'Daily lens pack', category: 'Contact lenses', available: 5, reorderLevel: 10 },
  { id: 4, productName: 'Cleaning kit', category: 'Accessories', available: 2, reorderLevel: 6 },
];

const PAGE_LABELS: { id: PageId; label: string }[] = [
  { id: 'index', label: 'index.jsp' },
  { id: 'products', label: 'products.jsp' },
  { id: 'product-details', label: 'product-details.jsp' },
  { id: 'prescription-form', label: 'prescription-form.jsp' },
  { id: 'my-orders', label: 'my-orders.jsp' },
  { id: 'login', label: 'login.jsp' },
  { id: 'register', label: 'register.jsp' },
  { id: 'customer-dashboard', label: 'customer-dashboard.jsp' },
  { id: 'admin-dashboard', label: 'admin-dashboard.jsp' },
  { id: 'manage-inventory', label: 'manage-inventory.jsp' },
  { id: 'manage-prescriptions', label: 'manage-prescriptions.jsp' },
  { id: 'manage-orders', label: 'manage-orders.jsp' },
  { id: 'billing', label: 'billing.jsp' },
];

function ProductIllustration({ category, large }: { category: string; large?: boolean }) {
  const w = large ? 260 : 140;
  const h = large ? 120 : 65;

  if (category === 'Sunglasses') {
    return (
      <svg viewBox="0 0 500 220" width={w} height={h}>
        <line x1="30" y1="95" x2="75" y2="108" stroke="#173347" strokeWidth="15" strokeLinecap="round" />
        <ellipse cx="145" cy="120" rx="65" ry="50" fill="#2d4a5e" stroke="#173347" strokeWidth="16" />
        <path d="M 210 115 Q 222 108 235 115" stroke="#173347" strokeWidth="16" fill="none" strokeLinecap="round" />
        <ellipse cx="300" cy="120" rx="65" ry="50" fill="#2d4a5e" stroke="#173347" strokeWidth="16" />
        <line x1="370" y1="108" x2="415" y2="95" stroke="#173347" strokeWidth="15" strokeLinecap="round" />
      </svg>
    );
  }

  if (category === 'Contact lenses') {
    return (
      <svg viewBox="0 0 500 220" width={w} height={h}>
        <circle cx="160" cy="110" r="50" fill="#e0f2fe" stroke="#0284c7" strokeWidth="8" />
        <circle cx="280" cy="110" r="50" fill="#e0f2fe" stroke="#0284c7" strokeWidth="8" />
      </svg>
    );
  }

  if (category === 'Accessories') {
    return (
      <svg viewBox="0 0 500 220" width={w} height={h}>
        <rect x="150" y="70" width="60" height="90" rx="12" fill="#d1fae5" stroke="#059669" strokeWidth="8" />
        <rect x="230" y="80" width="90" height="80" rx="8" fill="#fde68a" stroke="#d97706" strokeWidth="8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 500 220" width={w} height={h}>
      <line x1="30" y1="95" x2="75" y2="108" stroke="#173347" strokeWidth="15" strokeLinecap="round" />
      <ellipse cx="145" cy="120" rx="65" ry="50" fill="none" stroke="#173347" strokeWidth="16" />
      <path d="M 210 120 L 235 120" stroke="#173347" strokeWidth="16" strokeLinecap="round" />
      <ellipse cx="300" cy="120" rx="65" ry="50" fill="none" stroke="#173347" strokeWidth="16" />
      <line x1="370" y1="108" x2="415" y2="95" stroke="#173347" strokeWidth="15" strokeLinecap="round" />
    </svg>
  );
}

export default function LivePreview() {
  const [page, setPage] = useState<PageId>('index');
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [products] = useState<ProductRecord[]>(INITIAL_PRODUCTS);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(INITIAL_PRESCRIPTIONS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryRecord[]>(INITIAL_INVENTORY);

  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'CUSTOMER' | 'ADMIN' | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(1);
  const [orderQty, setOrderQty] = useState<number>(1);

  const [loginEmail, setLoginEmail] = useState('customer.a@example.com');
  const [loginPassword, setLoginPassword] = useState('customer123');
  const [loginMessage, setLoginMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [rxForm, setRxForm] = useState({
    rightSph: '',
    rightCyl: '',
    rightAxis: '',
    rightAdd: '',
    leftSph: '',
    leftCyl: '',
    leftAxis: '',
    leftAdd: '',
  });
  const [rxSaved, setRxSaved] = useState(false);

  const [showInvForm, setShowInvForm] = useState(false);
  const [invForm, setInvForm] = useState({
    productName: '',
    category: 'Eyeglasses',
    available: '15',
    reorderLevel: '5',
  });
  const [invAdded, setInvAdded] = useState(false);

  const [statusDrafts, setStatusDrafts] = useState<Record<number, string>>({});

  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const activeCustomerName = userName && userRole === 'CUSTOMER' ? userName : 'Customer A';
  const customerOrders = orders.filter((o) => o.customerName === activeCustomerName);
  const customerPrescriptions = prescriptions.filter((r) => r.customerName === activeCustomerName);

  const isAdminPage =
    page === 'admin-dashboard' ||
    page === 'manage-inventory' ||
    page === 'manage-prescriptions' ||
    page === 'manage-orders';

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoginMessage(null);
    if (loginEmail.trim().toLowerCase() === 'admin' && loginPassword === 'admin123') {
      setUserName('Admin');
      setUserRole('ADMIN');
      setPage('admin-dashboard');
      return;
    }
    const found = customers.find(
      (c) => c.email.toLowerCase() === loginEmail.trim().toLowerCase() && c.password === loginPassword
    );
    if (found) {
      setUserName(found.name);
      setUserRole('CUSTOMER');
      setPage('customer-dashboard');
    } else {
      setLoginMessage({ type: 'error', text: 'Invalid email or password. Try again.' });
    }
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    const newCustomer: CustomerRecord = {
      id: customers.length + 1,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
    };
    setCustomers([...customers, newCustomer]);
    setLoginEmail(newCustomer.email);
    setLoginPassword(newCustomer.password);
    setLoginMessage({ type: 'success', text: 'Registration successful. Please sign in.' });
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
    setPage('login');
  };

  const handleLogout = () => {
    setUserName(null);
    setUserRole(null);
    setPage('index');
  };

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    const qty = Math.max(1, orderQty);
    const nextId = orders.length + 1;
    const newOrder: OrderRecord = {
      id: nextId,
      orderCode: `#OS-${1025 + nextId}`,
      customerName: activeCustomerName,
      productName: activeProduct.name,
      quantity: qty,
      orderDate: '2026-11-19',
      totalAmount: activeProduct.price * qty,
      status: 'Processing',
    };
    setOrders([newOrder, ...orders]);
    setSelectedOrderId(nextId);
    setOrderQty(1);
    setPage('billing');
  };

  const handleSavePrescription = (e: FormEvent) => {
    e.preventDefault();
    const nextId = prescriptions.length + 1;
    const newRx: PrescriptionRecord = {
      id: nextId,
      recordCode: `RX-${1000 + nextId * 17}`,
      customerName: activeCustomerName,
      rxDate: '2026-11-19',
      rightSph: rxForm.rightSph || '0.00',
      rightCyl: rxForm.rightCyl || '0.00',
      rightAxis: rxForm.rightAxis || '0',
      rightAdd: rxForm.rightAdd || '0.00',
      leftSph: rxForm.leftSph || '0.00',
      leftCyl: rxForm.leftCyl || '0.00',
      leftAxis: rxForm.leftAxis || '0',
      leftAdd: rxForm.leftAdd || '0.00',
      status: 'Submitted',
    };
    setPrescriptions([newRx, ...prescriptions]);
    setRxForm({
      rightSph: '',
      rightCyl: '',
      rightAxis: '',
      rightAdd: '',
      leftSph: '',
      leftCyl: '',
      leftAxis: '',
      leftAdd: '',
    });
    setRxSaved(true);
  };

  const handleMarkReviewed = (id: number) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === id ? { ...rx, status: 'Reviewed' } : rx))
    );
  };

  const handleUpdateOrderStatus = (id: number, currentStatus: string) => {
    const nextStatus = statusDrafts[id] || currentStatus;
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );
  };

  const handleAddInventory = (e: FormEvent) => {
    e.preventDefault();
    const newItem: InventoryRecord = {
      id: inventory.length + 1,
      productName: invForm.productName.trim(),
      category: invForm.category,
      available: parseInt(invForm.available, 10) || 0,
      reorderLevel: parseInt(invForm.reorderLevel, 10) || 5,
    };
    setInventory([...inventory, newItem]);
    setInvForm({ productName: '', category: 'Eyeglasses', available: '15', reorderLevel: '5' });
    setShowInvForm(false);
    setInvAdded(true);
  };

  const visibleProducts = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  const lowStockCount = inventory.filter((i) => i.available <= i.reorderLevel).length;
  const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col bg-[#f8f6f0]">
      <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">JSP Page Jump:</span>
          <select
            value={page}
            onChange={(e) => {
              setRxSaved(false);
              setInvAdded(false);
              setPage(e.target.value as PageId);
            }}
            className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-700"
          >
            {PAGE_LABELS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-500">
          Interactive simulation of NetBeans JSP + Servlet + MySQL flow
        </div>
      </div>

      <nav className="bg-[#152d3e] text-white px-6 md:px-10 py-3.5 flex items-center justify-between gap-6 shadow-sm">
        <button
          type="button"
          onClick={() => {
            setCategoryFilter('');
            setPage('index');
          }}
          className="flex items-center gap-3 text-left shrink-0 cursor-pointer"
        >
          <span className="bg-[#236d71] text-white font-bold text-base px-2.5 py-1.5 rounded-lg">
            OC
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight">OpticalCare</span>
            <span className="text-[10px] tracking-[0.14em] text-[#9cb5c5] uppercase">
              Store Management
            </span>
          </span>
        </button>

        {isAdminPage ? (
          <div className="flex items-center gap-6 text-sm">
            <button
              type="button"
              onClick={() => setPage('admin-dashboard')}
              className={`whitespace-nowrap cursor-pointer ${page === 'admin-dashboard' ? 'text-white font-semibold' : 'text-[#c9d8e2] hover:text-white'}`}
            >
              Admin Dashboard
            </button>
            <button
              type="button"
              onClick={() => setPage('manage-inventory')}
              className={`whitespace-nowrap cursor-pointer ${page === 'manage-inventory' ? 'text-white font-semibold' : 'text-[#c9d8e2] hover:text-white'}`}
            >
              Inventory
            </button>
            <button
              type="button"
              onClick={() => setPage('manage-prescriptions')}
              className={`whitespace-nowrap cursor-pointer ${page === 'manage-prescriptions' ? 'text-white font-semibold' : 'text-[#c9d8e2] hover:text-white'}`}
            >
              Prescriptions
            </button>
            <button
              type="button"
              onClick={() => setPage('manage-orders')}
              className={`whitespace-nowrap cursor-pointer ${page === 'manage-orders' ? 'text-white font-semibold' : 'text-[#c9d8e2] hover:text-white'}`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => setPage('billing')}
              className="text-[#c9d8e2] hover:text-white whitespace-nowrap cursor-pointer"
            >
              Billing
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-[#fecaca] text-[#7f1d1d] px-4 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6 text-sm">
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('');
                setPage('index');
              }}
              className={`whitespace-nowrap cursor-pointer ${page === 'index' ? 'text-white font-semibold' : 'text-[#c9d8e2] hover:text-white'}`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('');
                setPage('products');
              }}
              className={`whitespace-nowrap cursor-pointer ${page === 'products' || page === 'product-details' ? 'text-white font-semibold' : 'text-[#c9d8e2] hover:text-white'}`}
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => {
                setRxSaved(false);
                setPage('prescription-form');
              }}
              className={`whitespace-nowrap cursor-pointer ${page === 'prescription-form' ? 'text-white font-semibold' : 'text-[#c9d8e2] hover:text-white'}`}
            >
              Prescriptions
            </button>
            <button
              type="button"
              onClick={() => setPage('my-orders')}
              className={`whitespace-nowrap cursor-pointer ${page === 'my-orders' ? 'text-white font-semibold' : 'text-[#c9d8e2] hover:text-white'}`}
            >
              My Orders
            </button>
            {userName ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setPage(userRole === 'ADMIN' ? 'admin-dashboard' : 'customer-dashboard')
                  }
                  className="text-[#c9d8e2] hover:text-white whitespace-nowrap cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-[#fae6b2] text-[#162a36] px-4 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap cursor-pointer"
                >
                  Logout ({userName})
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setLoginMessage(null);
                  setPage('login');
                }}
                className="bg-[#fae6b2] hover:bg-[#ebd498] text-[#162a36] px-5 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-[1120px] w-full mx-auto px-6 py-9 text-[#162a36]">
        {page === 'index' && (
          <div>
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight">Clear vision. Everyday confidence.</h1>
              <p className="text-[#6b7c87] mt-1">
                Find eyewear that fits your style, comfort, and prescription needs.
              </p>
            </div>

            <section className="bg-[#e8f3ee] rounded-[20px] px-10 py-11 flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
              <div className="max-w-lg">
                <p className="text-xs font-bold tracking-widest text-[#236d71] uppercase mb-2">
                  See The World
                </p>
                <h2 className="text-4xl font-extrabold leading-tight mb-3">A little clearer.</h2>
                <p className="text-[#435b6b] mb-6">
                  Explore eyeglasses, sunglasses and optical essentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('');
                    setPage('products');
                  }}
                  className="bg-[#236d71] hover:bg-[#1c575a] text-white px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer"
                >
                  Browse collection
                </button>
              </div>
              <div className="shrink-0">
                <ProductIllustration category="Eyeglasses" large />
              </div>
            </section>

            <section className="mb-10">
              <h3 className="text-sm font-bold tracking-wider uppercase mb-4">Shop by category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: 'Eyeglasses', desc: 'Everyday frames', bg: 'bg-[#d8ece4] text-[#236d71]' },
                  { title: 'Sunglasses', desc: 'UV protection', bg: 'bg-[#f7ebd0] text-[#b88225]' },
                  { title: 'Contact lenses', desc: 'Comfort & clarity', bg: 'bg-[#dbe9f4] text-[#2e6b9e]' },
                  { title: 'Accessories', desc: 'Care essentials', bg: 'bg-[#ebdce3] text-[#8c4568]' },
                ].map((cat) => (
                  <button
                    key={cat.title}
                    type="button"
                    onClick={() => {
                      setCategoryFilter(cat.title);
                      setPage('products');
                    }}
                    className="bg-white border border-[#e3e8ec] hover:border-[#236d71] rounded-[14px] p-6 text-left flex flex-col justify-between min-h-[140px] transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-lg font-bold">{cat.title}</div>
                      <div className="text-sm text-[#6b7c87] mt-0.5">{cat.desc}</div>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mt-4 text-sm font-bold ${cat.bg}`}>
                      {cat.title[0]}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold tracking-wider uppercase">Featured items</h3>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('');
                    setPage('products');
                  }}
                  className="text-sm font-semibold text-[#236d71] hover:underline cursor-pointer"
                >
                  View all &rarr;
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-[#e3e8ec] rounded-[14px] p-5 flex flex-col justify-between"
                  >
                    <div className="bg-[#e8f3ee] rounded-lg p-6 flex items-center justify-center mb-4">
                      <ProductIllustration category={item.category} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-[#236d71]">{item.category}</div>
                      <h4 className="text-base font-bold mt-1">{item.name}</h4>
                      <p className="text-xs text-[#6b7c87] mt-1 mb-4">{item.material}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-extrabold text-[#236d71] tabular-nums">
                        ₹ {item.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductId(item.id);
                          setOrderQty(1);
                          setPage('product-details');
                        }}
                        className="bg-[#193344] hover:bg-[#10212d] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {page === 'products' && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Optical Collection</h1>
                <p className="text-[#6b7c87] mt-1">
                  Premium frames, sunglasses, lenses and accessories curated for you.
                </p>
              </div>
              {categoryFilter && (
                <button
                  type="button"
                  onClick={() => setCategoryFilter('')}
                  className="text-sm font-semibold text-[#236d71] hover:underline cursor-pointer"
                >
                  Clear filter ({categoryFilter})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#e3e8ec] rounded-[14px] p-5 flex flex-col justify-between"
                >
                  <div className="bg-[#e8f3ee] rounded-lg p-6 flex items-center justify-center mb-4">
                    <ProductIllustration category={item.category} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-[#236d71]">{item.category}</div>
                    <h4 className="text-base font-bold mt-1">{item.name}</h4>
                    <p className="text-xs text-[#6b7c87] mt-1 mb-4">{item.material}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-[#236d71] tabular-nums">
                      ₹ {item.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductId(item.id);
                        setOrderQty(1);
                        setPage('product-details');
                      }}
                      className="bg-[#193344] hover:bg-[#10212d] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === 'product-details' && (
          <div>
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight">Product details</h1>
              <p className="text-[#6b7c87] mt-1">Review product information before placing an order.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div className="bg-[#e8f3ee] rounded-[20px] aspect-square flex items-center justify-center p-10">
                <ProductIllustration category={activeProduct.category} large />
              </div>

              <div>
                <h2 className="text-3xl font-extrabold">{activeProduct.name}</h2>
                <p className="text-[#6b7c87] mt-1 mb-5">
                  {activeProduct.category} &bull; {activeProduct.material}
                </p>
                <div className="text-3xl font-extrabold text-[#236d71] mb-5 tabular-nums">
                  ₹ {activeProduct.price.toLocaleString('en-IN')}
                </div>
                <p className="text-[#3b4e5a] mb-4">{activeProduct.description}</p>
                <ul className="space-y-2 text-sm text-[#3b4e5a] mb-6">
                  <li>&bull; Lightweight design</li>
                  <li>&bull; Multiple size options</li>
                  <li>&bull; Available while stock lasts</li>
                </ul>

                <form onSubmit={handlePlaceOrder}>
                  <label className="block text-sm font-semibold mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={orderQty}
                      onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-24 px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-center font-semibold tabular-nums"
                    />
                    <button
                      type="submit"
                      className="bg-[#236d71] hover:bg-[#1c575a] text-white px-7 py-3 rounded-lg font-semibold text-sm cursor-pointer"
                    >
                      Add to order
                    </button>
                  </div>
                  <p className="text-sm text-[#5a6e7c] mt-4 tabular-nums">
                    Total Subtotal:{' '}
                    <strong className="text-[#236d71]">
                      ₹ {(activeProduct.price * orderQty).toLocaleString('en-IN')}.00
                    </strong>
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}

        {page === 'prescription-form' && (
          <div>
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight">Prescription details</h1>
              <p className="text-[#6b7c87] mt-1">Enter values as provided by your eye-care professional.</p>
            </div>

            {rxSaved && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] text-sm">
                Prescription saved successfully to the database.
              </div>
            )}

            <div className="bg-white border border-[#e3e8ec] rounded-[14px] p-8">
              <h2 className="text-2xl font-bold">Prescription form</h2>
              <p className="text-sm text-[#6b7c87] mt-1 mb-6">Enter your own prescription values below.</p>

              <form onSubmit={handleSavePrescription}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-sm font-bold">
                        <th className="w-1/3 pb-2">Parameter</th>
                        <th className="w-1/3 pb-2">Right eye (OD)</th>
                        <th className="w-1/3 pb-2">Left eye (OS)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Sphere (SPH)', r: 'rightSph', l: 'leftSph', req: true },
                        { label: 'Cylinder (CYL)', r: 'rightCyl', l: 'leftCyl', req: false },
                        { label: 'Axis', r: 'rightAxis', l: 'leftAxis', req: false },
                        { label: 'Addition (ADD)', r: 'rightAdd', l: 'leftAdd', req: false },
                      ].map((row) => (
                        <tr key={row.label}>
                          <td className="text-sm font-semibold text-[#324653] pr-4">{row.label}</td>
                          <td className="pr-4">
                            <input
                              type="text"
                              required={row.req}
                              value={rxForm[row.r as keyof typeof rxForm]}
                              onChange={(e) =>
                                setRxForm({ ...rxForm, [row.r]: e.target.value })
                              }
                              placeholder="Enter value"
                              className="w-full px-3.5 py-2.5 bg-[#f8f8f6] border border-[#dcdad4] rounded-lg text-sm focus:outline-none focus:border-[#236d71] focus:bg-white"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              required={row.req}
                              value={rxForm[row.l as keyof typeof rxForm]}
                              onChange={(e) =>
                                setRxForm({ ...rxForm, [row.l]: e.target.value })
                              }
                              placeholder="Enter value"
                              className="w-full px-3.5 py-2.5 bg-[#f8f8f6] border border-[#dcdad4] rounded-lg text-sm focus:outline-none focus:border-[#236d71] focus:bg-white"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="submit"
                  className="mt-6 bg-[#236d71] hover:bg-[#1c575a] text-white px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer"
                >
                  Save prescription
                </button>
              </form>
            </div>
          </div>
        )}

        {page === 'my-orders' && (
          <div>
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight">My orders</h1>
              <p className="text-[#6b7c87] mt-1">Track the progress of your recent purchases.</p>
            </div>

            <div className="bg-white border border-[#e3e8ec] rounded-[14px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#e6f1ec] text-sm font-bold border-b border-[#e3e8ec]">
                      <th className="py-3.5 px-6">Order</th>
                      <th className="py-3.5 px-6">Placed on</th>
                      <th className="py-3.5 px-6">Amount</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf1f3] text-sm">
                    {customerOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-4 px-6 font-bold">{ord.orderCode}</td>
                        <td className="py-4 px-6 tabular-nums">{ord.orderDate}</td>
                        <td className="py-4 px-6 font-semibold tabular-nums">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6 font-bold text-[#236d71]">{ord.status}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderId(ord.id);
                              setPage('billing');
                            }}
                            className="bg-[#193344] hover:bg-[#10212d] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {page === 'login' && (
          <div className="max-w-[540px] mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-[#6b7c87] mt-1">Sign in to manage your optical store purchases.</p>
            </div>

            <div className="bg-white border border-[#e3e8ec] rounded-[20px] p-9">
              <h2 className="text-2xl font-bold text-center mb-6">Customer Login</h2>

              {loginMessage && (
                <div
                  className={`mb-5 px-4 py-3 rounded-lg text-sm border ${
                    loginMessage.type === 'error'
                      ? 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]'
                      : 'bg-[#d1fae5] text-[#065f46] border-[#a7f3d0]'
                  }`}
                >
                  {loginMessage.text}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Email address or Username</label>
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-[#f8f8f6] border border-[#dcdad4] rounded-lg text-sm focus:outline-none focus:border-[#236d71] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 bg-[#f8f8f6] border border-[#dcdad4] rounded-lg text-sm focus:outline-none focus:border-[#236d71] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#236d71] hover:bg-[#1c575a] text-white py-3 rounded-lg font-semibold text-sm cursor-pointer"
                >
                  Sign in
                </button>
              </form>

              <div className="text-center mt-5 text-sm space-y-2">
                <button
                  type="button"
                  onClick={() => setPage('register')}
                  className="text-[#236d71] font-semibold hover:underline cursor-pointer"
                >
                  New customer? Create an account
                </button>
                <p className="text-xs text-[#6b7c87]">
                  Demo: <span className="font-mono">customer.a@example.com / customer123</span> or{' '}
                  <span className="font-mono">admin / admin123</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {page === 'register' && (
          <div className="max-w-[660px] mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
              <p className="text-[#6b7c87] mt-1">
                A few details help us keep your orders and prescriptions together.
              </p>
            </div>

            <div className="bg-white border border-[#e3e8ec] rounded-[20px] p-9">
              <h2 className="text-2xl font-bold text-center mb-6">Customer Registration</h2>
              <form onSubmit={handleRegister}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-[#f8f8f6] border border-[#dcdad4] rounded-lg text-sm focus:outline-none focus:border-[#236d71] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email address</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-[#f8f8f6] border border-[#dcdad4] rounded-lg text-sm focus:outline-none focus:border-[#236d71] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone number</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 bg-[#f8f8f6] border border-[#dcdad4] rounded-lg text-sm focus:outline-none focus:border-[#236d71] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full px-4 py-3 bg-[#f8f8f6] border border-[#dcdad4] rounded-lg text-sm focus:outline-none focus:border-[#236d71] focus:bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#236d71] hover:bg-[#1c575a] text-white py-3 rounded-lg font-semibold text-sm cursor-pointer"
                >
                  Create account
                </button>
              </form>
              <div className="text-center mt-5 text-sm">
                <button
                  type="button"
                  onClick={() => setPage('login')}
                  className="text-[#236d71] font-semibold hover:underline cursor-pointer"
                >
                  Already registered? Sign in
                </button>
              </div>
            </div>
          </div>
        )}

        {page === 'customer-dashboard' && (
          <div>
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight">Customer dashboard</h1>
              <p className="text-[#6b7c87] mt-1">A simple overview of your optical store activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-white border border-[#e3e8ec] rounded-[14px] p-6">
                <div className="text-lg font-bold">Orders</div>
                <div className="text-sm text-[#6b7c87] mt-1 mb-3">{customerOrders.length} active / recent</div>
                <div className="text-3xl font-bold text-[#236d71] tabular-nums">{customerOrders.length}</div>
              </div>
              <div className="bg-white border border-[#e3e8ec] rounded-[14px] p-6">
                <div className="text-lg font-bold">Saved prescriptions</div>
                <div className="text-sm text-[#6b7c87] mt-1 mb-3">{customerPrescriptions.length} records</div>
                <div className="text-3xl font-bold text-[#236d71] tabular-nums">{customerPrescriptions.length}</div>
              </div>
              <div className="bg-white border border-[#e3e8ec] rounded-[14px] p-6">
                <div className="text-lg font-bold">Wishlist</div>
                <div className="text-sm text-[#6b7c87] mt-1 mb-3">4 items</div>
                <div className="text-3xl font-bold text-[#236d71] tabular-nums">4</div>
              </div>
            </div>

            <h3 className="text-sm font-bold tracking-wider uppercase mb-4">Recent orders</h3>
            <div className="bg-white border border-[#e3e8ec] rounded-[14px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#e6f1ec] text-sm font-bold border-b border-[#e3e8ec]">
                    <th className="py-3.5 px-6">Order ID</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Items</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf1f3] text-sm">
                  {customerOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="py-4 px-6 font-bold">{ord.orderCode}</td>
                      <td className="py-4 px-6 tabular-nums">{ord.orderDate}</td>
                      <td className="py-4 px-6">{ord.productName}</td>
                      <td className="py-4 px-6 font-bold text-[#236d71]">{ord.status}</td>
                      <td className="py-4 px-6 font-semibold tabular-nums">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page === 'admin-dashboard' && (
          <div>
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
              <p className="text-[#6b7c87] mt-1">Store overview with live MySQL database counts.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white border border-[#e3e8ec] rounded-[14px] p-6">
                <div className="text-lg font-bold">Products</div>
                <div className="text-sm text-[#6b7c87] mt-1 mb-3">{products.length} listed</div>
                <div className="text-3xl font-bold text-[#236d71] tabular-nums">{products.length}</div>
              </div>
              <div className="bg-white border border-[#e3e8ec] rounded-[14px] p-6">
                <div className="text-lg font-bold">Orders</div>
                <div className="text-sm text-[#6b7c87] mt-1 mb-3">{orders.length} total</div>
                <div className="text-3xl font-bold text-[#236d71] tabular-nums">{orders.length}</div>
              </div>
              <div className="bg-white border border-[#e3e8ec] rounded-[14px] p-6">
                <div className="text-lg font-bold">Low stock</div>
                <div className="text-sm text-[#6b7c87] mt-1 mb-3">{lowStockCount} items</div>
                <div className="text-3xl font-bold text-[#236d71] tabular-nums">{lowStockCount}</div>
              </div>
              <div className="bg-white border border-[#e3e8ec] rounded-[14px] p-6">
                <div className="text-lg font-bold">Sales</div>
                <div className="text-sm text-[#6b7c87] mt-1 mb-3">Total revenue</div>
                <div className="text-3xl font-bold text-[#236d71] tabular-nums">
                  ₹{totalSales.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold tracking-wider uppercase mb-4">Store management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <button
                type="button"
                onClick={() => setPage('products')}
                className="bg-white border border-[#e3e8ec] hover:border-[#236d71] rounded-[14px] p-6 text-left transition-colors cursor-pointer"
              >
                <div className="text-xl font-bold">Manage products</div>
                <div className="text-sm text-[#6b7c87] mt-1">Browse and organize optical products</div>
              </button>
              <button
                type="button"
                onClick={() => setPage('manage-inventory')}
                className="bg-white border border-[#e3e8ec] hover:border-[#236d71] rounded-[14px] p-6 text-left transition-colors cursor-pointer"
              >
                <div className="text-xl font-bold">Inventory</div>
                <div className="text-sm text-[#6b7c87] mt-1">Monitor available quantities</div>
              </button>
              <button
                type="button"
                onClick={() => setPage('manage-prescriptions')}
                className="bg-white border border-[#e3e8ec] hover:border-[#236d71] rounded-[14px] p-6 text-left transition-colors cursor-pointer"
              >
                <div className="text-xl font-bold">Prescriptions</div>
                <div className="text-sm text-[#6b7c87] mt-1">Review authorized records</div>
              </button>
              <button
                type="button"
                onClick={() => setPage('manage-orders')}
                className="bg-white border border-[#e3e8ec] hover:border-[#236d71] rounded-[14px] p-6 text-left transition-colors cursor-pointer"
              >
                <div className="text-xl font-bold">Billing &amp; orders</div>
                <div className="text-sm text-[#6b7c87] mt-1">Process orders and bills</div>
              </button>
            </div>
          </div>
        )}

        {page === 'manage-inventory' && (
          <div>
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight">Inventory management</h1>
              <p className="text-[#6b7c87] mt-1">Keep stock quantities and reorder levels up to date.</p>
            </div>

            {invAdded && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] text-sm">
                Inventory item added successfully.
              </div>
            )}

            <div className="bg-white border border-[#e3e8ec] rounded-[14px] p-6">
              <div className="flex justify-end mb-5">
                <button
                  type="button"
                  onClick={() => setShowInvForm(!showInvForm)}
                  className="bg-[#236d71] hover:bg-[#1c575a] text-white px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
                >
                  + Add inventory item
                </button>
              </div>

              {showInvForm && (
                <form
                  onSubmit={handleAddInventory}
                  className="mb-6 p-5 bg-[#f8f6f0] rounded-xl border border-[#e3e8ec]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Product name</label>
                      <input
                        type="text"
                        required
                        value={invForm.productName}
                        onChange={(e) => setInvForm({ ...invForm, productName: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Category</label>
                      <select
                        value={invForm.category}
                        onChange={(e) => setInvForm({ ...invForm, category: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                      >
                        <option>Eyeglasses</option>
                        <option>Sunglasses</option>
                        <option>Contact lenses</option>
                        <option>Accessories</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Available</label>
                      <input
                        type="number"
                        required
                        value={invForm.available}
                        onChange={(e) => setInvForm({ ...invForm, available: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Reorder level</label>
                      <input
                        type="number"
                        required
                        value={invForm.reorderLevel}
                        onChange={(e) => setInvForm({ ...invForm, reorderLevel: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#193344] hover:bg-[#10212d] text-white px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    Save item
                  </button>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#e6f1ec] text-sm font-bold border-b border-[#e3e8ec]">
                      <th className="py-3.5 px-6">Product</th>
                      <th className="py-3.5 px-6">Category</th>
                      <th className="py-3.5 px-6">Available</th>
                      <th className="py-3.5 px-6">Reorder level</th>
                      <th className="py-3.5 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf1f3] text-sm">
                    {inventory.map((item) => {
                      const low = item.available <= item.reorderLevel;
                      return (
                        <tr key={item.id}>
                          <td className="py-4 px-6 font-semibold">{item.productName}</td>
                          <td className="py-4 px-6">{item.category}</td>
                          <td className="py-4 px-6 font-semibold tabular-nums">{item.available}</td>
                          <td className="py-4 px-6 tabular-nums">{item.reorderLevel}</td>
                          <td
                            className={`py-4 px-6 font-bold ${
                              low ? 'text-[#bd3939]' : 'text-[#236d71]'
                            }`}
                          >
                            {low ? 'Low stock' : 'In stock'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {page === 'manage-prescriptions' && (
          <div>
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight">Prescription management</h1>
              <p className="text-[#6b7c87] mt-1">Access should be limited to authorized store staff.</p>
            </div>

            <div className="bg-white border border-[#e3e8ec] rounded-[14px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#e6f1ec] text-sm font-bold border-b border-[#e3e8ec]">
                      <th className="py-3.5 px-6">Record</th>
                      <th className="py-3.5 px-6">Customer</th>
                      <th className="py-3.5 px-6">Date</th>
                      <th className="py-3.5 px-6">OD / OS Values</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf1f3] text-sm">
                    {prescriptions.map((rx) => (
                      <tr key={rx.id}>
                        <td className="py-4 px-6 font-bold">{rx.recordCode}</td>
                        <td className="py-4 px-6">{rx.customerName}</td>
                        <td className="py-4 px-6 tabular-nums">{rx.rxDate}</td>
                        <td className="py-4 px-6 font-mono text-xs">
                          OD: {rx.rightSph} | OS: {rx.leftSph}
                        </td>
                        <td className="py-4 px-6 font-bold text-[#236d71]">{rx.status}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => handleMarkReviewed(rx.id)}
                            className="bg-[#193344] hover:bg-[#10212d] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Mark Reviewed
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {page === 'manage-orders' && (
          <div>
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight">Order management</h1>
              <p className="text-[#6b7c87] mt-1">Review customer orders and update processing status.</p>
            </div>

            <div className="bg-white border border-[#e3e8ec] rounded-[14px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#e6f1ec] text-sm font-bold border-b border-[#e3e8ec]">
                      <th className="py-3.5 px-6">Order ID</th>
                      <th className="py-3.5 px-6">Customer</th>
                      <th className="py-3.5 px-6">Order date</th>
                      <th className="py-3.5 px-6">Total</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf1f3] text-sm">
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-4 px-6 font-bold">{ord.orderCode}</td>
                        <td className="py-4 px-6">{ord.customerName}</td>
                        <td className="py-4 px-6 tabular-nums">{ord.orderDate}</td>
                        <td className="py-4 px-6 font-semibold tabular-nums">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6 font-bold text-[#236d71]">{ord.status}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <select
                              value={statusDrafts[ord.id] ?? ord.status}
                              onChange={(e) =>
                                setStatusDrafts({ ...statusDrafts, [ord.id]: e.target.value })
                              }
                              className="px-2.5 py-1.5 bg-[#f8f8f6] border border-[#dcdad4] rounded-lg text-xs"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(ord.id, ord.status)}
                              className="bg-[#193344] hover:bg-[#10212d] text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Update
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {page === 'billing' && (
          <div>
            <div className="mb-7">
              <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
              <p className="text-[#6b7c87] mt-1">Invoice layout for your order.</p>
            </div>

            <div className="max-w-[680px] mx-auto bg-white border border-[#e3e8ec] rounded-[14px] p-10">
              <div className="text-sm font-bold tracking-widest uppercase text-[#236d71]">
                OpticalCare
              </div>
              <div className="text-3xl font-extrabold mt-1 mb-4">
                INVOICE &nbsp; {activeOrder.orderCode.replace('#OS-', '#INV-')}
              </div>

              <div className="flex justify-between text-sm pb-4 border-b border-[#e1e7eb] mb-5">
                <span>Bill to: {activeOrder.customerName}</span>
                <span className="tabular-nums">Date: {activeOrder.orderDate}</span>
              </div>

              <table className="w-full text-left border-collapse mb-6 text-sm">
                <thead>
                  <tr className="border-b border-[#e1e7eb]">
                    <th className="py-2.5 font-bold">Item</th>
                    <th className="py-2.5 font-bold">Qty</th>
                    <th className="py-2.5 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#edf1f3]">
                    <td className="py-4">{activeOrder.productName}</td>
                    <td className="py-4 tabular-nums">{activeOrder.quantity}</td>
                    <td className="py-4 text-right tabular-nums">
                      ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="space-y-2 pb-4 border-b border-[#e1e7eb] mb-5 text-sm text-[#4b5d69]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{activeOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>As applicable</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-2xl font-extrabold mb-6">
                <span>Total</span>
                <span className="text-[#236d71] tabular-nums">
                  ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full bg-[#193344] hover:bg-[#10212d] text-white py-3 rounded-lg font-semibold text-sm cursor-pointer"
              >
                Print / Save invoice
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#f1efea] border-t border-[#e1ded6] py-5 text-center text-xs text-[#6a7782]">
        <strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project
      </footer>
    </div>
  );
}
