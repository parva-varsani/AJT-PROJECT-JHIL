import { ProjectFile, TomcatVersion } from './javaFiles';

export function getStaticFiles(tomcatVersion: TomcatVersion): ProjectFile[] {
  const webXml =
    tomcatVersion === 'tomcat10'
      ? `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
         https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">
    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>
</web-app>
`
      : `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>
</web-app>
`;

  return [
    {
      path: 'web/WEB-INF/web.xml',
      folder: 'Configuration Files',
      language: 'xml',
      content: webXml,
    },
    {
      path: 'optical_store.sql',
      folder: 'Database SQL',
      language: 'sql',
      content: `CREATE DATABASE IF NOT EXISTS optical_store;
USE optical_store;

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price INT NOT NULL,
    material VARCHAR(100),
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_code VARCHAR(20) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    rx_date DATE NOT NULL,
    right_sph VARCHAR(20),
    right_cyl VARCHAR(20),
    right_axis VARCHAR(20),
    right_add VARCHAR(20),
    left_sph VARCHAR(20),
    left_cyl VARCHAR(20),
    left_axis VARCHAR(20),
    left_add VARCHAR(20),
    status VARCHAR(30) DEFAULT 'Submitted'
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(20) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount INT NOT NULL,
    status VARCHAR(30) DEFAULT 'Processing'
);

CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    available INT NOT NULL,
    reorder_level INT NOT NULL
);

INSERT INTO customers (name, email, phone, password) VALUES
('Customer A', 'customer.a@example.com', '9876543210', 'customer123'),
('Customer B', 'customer.b@example.com', '9876543211', 'customer123'),
('Customer C', 'customer.c@example.com', '9876543212', 'customer123');

INSERT INTO products (name, category, price, material, description) VALUES
('Classic Everyday Frame', 'Eyeglasses', 1850, 'Lightweight acetate', 'Comfortable frame for everyday use.'),
('UV protection', 'Sunglasses', 2400, 'Polarized UVA/UVB', 'Protective sunglasses with crisp clarity.'),
('Daily lens pack', 'Contact lenses', 980, 'Comfort & clarity', 'Daily disposable contact lenses for all-day hydration.'),
('Cleaning kit', 'Accessories', 350, 'Anti-fog spray & cloth', 'Complete lens cleaning spray and soft cloth.');

INSERT INTO prescriptions (record_code, customer_name, rx_date, right_sph, right_cyl, right_axis, right_add, left_sph, left_cyl, left_axis, left_add, status) VALUES
('RX-0021', 'Customer A', '2026-11-02', '-1.50', '-0.50', '90', '+1.25', '-1.25', '-0.25', '85', '+1.25', 'Submitted'),
('RX-0018', 'Customer B', '2026-10-29', '-2.00', '-0.75', '85', '+1.00', '-2.00', '-0.50', '95', '+1.00', 'Reviewed'),
('RX-0014', 'Customer C', '2026-10-21', '+1.00', '0.00', '0', '+1.50', '+1.25', '0.00', '0', '+1.50', 'Reviewed');

INSERT INTO orders (order_code, customer_name, product_name, quantity, order_date, total_amount, status) VALUES
('#OS-1024', 'Customer A', 'Classic Everyday Frame', 1, '2026-11-02', 1850, 'Processing'),
('#OS-1023', 'Customer B', 'UV protection', 1, '2026-11-01', 2400, 'Confirmed'),
('#OS-1022', 'Customer C', 'Daily lens pack', 1, '2026-10-31', 980, 'Delivered'),
('#OS-1018', 'Customer A', 'Blue-light glasses', 1, '2026-10-27', 2400, 'Delivered'),
('#OS-1009', 'Customer A', 'Daily lens pack', 1, '2026-10-15', 980, 'Delivered');

INSERT INTO inventory (product_name, category, available, reorder_level) VALUES
('Classic frame', 'Eyeglasses', 32, 10),
('UV protection', 'Sunglasses', 18, 8),
('Daily lens pack', 'Contact lenses', 5, 10),
('Cleaning kit', 'Accessories', 2, 6);
`,
    },
    {
      path: 'web/js/main.js',
      folder: 'Web Pages',
      language: 'js',
      content: `document.addEventListener("DOMContentLoaded", function () {
    var qtyInput = document.getElementById("orderQuantity");
    var priceEl = document.getElementById("productPriceDisplay");
    var subtotalEl = document.getElementById("productSubtotalDisplay");

    if (qtyInput && priceEl && subtotalEl) {
        qtyInput.addEventListener("input", function () {
            var price = parseInt(priceEl.getAttribute("data-price")) || 0;
            var qty = parseInt(qtyInput.value) || 1;
            if (qty < 1) {
                qty = 1;
            }
            var total = price * qty;
            subtotalEl.innerText = "₹ " + total.toLocaleString("en-IN") + ".00";
        });
    }
});

function toggleInventoryForm() {
    var box = document.getElementById("addInventoryBox");
    if (box) {
        if (box.style.display === "none" || box.style.display === "") {
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }
    }
}
`,
    },
    {
      path: 'web/css/style.css',
      folder: 'Web Pages',
      language: 'css',
      content: `:root {
    --color-nav-bg: #152d3e;
    --color-nav-text: #ffffff;
    --color-teal-primary: #236d71;
    --color-teal-hover: #1c575a;
    --color-teal-soft: #e8f3ee;
    --color-cream-btn: #fae6b2;
    --color-cream-btn-hover: #ebd498;
    --color-bg-page: #f8f6f0;
    --color-card-bg: #ffffff;
    --color-text-dark: #162a36;
    --color-text-muted: #6b7c87;
    --color-border: #e3e8ec;
    --color-table-header-bg: #e6f1ec;
    --color-btn-navy: #193344;
    --color-btn-navy-hover: #10212d;
    --color-status-danger: #bd3939;
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --shadow-soft: 0 4px 18px rgba(22, 42, 54, 0.05);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    background-color: var(--color-bg-page);
    color: var(--color-text-dark);
    line-height: 1.5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.navbar {
    background-color: var(--color-nav-bg);
    color: var(--color-nav-text);
    padding: 14px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.brand-container {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: white;
}

.brand-badge {
    background-color: var(--color-teal-primary);
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
}

.brand-text {
    display: flex;
    flex-direction: column;
}

.brand-name {
    font-size: 1.35rem;
    font-weight: 700;
    color: white;
}

.brand-sub {
    font-size: 0.65rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #9cb5c5;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 28px;
    list-style: none;
}

.nav-link {
    color: #c9d8e2;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
}

.nav-link:hover, .nav-link.active {
    color: #ffffff;
    font-weight: 600;
}

.btn-login {
    background-color: var(--color-cream-btn);
    color: var(--color-text-dark);
    padding: 8px 22px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    border: none;
    cursor: pointer;
    display: inline-block;
}

.btn-login:hover {
    background-color: var(--color-cream-btn-hover);
}

.main-container {
    flex: 1;
    max-width: 1120px;
    width: 100%;
    margin: 36px auto;
    padding: 0 24px;
}

.page-header {
    margin-bottom: 28px;
}

.page-title {
    font-size: 2.1rem;
    font-weight: 700;
    color: var(--color-text-dark);
    margin-bottom: 4px;
}

.page-subtitle {
    font-size: 1.05rem;
    color: var(--color-text-muted);
}

.card-box {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 32px;
    box-shadow: var(--shadow-soft);
    margin-bottom: 30px;
}

.hero-card {
    background-color: var(--color-teal-soft);
    border-radius: var(--radius-lg);
    padding: 44px 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
}

.hero-content {
    max-width: 520px;
}

.hero-tagline {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--color-teal-primary);
    margin-bottom: 10px;
}

.hero-heading {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--color-text-dark);
    margin-bottom: 12px;
    line-height: 1.15;
}

.hero-desc {
    font-size: 1.05rem;
    color: #435b6b;
    margin-bottom: 24px;
}

.btn-teal {
    background-color: var(--color-teal-primary);
    color: white;
    padding: 12px 26px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    display: inline-block;
}

.btn-teal:hover {
    background-color: var(--color-teal-hover);
}

.hero-illustration {
    flex-shrink: 0;
    width: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-text-dark);
    margin-bottom: 18px;
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
}

.category-card {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 24px;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 150px;
}

.category-card:hover {
    border-color: var(--color-teal-primary);
}

.category-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-text-dark);
    margin-bottom: 4px;
}

.category-desc {
    font-size: 0.9rem;
    color: var(--color-text-muted);
}

.category-icon-box {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
}

.icon-box-teal { background-color: #d8ece4; color: var(--color-teal-primary); }
.icon-box-yellow { background-color: #f7ebd0; color: #b88225; }
.icon-box-blue { background-color: #dbe9f4; color: #2e6b9e; }
.icon-box-pink { background-color: #ebdce3; color: #8c4568; }

.auth-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.auth-card {
    width: 100%;
    max-width: 580px;
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 40px;
    box-shadow: var(--shadow-soft);
}

.auth-header {
    text-align: center;
    margin-bottom: 28px;
}

.auth-title {
    font-size: 1.55rem;
    font-weight: 700;
    color: var(--color-text-dark);
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 18px;
}

.form-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-dark);
    margin-bottom: 8px;
}

.form-control {
    background-color: #f8f8f6;
    border: 1px solid #dcdad4;
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    font-size: 0.95rem;
    color: var(--color-text-dark);
    width: 100%;
}

.form-control:focus {
    outline: none;
    border-color: var(--color-teal-primary);
    background-color: #ffffff;
}

.btn-full {
    width: 100%;
    text-align: center;
    padding: 13px;
    font-size: 1rem;
    margin-top: 6px;
}

.auth-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 0.95rem;
}

.auth-footer a {
    color: var(--color-teal-primary);
    text-decoration: none;
    font-weight: 600;
}

.stat-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 34px;
}

.stat-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 34px;
}

.stat-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 22px 24px;
    box-shadow: var(--shadow-soft);
}

.stat-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-text-dark);
    margin-bottom: 4px;
}

.stat-subtitle {
    font-size: 0.88rem;
    color: var(--color-text-muted);
    margin-bottom: 12px;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-teal-primary);
    line-height: 1;
}

.table-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-soft);
}

.table-responsive {
    width: 100%;
    overflow-x: auto;
}

.custom-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

.custom-table thead tr {
    background-color: var(--color-table-header-bg);
}

.custom-table th {
    padding: 14px 24px;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-text-dark);
    border-bottom: 1px solid var(--color-border);
}

.custom-table td {
    padding: 18px 24px;
    font-size: 0.95rem;
    color: #2b3e4a;
    border-bottom: 1px solid #edf1f3;
    vertical-align: middle;
}

.status-pill {
    font-weight: 700;
    font-size: 0.92rem;
}

.status-processing, .status-submitted, .status-delivered, .status-reviewed, .status-instock {
    color: var(--color-teal-primary);
}

.status-lowstock {
    color: var(--color-status-danger);
    font-weight: 700;
}

.btn-navy {
    background-color: var(--color-btn-navy);
    color: white;
    padding: 8px 18px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    border: none;
    cursor: pointer;
    display: inline-block;
}

.btn-navy:hover {
    background-color: var(--color-btn-navy-hover);
}

.management-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.management-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 24px 28px;
    text-decoration: none;
    color: inherit;
    box-shadow: var(--shadow-soft);
}

.management-card:hover {
    border-color: var(--color-teal-primary);
}

.management-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text-dark);
    margin-bottom: 6px;
}

.management-desc {
    font-size: 0.92rem;
    color: var(--color-text-muted);
}

.product-details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
}

.product-image-box {
    background-color: var(--color-teal-soft);
    border-radius: var(--radius-lg);
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.product-info-box {
    display: flex;
    flex-direction: column;
}

.product-info-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-text-dark);
    margin-bottom: 6px;
}

.product-info-meta {
    font-size: 1.05rem;
    color: var(--color-text-muted);
    margin-bottom: 22px;
}

.product-info-price {
    font-size: 1.9rem;
    font-weight: 800;
    color: var(--color-teal-primary);
    margin-bottom: 20px;
}

.product-info-desc {
    font-size: 1rem;
    color: #3b4e5a;
    margin-bottom: 18px;
}

.product-features-list {
    list-style: none;
    margin-bottom: 26px;
}

.product-features-list li {
    font-size: 0.95rem;
    color: #3b4e5a;
    margin-bottom: 8px;
}

.order-actions-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 10px;
}

.quantity-input {
    width: 90px;
    padding: 11px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid #ccd2d6;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
}

.rx-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 36px;
    box-shadow: var(--shadow-soft);
}

.rx-table {
    width: 100%;
    margin-top: 24px;
    margin-bottom: 28px;
    border-collapse: separate;
    border-spacing: 0 14px;
}

.rx-table th {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--color-text-dark);
    text-align: left;
    padding-bottom: 12px;
}

.rx-table td {
    padding-right: 18px;
    vertical-align: middle;
}

.rx-param-label {
    font-weight: 600;
    font-size: 0.95rem;
    color: #324653;
}

.invoice-wrapper {
    max-width: 680px;
    margin: 0 auto;
}

.invoice-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 44px;
    box-shadow: var(--shadow-soft);
}

.invoice-brand {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-teal-primary);
    margin-bottom: 4px;
}

.invoice-title {
    font-size: 1.9rem;
    font-weight: 800;
    color: var(--color-text-dark);
    margin-bottom: 16px;
}

.invoice-meta-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    color: var(--color-text-dark);
    padding-bottom: 18px;
    border-bottom: 1px solid #e1e7eb;
    margin-bottom: 20px;
}

.invoice-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
}

.invoice-table th {
    font-size: 0.95rem;
    font-weight: 700;
    padding: 10px 0;
    text-align: left;
    border-bottom: 1px solid #e1e7eb;
}

.invoice-table th:last-child, .invoice-table td:last-child {
    text-align: right;
}

.invoice-table td {
    padding: 16px 0;
    font-size: 0.95rem;
    border-bottom: 1px solid #edf1f3;
}

.invoice-summary {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 14px;
    border-bottom: 1px solid #e1e7eb;
    padding-bottom: 16px;
    margin-bottom: 24px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    color: #4b5d69;
}

.summary-row-total {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-text-dark);
}

.summary-row-total span:last-child {
    color: var(--color-teal-primary);
}

.alert-box {
    padding: 12px 18px;
    border-radius: var(--radius-sm);
    margin-bottom: 20px;
    font-size: 0.92rem;
}

.alert-success {
    background-color: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
}

.alert-error {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
}

.site-footer {
    background-color: #f1efea;
    border-top: 1px solid #e1ded6;
    padding: 24px 0;
    margin-top: auto;
    font-size: 0.88rem;
    color: #6a7782;
    text-align: center;
}

@media print {
    .navbar, .site-footer, .btn-navy, .btn-teal, .btn-login {
        display: none !important;
    }
    body, .main-container {
        background: white !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    .invoice-card {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
    }
}

@media (max-width: 900px) {
    .category-grid, .stat-grid-4, .stat-grid-3 {
        grid-template-columns: repeat(2, 1fr);
    }
    .hero-card {
        flex-direction: column;
        text-align: center;
        gap: 30px;
    }
    .product-details-grid, .management-grid, .form-grid {
        grid-template-columns: 1fr;
    }
}
`,
    },
  ];
}
