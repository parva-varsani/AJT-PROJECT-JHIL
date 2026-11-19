# Optical Store Management System ("OpticalCare")

> **Advanced Java Technology (AJT) Project — Component 2 & Component 3 Implementation**  
> **Course:** 01CE0308 – Advanced Java Technology  
> **Department:** Department of Computer Engineering  
> **Team Members:**  
> - Raval Jhil (En. No. 92610103006)  
> - Kachhadiya Zarna (En. No. 92610103017)  
> - Jani Neev (En. No. 92610103014)  

---

## 1. Project Overview & Architecture

The **Optical Store Management System** is a full-featured web application built with modern **Advanced Java Technologies** adhering strictly to the **Model–View–Controller (MVC)** architectural design pattern.

The application automates and digitizes all core operations of an optical retail store, eliminating manual record-keeping errors, stock discrepancies, and misplaced prescription records.

### Architecture Breakdown:
- **Model:** Encapsulates business domain entities (`Customer`, `Product`, `Prescription`, `Order`, `OrderDetail`, `Inventory`, `Bill`, `Admin`) and Data Access Objects (`CustomerDAO`, `ProductDAO`, `PrescriptionDAO`, `OrderDAO`, `InventoryDAO`, `BillingDAO`, `AdminDAO`).
- **View:** Dynamic Jakarta Server Pages (`JSP`) utilizing Jakarta JSTL 3.0 core and format tags, paired with a custom responsive stylesheet (`style.css`), vector graphics (`SVG`), and client-side interactivity (`main.js`) replicating the mockups from the project report.
- **Controller:** Modern Jakarta Servlets 6.0 (`LoginServlet`, `RegisterServlet`, `ProductServlet`, `PrescriptionServlet`, `OrderServlet`, `InventoryServlet`, `BillingServlet`, `AdminDashboardServlet`) handling HTTP requests, session security, business coordination, and view forwarding.
- **Service Layer:** `OpticalStoreService` coordinating cross-module transactions, inventory deduction, automated billing, and dashboard analytics.
- **Database Layer:** Centralized relational database `optical_store` in MySQL, accessed via JDBC with `DBConnection.java`.

---

## 2. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6) |
| **UI Design** | Custom CSS designed to match project report screenshots |
| **Backend** | Java 21 |
| **Web Technology** | Jakarta Servlets 6.0 |
| **Dynamic Pages** | Jakarta Server Pages (JSP) 3.1 |
| **Database** | MySQL |
| **Database Connectivity** | JDBC |
| **Database Management** | XAMPP, phpMyAdmin |
| **Server** | Apache Tomcat 10.1+ |
| **Build Tool** | Apache Maven |
| **IDE** | Visual Studio Code |
| **Database Driver** | MySQL Connector/J 8.3.0 |
| **JSP Tag Library** | Jakarta JSTL 3.0 |
| **Architecture** | MVC (Model–View–Controller) |

---

## 3. Project Directory Structure

```
OpticalStoreManagementSystem/
├── sql/
│   └── database.sql                  # Complete MySQL schema & seed data
├── src/
│   └── main/
│       ├── java/
│       │   └── com/opticalstore/
│       │       ├── controller/       # Jakarta 6.0 Servlets
│       │       │   ├── LoginServlet.java
│       │       │   ├── RegisterServlet.java
│       │       │   ├── ProductServlet.java
│       │       │   ├── PrescriptionServlet.java
│       │       │   ├── OrderServlet.java
│       │       │   ├── InventoryServlet.java
│       │       │   ├── BillingServlet.java
│       │       │   └── AdminDashboardServlet.java
│       │       ├── model/            # Java Bean Entities
│       │       │   ├── Customer.java
│       │       │   ├── Product.java
│       │       │   ├── Prescription.java
│       │       │   ├── Order.java
│       │       │   ├── OrderDetail.java
│       │       │   ├── Inventory.java
│       │       │   ├── Bill.java
│       │       │   └── Admin.java
│       │       ├── dao/              # JDBC Data Access Objects with fallback
│       │       │   ├── CustomerDAO.java
│       │       │   ├── ProductDAO.java
│       │       │   ├── PrescriptionDAO.java
│       │       │   ├── OrderDAO.java
│       │       │   ├── InventoryDAO.java
│       │       │   ├── BillingDAO.java
│       │       │   └── AdminDAO.java
│       │       ├── service/          # Business Service
│       │       │   └── OpticalStoreService.java
│       │       └── util/             # Database Connection Utility
│       │           └── DBConnection.java
│       └── webapp/
│           ├── WEB-INF/
│           │   ├── includes/         # Reusable navigation & footer
│           │   │   ├── header.jsp
│           │   │   └── footer.jsp
│           │   └── web.xml           # Servlet 6.0 deployment descriptor
│           ├── css/
│           │   └── style.css         # UI design system & responsive styling
│           ├── js/
│           │   └── main.js           # Client interactions & modal handlers
│           ├── images/               # Product SVGs & screenshots
│           ├── index.jsp             # Home & category showcase (Image 1)
│           ├── login.jsp             # Customer & admin login (Image 2)
│           ├── register.jsp          # Customer registration (Image 3)
│           ├── customer-dashboard.jsp# Customer dashboard & recent orders (Image 4)
│           ├── products.jsp          # Product catalog with category filter
│           ├── product-details.jsp   # Detailed product view (Image 5)
│           ├── prescription-form.jsp # Prescription entry form (Image 6)
│           ├── my-orders.jsp         # Customer orders listing (Image 7)
│           ├── admin-dashboard.jsp   # Admin metrics & store navigation (Image 8)
│           ├── manage-products.jsp   # Admin add/edit/delete product
│           ├── manage-inventory.jsp  # Admin inventory & stock levels (Image 9)
│           ├── manage-prescriptions.jsp # Admin prescription reviews (Image 10)
│           ├── manage-orders.jsp     # Admin order processing & status (Image 11)
│           └── billing.jsp           # Invoice layout & print feature (Image 12)
└── pom.xml                           # Maven dependencies & build configuration
```

---

## 4. Application Pages & Screenshot References

| Screen # | Page / Feature | URL Path | Report Reference |
| :---: | :--- | :--- | :--- |
| **1** | Home / Category Listing | `/index.jsp` | `image1.png` |
| **2** | Customer Login | `/login` | `image2.png` |
| **3** | Customer Registration | `/register` | `image3.png` |
| **4** | Customer Dashboard | `/customer-dashboard` | `image4.png` |
| **5** | Product Details | `/product-details?id=1` | `image5.png` |
| **6** | Prescription Entry Form | `/prescription-form` | `image6.png` |
| **7** | Customer Orders | `/my-orders` | `image7.png` |
| **8** | Admin Dashboard | `/admin-dashboard` | `image8.png` |
| **9** | Inventory Management | `/manage-inventory` | `image9.png` |
| **10** | Prescription Management | `/manage-prescriptions` | `image10.png` |
| **11** | Order Management | `/manage-orders` | `image11.png` |
| **12** | Billing & Invoice | `/billing?orderCode=#OS-1024` | `image12.png` |

---

## 5. Setup & Running Instructions

### Step 1: Database Setup (XAMPP / phpMyAdmin)
1. Launch **XAMPP Control Panel**.
2. Click **Start** for **Apache** and **MySQL**.
3. Open your browser and navigate to `http://localhost/phpmyadmin/`.
4. Click on the **SQL** tab.
5. Open `OpticalStoreManagementSystem/sql/database.sql`, copy all contents, paste into phpMyAdmin, and click **Go**.
6. This creates the database `optical_store` and populates all tables with realistic sample data matching the screenshots.

*Note on JDBC Configuration:*  
Default credentials in `DBConnection.java`:
- Host: `localhost:3306`
- Database: `optical_store`
- Username: `root`
- Password: `""` (blank, default in XAMPP)

---

### Step 2: Open in Visual Studio Code
1. Open Visual Studio Code.
2. Select **File > Open Folder...** and choose `OpticalStoreManagementSystem`.
3. Recommended VS Code Extensions:
   - **Extension Pack for Java** (Microsoft)
   - **Tomcat for Java** / **Community Server Connectors**
   - **Maven for Java**

---

### Step 3: Build the Project with Maven
Open the terminal in VS Code (or PowerShell) in the `OpticalStoreManagementSystem` directory and run:
```bash
mvn clean package
```
This generates the deployable artifact:
`target/OpticalStoreManagementSystem.war`

---

### Step 4: Deploy on Apache Tomcat 10.1
1. Ensure you have **Apache Tomcat 10.1.x** (which implements Jakarta EE 10 / Servlet 6.0 / JSP 3.1).
2. Copy the generated `OpticalStoreManagementSystem.war` file to your Tomcat `webapps/` folder:
   ```
   <Tomcat_Home>/webapps/OpticalStoreManagementSystem.war
   ```
3. Start Tomcat:
   - On Windows: Run `<Tomcat_Home>/bin/startup.bat`
4. Tomcat will automatically unpack the WAR.

---

### Step 5: Access the Website
Open your web browser and navigate to:
```
http://localhost:8080/OpticalStoreManagementSystem/
```

---

## 6. Default Login Credentials

### Customer Portal:
- **Email:** `customer.a@example.com`
- **Password:** `customer123`
- *(Additional customer accounts: `customer.b@example.com`, `customer.c@example.com`)*

### Admin Portal:
- **URL:** `http://localhost:8080/OpticalStoreManagementSystem/login?role=admin`
- **Username:** `admin`
- **Password:** `admin123`
