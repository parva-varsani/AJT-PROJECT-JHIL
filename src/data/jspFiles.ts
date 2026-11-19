import { ProjectFile } from './javaFiles';

export function getJspFiles(): ProjectFile[] {
  return [
    {
      path: 'web/index.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*, opticalcare.DBConnection" %>
<%
    String userName = (String) session.getAttribute("userName");
    String userRole = (String) session.getAttribute("userRole");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpticalCare - Store Management</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="index.jsp" class="nav-link active">Home</a></li>
            <li><a href="products.jsp" class="nav-link">Products</a></li>
            <li><a href="prescription-form.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="my-orders.jsp" class="nav-link">My Orders</a></li>
            <% if (userName == null) { %>
                <li><a href="login.jsp" class="btn-login">Login</a></li>
            <% } else { %>
                <% if ("ADMIN".equals(userRole)) { %>
                    <li><a href="admin-dashboard.jsp" class="nav-link">Admin</a></li>
                <% } else { %>
                    <li><a href="customer-dashboard.jsp" class="nav-link">Dashboard</a></li>
                <% } %>
                <li><a href="LogoutServlet" class="btn-login">Logout (<%= userName %>)</a></li>
            <% } %>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">Clear vision. Everyday confidence.</h1>
            <p class="page-subtitle">Find eyewear that fits your style, comfort, and prescription needs.</p>
        </div>

        <section class="hero-card">
            <div class="hero-content">
                <div class="hero-tagline">SEE THE WORLD</div>
                <h2 class="hero-heading">A little clearer.</h2>
                <p class="hero-desc">Explore eyeglasses, sunglasses and optical essentials.</p>
                <a href="products.jsp" class="btn-teal">Browse collection</a>
            </div>
            <div class="hero-illustration">
                <svg viewBox="0 0 500 220" width="300" height="135">
                    <line x1="30" y1="95" x2="75" y2="108" stroke="#173347" stroke-width="15" stroke-linecap="round"/>
                    <ellipse cx="145" cy="120" rx="65" ry="50" fill="none" stroke="#173347" stroke-width="16"/>
                    <path d="M 210 120 L 235 120" stroke="#173347" stroke-width="16" stroke-linecap="round"/>
                    <ellipse cx="300" cy="120" rx="65" ry="50" fill="none" stroke="#173347" stroke-width="16"/>
                    <line x1="370" y1="108" x2="415" y2="95" stroke="#173347" stroke-width="15" stroke-linecap="round"/>
                </svg>
            </div>
        </section>

        <section>
            <h3 class="section-title">SHOP BY CATEGORY</h3>
            <div class="category-grid">
                <a href="products.jsp?category=Eyeglasses" class="category-card">
                    <div>
                        <div class="category-title">Eyeglasses</div>
                        <div class="category-desc">Everyday frames</div>
                    </div>
                    <div class="category-icon-box icon-box-teal">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <circle cx="12" cy="12" r="8"/>
                            <circle cx="12" cy="12" r="2" fill="currentColor"/>
                        </svg>
                    </div>
                </a>

                <a href="products.jsp?category=Sunglasses" class="category-card">
                    <div>
                        <div class="category-title">Sunglasses</div>
                        <div class="category-desc">UV protection</div>
                    </div>
                    <div class="category-icon-box icon-box-yellow">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                            <circle cx="12" cy="12" r="5"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                        </svg>
                    </div>
                </a>

                <a href="products.jsp?category=Contact+lenses" class="category-card">
                    <div>
                        <div class="category-title">Contact lenses</div>
                        <div class="category-desc">Comfort &amp; clarity</div>
                    </div>
                    <div class="category-icon-box icon-box-blue">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <circle cx="12" cy="12" r="9"/>
                            <circle cx="12" cy="12" r="4"/>
                        </svg>
                    </div>
                </a>

                <a href="products.jsp?category=Accessories" class="category-card">
                    <div>
                        <div class="category-title">Accessories</div>
                        <div class="category-desc">Care essentials</div>
                    </div>
                    <div class="category-icon-box icon-box-pink">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
                        </svg>
                    </div>
                </a>
            </div>
        </section>

        <section style="margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                <h3 class="section-title" style="margin-bottom: 0;">FEATURED ITEMS</h3>
                <a href="products.jsp" style="color: var(--color-teal-primary); font-weight: 600; text-decoration: none;">View all &rarr;</a>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px;">
                <%
                    try {
                        Connection con = DBConnection.getConnection();
                        Statement st = con.createStatement();
                        ResultSet rs = st.executeQuery("SELECT * FROM products LIMIT 4");
                        while (rs.next()) {
                %>
                <div class="card-box" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="background-color: var(--color-teal-soft); border-radius: var(--radius-sm); padding: 24px; display: flex; justify-content: center; align-items: center; margin-bottom: 14px;">
                        <svg viewBox="0 0 500 220" width="140" height="65">
                            <line x1="30" y1="95" x2="75" y2="108" stroke="#173347" stroke-width="15" stroke-linecap="round"/>
                            <ellipse cx="145" cy="120" rx="65" ry="50" fill="none" stroke="#173347" stroke-width="16"/>
                            <path d="M 210 120 L 235 120" stroke="#173347" stroke-width="16" stroke-linecap="round"/>
                            <ellipse cx="300" cy="120" rx="65" ry="50" fill="none" stroke="#173347" stroke-width="16"/>
                            <line x1="370" y1="108" x2="415" y2="95" stroke="#173347" stroke-width="15" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div>
                        <span style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: var(--color-teal-primary);"><%= rs.getString("category") %></span>
                        <h4 style="font-size: 1.15rem; font-weight: 700; margin: 4px 0 6px 0;"><%= rs.getString("name") %></h4>
                        <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 14px;"><%= rs.getString("material") %></p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span style="font-size: 1.25rem; font-weight: 800; color: var(--color-teal-primary);">₹ <%= rs.getInt("price") %></span>
                        <a href="product-details.jsp?id=<%= rs.getInt("id") %>" class="btn-navy" style="padding: 6px 14px; font-size: 0.85rem;">View details</a>
                    </div>
                </div>
                <%
                        }
                        con.close();
                    } catch (Exception e) {
                        out.println("<p>Unable to load products.</p>");
                    }
                %>
            </div>
        </section>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>
`,
    },
    {
      path: 'web/login.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Login - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="index.jsp" class="nav-link">Home</a></li>
            <li><a href="products.jsp" class="nav-link">Products</a></li>
            <li><a href="prescription-form.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="my-orders.jsp" class="nav-link">My Orders</a></li>
            <li><a href="login.jsp" class="btn-login">Login</a></li>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header" style="text-align: left; max-width: 580px; margin: 0 auto 24px auto;">
            <h1 class="page-title">Welcome back</h1>
            <p class="page-subtitle">Sign in to manage your optical store purchases.</p>
        </div>

        <div class="auth-wrapper">
            <div class="auth-card">

                <div class="auth-header">
                    <h2 class="auth-title">Customer Login</h2>
                </div>

                <% if (request.getParameter("error") != null) { %>
                    <div class="alert-box alert-error">
                        Invalid email or password. Try again.
                    </div>
                <% } %>

                <% if (request.getParameter("registered") != null) { %>
                    <div class="alert-box alert-success">
                        Registration successful. Please sign in.
                    </div>
                <% } %>

                <form action="LoginServlet" method="post">
                    <div class="form-group">
                        <label class="form-label">Email address or Username</label>
                        <input type="text" name="email" class="form-control" placeholder="you@example.com" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 24px;">
                        <label class="form-label">Password</label>
                        <input type="password" name="password" class="form-control" placeholder="Enter password" required>
                    </div>

                    <button type="submit" class="btn-teal btn-full">Sign in</button>
                </form>

                <div class="auth-footer">
                    <p><a href="register.jsp">New customer? Create an account</a></p>
                </div>

            </div>
        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'web/register.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Registration - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="index.jsp" class="nav-link">Home</a></li>
            <li><a href="products.jsp" class="nav-link">Products</a></li>
            <li><a href="prescription-form.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="my-orders.jsp" class="nav-link">My Orders</a></li>
            <li><a href="login.jsp" class="btn-login">Login</a></li>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header" style="text-align: left; max-width: 680px; margin: 0 auto 24px auto;">
            <h1 class="page-title">Create your account</h1>
            <p class="page-subtitle">A few details help us keep your orders and prescriptions together.</p>
        </div>

        <div class="auth-wrapper">
            <div class="auth-card" style="max-width: 680px;">

                <div class="auth-header">
                    <h2 class="auth-title">Customer Registration</h2>
                </div>

                <% if (request.getParameter("error") != null) { %>
                    <div class="alert-box alert-error">
                        Could not create account. Email may already exist.
                    </div>
                <% } %>

                <form action="RegisterServlet" method="post">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Full name</label>
                            <input type="text" name="fullName" class="form-control" placeholder="Enter your full name" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Email address</label>
                            <input type="email" name="email" class="form-control" placeholder="you@example.com" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Phone number</label>
                            <input type="tel" name="phone" class="form-control" placeholder="Enter phone number">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" name="password" class="form-control" placeholder="Create a password" required>
                        </div>
                    </div>

                    <button type="submit" class="btn-teal btn-full">Create account</button>
                </form>

                <div class="auth-footer">
                    <p><a href="login.jsp">Already registered? Sign in</a></p>
                </div>

            </div>
        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'web/products.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*, opticalcare.DBConnection" %>
<%
    String category = request.getParameter("category");
    String userName = (String) session.getAttribute("userName");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browse Products - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="index.jsp" class="nav-link">Home</a></li>
            <li><a href="products.jsp" class="nav-link active">Products</a></li>
            <li><a href="prescription-form.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="my-orders.jsp" class="nav-link">My Orders</a></li>
            <% if (userName == null) { %>
                <li><a href="login.jsp" class="btn-login">Login</a></li>
            <% } else { %>
                <li><a href="LogoutServlet" class="btn-login">Logout (<%= userName %>)</a></li>
            <% } %>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">Optical Collection</h1>
            <p class="page-subtitle">Premium frames, sunglasses, lenses and accessories curated for you.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px;">
            <%
                try {
                    Connection con = DBConnection.getConnection();
                    PreparedStatement ps;
                    if (category != null && !category.trim().isEmpty()) {
                        ps = con.prepareStatement("SELECT * FROM products WHERE category = ?");
                        ps.setString(1, category);
                    } else {
                        ps = con.prepareStatement("SELECT * FROM products");
                    }
                    ResultSet rs = ps.executeQuery();
                    while (rs.next()) {
            %>
            <div class="card-box" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="background-color: var(--color-teal-soft); border-radius: var(--radius-sm); padding: 24px; display: flex; justify-content: center; align-items: center; margin-bottom: 14px;">
                    <svg viewBox="0 0 500 220" width="140" height="65">
                        <line x1="30" y1="95" x2="75" y2="108" stroke="#173347" stroke-width="15" stroke-linecap="round"/>
                        <ellipse cx="145" cy="120" rx="65" ry="50" fill="none" stroke="#173347" stroke-width="16"/>
                        <path d="M 210 120 L 235 120" stroke="#173347" stroke-width="16" stroke-linecap="round"/>
                        <ellipse cx="300" cy="120" rx="65" ry="50" fill="none" stroke="#173347" stroke-width="16"/>
                        <line x1="370" y1="108" x2="415" y2="95" stroke="#173347" stroke-width="15" stroke-linecap="round"/>
                    </svg>
                </div>
                <div>
                    <span style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: var(--color-teal-primary);"><%= rs.getString("category") %></span>
                    <h4 style="font-size: 1.15rem; font-weight: 700; margin: 4px 0 4px 0;"><%= rs.getString("name") %></h4>
                    <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 14px;"><%= rs.getString("material") %></p>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span style="font-size: 1.25rem; font-weight: 800; color: var(--color-teal-primary);">₹ <%= rs.getInt("price") %></span>
                    <a href="product-details.jsp?id=<%= rs.getInt("id") %>" class="btn-navy" style="padding: 6px 14px; font-size: 0.85rem;">View details</a>
                </div>
            </div>
            <%
                    }
                    con.close();
                } catch (Exception e) {
                    out.println("<p>Database error loading products.</p>");
                }
            %>
        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'web/product-details.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*, opticalcare.DBConnection" %>
<%
    String idParam = request.getParameter("id");
    int productId = 1;
    if (idParam != null) {
        productId = Integer.parseInt(idParam);
    }

    String name = "Classic Everyday Frame";
    String category = "Eyeglasses";
    String material = "Lightweight acetate";
    String description = "Comfortable frame for everyday use.";
    int price = 1850;

    try {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps = con.prepareStatement("SELECT * FROM products WHERE id = ?");
        ps.setInt(1, productId);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            name = rs.getString("name");
            category = rs.getString("category");
            material = rs.getString("material");
            description = rs.getString("description");
            price = rs.getInt("price");
        }
        con.close();
    } catch (Exception e) {
        e.printStackTrace();
    }

    String userName = (String) session.getAttribute("userName");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product details - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="index.jsp" class="nav-link">Home</a></li>
            <li><a href="products.jsp" class="nav-link active">Products</a></li>
            <li><a href="prescription-form.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="my-orders.jsp" class="nav-link">My Orders</a></li>
            <% if (userName == null) { %>
                <li><a href="login.jsp" class="btn-login">Login</a></li>
            <% } else { %>
                <li><a href="LogoutServlet" class="btn-login">Logout (<%= userName %>)</a></li>
            <% } %>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">Product details</h1>
            <p class="page-subtitle">Review product information before placing an order.</p>
        </div>

        <div class="product-details-grid">

            <div class="product-image-box">
                <svg viewBox="0 0 500 220" width="100%" height="auto">
                    <line x1="30" y1="95" x2="75" y2="108" stroke="#173347" stroke-width="16" stroke-linecap="round"/>
                    <ellipse cx="145" cy="120" rx="65" ry="50" fill="none" stroke="#173347" stroke-width="18"/>
                    <path d="M 210 120 L 235 120" stroke="#173347" stroke-width="18" stroke-linecap="round"/>
                    <ellipse cx="300" cy="120" rx="65" ry="50" fill="none" stroke="#173347" stroke-width="18"/>
                    <line x1="370" y1="108" x2="415" y2="95" stroke="#173347" stroke-width="16" stroke-linecap="round"/>
                </svg>
            </div>

            <div class="product-info-box">
                <h2 class="product-info-title"><%= name %></h2>
                <div class="product-info-meta"><%= category %> &bull; <%= material %></div>

                <div class="product-info-price" id="productPriceDisplay" data-price="<%= price %>">
                    ₹ <%= price %>
                </div>

                <p class="product-info-desc"><%= description %></p>

                <ul class="product-features-list">
                    <li>&bull; Lightweight design</li>
                    <li>&bull; Multiple size options</li>
                    <li>&bull; Available while stock lasts</li>
                </ul>

                <form action="OrderServlet" method="post">
                    <input type="hidden" name="productName" value="<%= name %>">
                    <input type="hidden" name="price" value="<%= price %>">

                    <div style="margin-bottom: 8px;">
                        <label class="form-label">Quantity</label>
                    </div>

                    <div class="order-actions-row">
                        <input type="number" id="orderQuantity" name="quantity" class="quantity-input" value="1" min="1" max="10">
                        <button type="submit" class="btn-teal" style="padding: 12px 32px; font-size: 1.05rem;">Add to order</button>
                    </div>

                    <div style="margin-top: 14px; font-size: 0.95rem; color: #5a6e7c;">
                        Total Subtotal: <strong id="productSubtotalDisplay" style="color: var(--color-teal-primary);">₹ <%= price %>.00</strong>
                    </div>
                </form>
            </div>

        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>
`,
    },
    {
      path: 'web/prescription-form.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String userName = (String) session.getAttribute("userName");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prescription details - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="index.jsp" class="nav-link">Home</a></li>
            <li><a href="products.jsp" class="nav-link">Products</a></li>
            <li><a href="prescription-form.jsp" class="nav-link active">Prescriptions</a></li>
            <li><a href="my-orders.jsp" class="nav-link">My Orders</a></li>
            <% if (userName == null) { %>
                <li><a href="login.jsp" class="btn-login">Login</a></li>
            <% } else { %>
                <li><a href="LogoutServlet" class="btn-login">Logout (<%= userName %>)</a></li>
            <% } %>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">Prescription details</h1>
            <p class="page-subtitle">Enter values as provided by your eye-care professional.</p>
        </div>

        <% if (request.getParameter("saved") != null) { %>
            <div class="alert-box alert-success">
                Prescription saved successfully to the database.
            </div>
        <% } %>

        <div class="rx-card">
            <div>
                <h2 style="font-size: 1.55rem; font-weight: 700; color: var(--color-text-dark); margin-bottom: 4px;">Prescription form</h2>
                <p style="font-size: 0.95rem; color: var(--color-text-muted);">Enter your own prescription values below.</p>
            </div>

            <form action="PrescriptionServlet" method="post">
                <table class="rx-table">
                    <thead>
                        <tr>
                            <th style="width: 34%;">Parameter</th>
                            <th style="width: 33%;">Right eye (OD)</th>
                            <th style="width: 33%;">Left eye (OS)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="rx-param-label">Sphere (SPH)</td>
                            <td><input type="text" name="rightSph" class="form-control" placeholder="Enter value" required></td>
                            <td><input type="text" name="leftSph" class="form-control" placeholder="Enter value" required></td>
                        </tr>
                        <tr>
                            <td class="rx-param-label">Cylinder (CYL)</td>
                            <td><input type="text" name="rightCyl" class="form-control" placeholder="Enter value"></td>
                            <td><input type="text" name="leftCyl" class="form-control" placeholder="Enter value"></td>
                        </tr>
                        <tr>
                            <td class="rx-param-label">Axis</td>
                            <td><input type="text" name="rightAxis" class="form-control" placeholder="Enter value"></td>
                            <td><input type="text" name="leftAxis" class="form-control" placeholder="Enter value"></td>
                        </tr>
                        <tr>
                            <td class="rx-param-label">Addition (ADD)</td>
                            <td><input type="text" name="rightAdd" class="form-control" placeholder="Enter value"></td>
                            <td><input type="text" name="leftAdd" class="form-control" placeholder="Enter value"></td>
                        </tr>
                    </tbody>
                </table>

                <div>
                    <button type="submit" class="btn-teal">Save prescription</button>
                </div>
            </form>
        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'web/my-orders.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*, opticalcare.DBConnection" %>
<%
    String userName = (String) session.getAttribute("userName");
    String activeCustomer = (userName != null) ? userName : "Customer A";
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My orders - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="index.jsp" class="nav-link">Home</a></li>
            <li><a href="products.jsp" class="nav-link">Products</a></li>
            <li><a href="prescription-form.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="my-orders.jsp" class="nav-link active">My Orders</a></li>
            <% if (userName == null) { %>
                <li><a href="login.jsp" class="btn-login">Login</a></li>
            <% } else { %>
                <li><a href="LogoutServlet" class="btn-login">Logout (<%= userName %>)</a></li>
            <% } %>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">My orders</h1>
            <p class="page-subtitle">Track the progress of your recent purchases.</p>
        </div>

        <div class="table-card">
            <div class="table-responsive">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Placed on</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th style="text-align: right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%
                            try {
                                Connection con = DBConnection.getConnection();
                                PreparedStatement ps = con.prepareStatement(
                                    "SELECT * FROM orders WHERE customer_name = ? ORDER BY id DESC"
                                );
                                ps.setString(1, activeCustomer);
                                ResultSet rs = ps.executeQuery();
                                while (rs.next()) {
                        %>
                        <tr>
                            <td style="font-weight: 700; color: #162a36;"><%= rs.getString("order_code") %></td>
                            <td><%= rs.getString("order_date") %></td>
                            <td style="font-weight: 600;">₹<%= rs.getInt("total_amount") %></td>
                            <td><span class="status-pill status-processing"><%= rs.getString("status") %></span></td>
                            <td style="text-align: right;">
                                <a href="billing.jsp?id=<%= rs.getInt("id") %>" class="btn-navy">View details</a>
                            </td>
                        </tr>
                        <%
                                }
                                con.close();
                            } catch (Exception e) {
                                out.println("<tr><td colspan='5'>Unable to load orders.</td></tr>");
                            }
                        %>
                    </tbody>
                </table>
            </div>
        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'web/customer-dashboard.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*, opticalcare.DBConnection" %>
<%
    String userName = (String) session.getAttribute("userName");
    String activeCustomer = (userName != null) ? userName : "Customer A";
    int orderCount = 0;
    int rxCount = 0;

    try {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps1 = con.prepareStatement("SELECT COUNT(*) FROM orders WHERE customer_name = ?");
        ps1.setString(1, activeCustomer);
        ResultSet rs1 = ps1.executeQuery();
        if (rs1.next()) orderCount = rs1.getInt(1);

        PreparedStatement ps2 = con.prepareStatement("SELECT COUNT(*) FROM prescriptions WHERE customer_name = ?");
        ps2.setString(1, activeCustomer);
        ResultSet rs2 = ps2.executeQuery();
        if (rs2.next()) rxCount = rs2.getInt(1);
        con.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer dashboard - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="index.jsp" class="nav-link">Home</a></li>
            <li><a href="products.jsp" class="nav-link">Products</a></li>
            <li><a href="prescription-form.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="my-orders.jsp" class="nav-link">My Orders</a></li>
            <li><a href="LogoutServlet" class="btn-login">Logout (<%= activeCustomer %>)</a></li>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">Customer dashboard</h1>
            <p class="page-subtitle">A simple overview of your optical store activity.</p>
        </div>

        <div class="stat-grid-3">
            <div class="stat-card">
                <div class="stat-title">Orders</div>
                <div class="stat-subtitle"><%= orderCount %> active / recent</div>
                <div class="stat-number"><%= orderCount %></div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Saved prescriptions</div>
                <div class="stat-subtitle"><%= rxCount %> records</div>
                <div class="stat-number"><%= rxCount %></div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Wishlist</div>
                <div class="stat-subtitle">4 items</div>
                <div class="stat-number">4</div>
            </div>
        </div>

        <h3 class="section-title">RECENT ORDERS</h3>
        <div class="table-card">
            <div class="table-responsive">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Status</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%
                            try {
                                Connection con = DBConnection.getConnection();
                                PreparedStatement ps = con.prepareStatement(
                                    "SELECT * FROM orders WHERE customer_name = ? ORDER BY id DESC"
                                );
                                ps.setString(1, activeCustomer);
                                ResultSet rs = ps.executeQuery();
                                while (rs.next()) {
                        %>
                        <tr>
                            <td style="font-weight: 700;"><%= rs.getString("order_code") %></td>
                            <td><%= rs.getString("order_date") %></td>
                            <td><%= rs.getString("product_name") %></td>
                            <td><span class="status-pill status-processing"><%= rs.getString("status") %></span></td>
                            <td style="font-weight: 600;">₹<%= rs.getInt("total_amount") %></td>
                        </tr>
                        <%
                                }
                                con.close();
                            } catch (Exception e) {
                                out.println("<tr><td colspan='5'>Unable to load orders.</td></tr>");
                            }
                        %>
                    </tbody>
                </table>
            </div>
        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'web/admin-dashboard.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*, opticalcare.DBConnection" %>
<%
    int productCount = 0;
    int orderCount = 0;
    int lowStockCount = 0;
    int totalSales = 0;

    try {
        Connection con = DBConnection.getConnection();
        Statement st = con.createStatement();

        ResultSet rs1 = st.executeQuery("SELECT COUNT(*) FROM products");
        if (rs1.next()) productCount = rs1.getInt(1);

        ResultSet rs2 = st.executeQuery("SELECT COUNT(*) FROM orders");
        if (rs2.next()) orderCount = rs2.getInt(1);

        ResultSet rs3 = st.executeQuery("SELECT COUNT(*) FROM inventory WHERE available <= reorder_level");
        if (rs3.next()) lowStockCount = rs3.getInt(1);

        ResultSet rs4 = st.executeQuery("SELECT SUM(total_amount) FROM orders");
        if (rs4.next()) totalSales = rs4.getInt(1);

        con.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin dashboard - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="admin-dashboard.jsp" class="nav-link active">Admin Dashboard</a></li>
            <li><a href="manage-inventory.jsp" class="nav-link">Inventory</a></li>
            <li><a href="manage-prescriptions.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="manage-orders.jsp" class="nav-link">Orders</a></li>
            <li><a href="billing.jsp" class="nav-link">Billing</a></li>
            <li><a href="LogoutServlet" class="btn-login" style="background:#fecaca; color:#7f1d1d;">Logout</a></li>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">Admin dashboard</h1>
            <p class="page-subtitle">Store overview with live MySQL database counts.</p>
        </div>

        <div class="stat-grid-4">
            <div class="stat-card">
                <div class="stat-title">Products</div>
                <div class="stat-subtitle"><%= productCount %> listed</div>
                <div class="stat-number"><%= productCount %></div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Orders</div>
                <div class="stat-subtitle"><%= orderCount %> total</div>
                <div class="stat-number"><%= orderCount %></div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Low stock</div>
                <div class="stat-subtitle"><%= lowStockCount %> items</div>
                <div class="stat-number"><%= lowStockCount %></div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Sales</div>
                <div class="stat-subtitle">Total revenue</div>
                <div class="stat-number">₹<%= totalSales %></div>
            </div>
        </div>

        <h3 class="section-title">STORE MANAGEMENT</h3>
        <div class="management-grid">
            <a href="products.jsp" class="management-card">
                <div class="management-title">Manage products</div>
                <div class="management-desc">Browse and organize optical products</div>
            </a>
            <a href="manage-inventory.jsp" class="management-card">
                <div class="management-title">Inventory</div>
                <div class="management-desc">Monitor available quantities</div>
            </a>
            <a href="manage-prescriptions.jsp" class="management-card">
                <div class="management-title">Prescriptions</div>
                <div class="management-desc">Review authorized records</div>
            </a>
            <a href="manage-orders.jsp" class="management-card">
                <div class="management-title">Billing &amp; orders</div>
                <div class="management-desc">Process orders and bills</div>
            </a>
        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'web/manage-inventory.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*, opticalcare.DBConnection" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory management - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="admin-dashboard.jsp" class="nav-link">Admin Dashboard</a></li>
            <li><a href="manage-inventory.jsp" class="nav-link active">Inventory</a></li>
            <li><a href="manage-prescriptions.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="manage-orders.jsp" class="nav-link">Orders</a></li>
            <li><a href="billing.jsp" class="nav-link">Billing</a></li>
            <li><a href="LogoutServlet" class="btn-login" style="background:#fecaca; color:#7f1d1d;">Logout</a></li>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">Inventory management</h1>
            <p class="page-subtitle">Keep stock quantities and reorder levels up to date.</p>
        </div>

        <% if (request.getParameter("added") != null) { %>
            <div class="alert-box alert-success">Inventory item added successfully.</div>
        <% } %>

        <div class="card-box" style="padding: 24px;">

            <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
                <button type="button" class="btn-teal" onclick="toggleInventoryForm()">+ Add inventory item</button>
            </div>

            <div id="addInventoryBox" style="display: none; margin-bottom: 24px; padding: 20px; background: #f8f6f0; border-radius: 10px;">
                <form action="InventoryServlet" method="post">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Product name</label>
                            <input type="text" name="productName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Category</label>
                            <select name="category" class="form-control">
                                <option>Eyeglasses</option>
                                <option>Sunglasses</option>
                                <option>Contact lenses</option>
                                <option>Accessories</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Available</label>
                            <input type="number" name="available" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Reorder level</label>
                            <input type="number" name="reorderLevel" class="form-control" required>
                        </div>
                    </div>
                    <button type="submit" class="btn-navy">Save item</button>
                </form>
            </div>

            <div class="table-responsive">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Available</th>
                            <th>Reorder level</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%
                            try {
                                Connection con = DBConnection.getConnection();
                                Statement st = con.createStatement();
                                ResultSet rs = st.executeQuery("SELECT * FROM inventory ORDER BY id ASC");
                                while (rs.next()) {
                                    int avail = rs.getInt("available");
                                    int reorder = rs.getInt("reorder_level");
                                    boolean low = avail <= reorder;
                        %>
                        <tr>
                            <td style="font-weight: 600; color: #162a36;"><%= rs.getString("product_name") %></td>
                            <td><%= rs.getString("category") %></td>
                            <td style="font-weight: 600;"><%= avail %></td>
                            <td><%= reorder %></td>
                            <td>
                                <% if (low) { %>
                                    <span class="status-pill status-lowstock">Low stock</span>
                                <% } else { %>
                                    <span class="status-pill status-instock">In stock</span>
                                <% } %>
                            </td>
                        </tr>
                        <%
                                }
                                con.close();
                            } catch (Exception e) {
                                out.println("<tr><td colspan='5'>Unable to load inventory.</td></tr>");
                            }
                        %>
                    </tbody>
                </table>
            </div>

        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>
`,
    },
    {
      path: 'web/manage-prescriptions.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*, opticalcare.DBConnection" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prescription management - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="admin-dashboard.jsp" class="nav-link">Admin Dashboard</a></li>
            <li><a href="manage-inventory.jsp" class="nav-link">Inventory</a></li>
            <li><a href="manage-prescriptions.jsp" class="nav-link active">Prescriptions</a></li>
            <li><a href="manage-orders.jsp" class="nav-link">Orders</a></li>
            <li><a href="billing.jsp" class="nav-link">Billing</a></li>
            <li><a href="LogoutServlet" class="btn-login" style="background:#fecaca; color:#7f1d1d;">Logout</a></li>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">Prescription management</h1>
            <p class="page-subtitle">Access should be limited to authorized store staff.</p>
        </div>

        <div class="table-card">
            <div class="table-responsive">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Record</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>OD / OS Values</th>
                            <th>Status</th>
                            <th style="text-align: right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%
                            try {
                                Connection con = DBConnection.getConnection();
                                Statement st = con.createStatement();
                                ResultSet rs = st.executeQuery("SELECT * FROM prescriptions ORDER BY id DESC");
                                while (rs.next()) {
                        %>
                        <tr>
                            <td style="font-weight: 700; color: #162a36;"><%= rs.getString("record_code") %></td>
                            <td><%= rs.getString("customer_name") %></td>
                            <td><%= rs.getString("rx_date") %></td>
                            <td>OD: <%= rs.getString("right_sph") %> | OS: <%= rs.getString("left_sph") %></td>
                            <td><span class="status-pill status-reviewed"><%= rs.getString("status") %></span></td>
                            <td style="text-align: right;">
                                <form action="PrescriptionServlet" method="post" style="display:inline;">
                                    <input type="hidden" name="action" value="review">
                                    <input type="hidden" name="id" value="<%= rs.getInt("id") %>">
                                    <button type="submit" class="btn-navy">Mark Reviewed</button>
                                </form>
                            </td>
                        </tr>
                        <%
                                }
                                con.close();
                            } catch (Exception e) {
                                out.println("<tr><td colspan='6'>Unable to load prescriptions.</td></tr>");
                            }
                        %>
                    </tbody>
                </table>
            </div>
        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'web/manage-orders.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*, opticalcare.DBConnection" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order management - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="admin-dashboard.jsp" class="nav-link">Admin Dashboard</a></li>
            <li><a href="manage-inventory.jsp" class="nav-link">Inventory</a></li>
            <li><a href="manage-prescriptions.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="manage-orders.jsp" class="nav-link active">Orders</a></li>
            <li><a href="billing.jsp" class="nav-link">Billing</a></li>
            <li><a href="LogoutServlet" class="btn-login" style="background:#fecaca; color:#7f1d1d;">Logout</a></li>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">Order management</h1>
            <p class="page-subtitle">Review customer orders and update processing status.</p>
        </div>

        <div class="table-card">
            <div class="table-responsive">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Order date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th style="text-align: right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%
                            try {
                                Connection con = DBConnection.getConnection();
                                Statement st = con.createStatement();
                                ResultSet rs = st.executeQuery("SELECT * FROM orders ORDER BY id DESC");
                                while (rs.next()) {
                                    String currentStatus = rs.getString("status");
                        %>
                        <tr>
                            <td style="font-weight: 700; color: #162a36;"><%= rs.getString("order_code") %></td>
                            <td><%= rs.getString("customer_name") %></td>
                            <td><%= rs.getString("order_date") %></td>
                            <td style="font-weight: 600;">₹<%= rs.getInt("total_amount") %></td>
                            <td><span class="status-pill status-processing"><%= currentStatus %></span></td>
                            <td style="text-align: right;">
                                <form action="OrderServlet" method="post" style="display:inline-flex; gap:8px; align-items:center;">
                                    <input type="hidden" name="action" value="update">
                                    <input type="hidden" name="id" value="<%= rs.getInt("id") %>">
                                    <select name="status" class="form-control" style="width:auto; padding:6px 10px;">
                                        <option value="Processing" <%= "Processing".equals(currentStatus) ? "selected" : "" %>>Processing</option>
                                        <option value="Confirmed" <%= "Confirmed".equals(currentStatus) ? "selected" : "" %>>Confirmed</option>
                                        <option value="Delivered" <%= "Delivered".equals(currentStatus) ? "selected" : "" %>>Delivered</option>
                                    </select>
                                    <button type="submit" class="btn-navy">Update</button>
                                </form>
                            </td>
                        </tr>
                        <%
                                }
                                con.close();
                            } catch (Exception e) {
                                out.println("<tr><td colspan='6'>Unable to load orders.</td></tr>");
                            }
                        %>
                    </tbody>
                </table>
            </div>
        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'web/billing.jsp',
      folder: 'Web Pages',
      language: 'jsp',
      content: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*, opticalcare.DBConnection" %>
<%
    String idParam = request.getParameter("id");
    String invoiceCode = "#INV-1024";
    String customerName = "Customer A";
    String orderDate = "2026-11-02";
    String productName = "Classic Everyday Frame";
    int quantity = 1;
    int totalAmount = 1850;

    try {
        Connection con = DBConnection.getConnection();
        PreparedStatement ps;
        if (idParam != null && !idParam.trim().isEmpty()) {
            ps = con.prepareStatement("SELECT * FROM orders WHERE id = ?");
            ps.setInt(1, Integer.parseInt(idParam));
        } else {
            ps = con.prepareStatement("SELECT * FROM orders ORDER BY id DESC LIMIT 1");
        }
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            String code = rs.getString("order_code");
            invoiceCode = code.replace("#OS-", "#INV-");
            customerName = rs.getString("customer_name");
            orderDate = rs.getString("order_date");
            productName = rs.getString("product_name");
            quantity = rs.getInt("quantity");
            totalAmount = rs.getInt("total_amount");
        }
        con.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Billing - OpticalCare</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <nav class="navbar">
        <a href="index.jsp" class="brand-container">
            <span class="brand-badge">OC</span>
            <div class="brand-text">
                <span class="brand-name">OpticalCare</span>
                <span class="brand-sub">STORE MANAGEMENT</span>
            </div>
        </a>

        <ul class="nav-links">
            <li><a href="index.jsp" class="nav-link">Home</a></li>
            <li><a href="products.jsp" class="nav-link">Products</a></li>
            <li><a href="prescription-form.jsp" class="nav-link">Prescriptions</a></li>
            <li><a href="my-orders.jsp" class="nav-link">My Orders</a></li>
            <li><a href="login.jsp" class="btn-login">Login</a></li>
        </ul>
    </nav>

    <main class="main-container">

        <div class="page-header">
            <h1 class="page-title">Billing</h1>
            <p class="page-subtitle">Invoice layout for your order.</p>
        </div>

        <div class="invoice-wrapper">
            <div class="invoice-card">
                <div class="invoice-brand">OPTICALCARE</div>
                <div class="invoice-title">INVOICE &nbsp; <%= invoiceCode %></div>

                <div class="invoice-meta-row">
                    <span>Bill to: <%= customerName %></span>
                    <span>Date: <%= orderDate %></span>
                </div>

                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><%= productName %></td>
                            <td><%= quantity %></td>
                            <td>₹<%= totalAmount %></td>
                        </tr>
                    </tbody>
                </table>

                <div class="invoice-summary">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>₹<%= totalAmount %></span>
                    </div>
                    <div class="summary-row">
                        <span>Tax</span>
                        <span>As applicable</span>
                    </div>
                </div>

                <div class="summary-row summary-row-total" style="margin-bottom: 24px;">
                    <span>Total</span>
                    <span>₹<%= totalAmount %></span>
                </div>

                <button type="button" class="btn-navy btn-full" onclick="window.print()">Print / Save invoice</button>
            </div>
        </div>

    </main>

    <footer class="site-footer">
        <div class="main-container" style="margin: 0 auto; padding: 0 24px;">
            <p><strong>OpticalCare Store Management System</strong> &bull; Advanced Java Technology (AJT) Project</p>
        </div>
    </footer>

</body>
</html>
`,
    },
  ];
}
