export type TomcatVersion = 'tomcat10' | 'tomcat9';

export interface ProjectFile {
  path: string;
  folder: 'Source Packages' | 'Web Pages' | 'Configuration Files' | 'Database SQL';
  language: 'java' | 'jsp' | 'css' | 'js' | 'xml' | 'sql';
  content: string;
}

export function getJavaFiles(tomcatVersion: TomcatVersion): ProjectFile[] {
  const pkg = tomcatVersion === 'tomcat10' ? 'jakarta' : 'javax';

  return [
    {
      path: 'src/java/opticalcare/DBConnection.java',
      folder: 'Source Packages',
      language: 'java',
      content: `package opticalcare;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

    public static Connection getConnection() {
        Connection con = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/optical_store",
                "root",
                ""
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
        return con;
    }
}
`,
    },
    {
      path: 'src/java/opticalcare/LoginServlet.java',
      folder: 'Source Packages',
      language: 'java',
      content: `package opticalcare;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import ${pkg}.servlet.ServletException;
import ${pkg}.servlet.annotation.WebServlet;
import ${pkg}.servlet.http.HttpServlet;
import ${pkg}.servlet.http.HttpServletRequest;
import ${pkg}.servlet.http.HttpServletResponse;
import ${pkg}.servlet.http.HttpSession;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if ("admin".equalsIgnoreCase(email) && "admin123".equals(password)) {
            HttpSession session = request.getSession();
            session.setAttribute("userName", "Admin");
            session.setAttribute("userRole", "ADMIN");
            response.sendRedirect("admin-dashboard.jsp");
            return;
        }

        try {
            Connection con = DBConnection.getConnection();
            PreparedStatement ps = con.prepareStatement(
                "SELECT * FROM customers WHERE email = ? AND password = ?"
            );
            ps.setString(1, email);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                HttpSession session = request.getSession();
                session.setAttribute("customerId", rs.getInt("id"));
                session.setAttribute("userName", rs.getString("name"));
                session.setAttribute("userRole", "CUSTOMER");
                response.sendRedirect("customer-dashboard.jsp");
            } else {
                response.sendRedirect("login.jsp?error=1");
            }
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("login.jsp?error=1");
        }
    }
}
`,
    },
    {
      path: 'src/java/opticalcare/LogoutServlet.java',
      folder: 'Source Packages',
      language: 'java',
      content: `package opticalcare;

import java.io.IOException;
import ${pkg}.servlet.ServletException;
import ${pkg}.servlet.annotation.WebServlet;
import ${pkg}.servlet.http.HttpServlet;
import ${pkg}.servlet.http.HttpServletRequest;
import ${pkg}.servlet.http.HttpServletResponse;
import ${pkg}.servlet.http.HttpSession;

@WebServlet("/LogoutServlet")
public class LogoutServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        response.sendRedirect("index.jsp");
    }
}
`,
    },
    {
      path: 'src/java/opticalcare/RegisterServlet.java',
      folder: 'Source Packages',
      language: 'java',
      content: `package opticalcare;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import ${pkg}.servlet.ServletException;
import ${pkg}.servlet.annotation.WebServlet;
import ${pkg}.servlet.http.HttpServlet;
import ${pkg}.servlet.http.HttpServletRequest;
import ${pkg}.servlet.http.HttpServletResponse;

@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("fullName");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String password = request.getParameter("password");

        try {
            Connection con = DBConnection.getConnection();
            PreparedStatement ps = con.prepareStatement(
                "INSERT INTO customers (name, email, phone, password) VALUES (?, ?, ?, ?)"
            );
            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, phone);
            ps.setString(4, password);
            ps.executeUpdate();
            con.close();

            response.sendRedirect("login.jsp?registered=1");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("register.jsp?error=1");
        }
    }
}
`,
    },
    {
      path: 'src/java/opticalcare/PrescriptionServlet.java',
      folder: 'Source Packages',
      language: 'java',
      content: `package opticalcare;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import ${pkg}.servlet.ServletException;
import ${pkg}.servlet.annotation.WebServlet;
import ${pkg}.servlet.http.HttpServlet;
import ${pkg}.servlet.http.HttpServletRequest;
import ${pkg}.servlet.http.HttpServletResponse;
import ${pkg}.servlet.http.HttpSession;

@WebServlet("/PrescriptionServlet")
public class PrescriptionServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");

        try {
            Connection con = DBConnection.getConnection();

            if ("review".equals(action)) {
                int id = Integer.parseInt(request.getParameter("id"));
                PreparedStatement ps = con.prepareStatement(
                    "UPDATE prescriptions SET status = 'Reviewed' WHERE id = ?"
                );
                ps.setInt(1, id);
                ps.executeUpdate();
                con.close();
                response.sendRedirect("manage-prescriptions.jsp?updated=1");
                return;
            }

            HttpSession session = request.getSession(false);
            String customerName = "Customer A";
            if (session != null && session.getAttribute("userName") != null) {
                customerName = (String) session.getAttribute("userName");
            }

            String recordCode = "RX-" + (1000 + (int) (Math.random() * 9000));
            String rightSph = request.getParameter("rightSph");
            String rightCyl = request.getParameter("rightCyl");
            String rightAxis = request.getParameter("rightAxis");
            String rightAdd = request.getParameter("rightAdd");
            String leftSph = request.getParameter("leftSph");
            String leftCyl = request.getParameter("leftCyl");
            String leftAxis = request.getParameter("leftAxis");
            String leftAdd = request.getParameter("leftAdd");

            PreparedStatement ps = con.prepareStatement(
                "INSERT INTO prescriptions (record_code, customer_name, rx_date, right_sph, right_cyl, right_axis, right_add, left_sph, left_cyl, left_axis, left_add, status) VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted')"
            );
            ps.setString(1, recordCode);
            ps.setString(2, customerName);
            ps.setString(3, rightSph);
            ps.setString(4, rightCyl);
            ps.setString(5, rightAxis);
            ps.setString(6, rightAdd);
            ps.setString(7, leftSph);
            ps.setString(8, leftCyl);
            ps.setString(9, leftAxis);
            ps.setString(10, leftAdd);
            ps.executeUpdate();
            con.close();

            response.sendRedirect("prescription-form.jsp?saved=1");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("prescription-form.jsp?error=1");
        }
    }
}
`,
    },
    {
      path: 'src/java/opticalcare/OrderServlet.java',
      folder: 'Source Packages',
      language: 'java',
      content: `package opticalcare;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import ${pkg}.servlet.ServletException;
import ${pkg}.servlet.annotation.WebServlet;
import ${pkg}.servlet.http.HttpServlet;
import ${pkg}.servlet.http.HttpServletRequest;
import ${pkg}.servlet.http.HttpServletResponse;
import ${pkg}.servlet.http.HttpSession;

@WebServlet("/OrderServlet")
public class OrderServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");

        try {
            Connection con = DBConnection.getConnection();

            if ("update".equals(action)) {
                int id = Integer.parseInt(request.getParameter("id"));
                String status = request.getParameter("status");
                PreparedStatement ps = con.prepareStatement(
                    "UPDATE orders SET status = ? WHERE id = ?"
                );
                ps.setString(1, status);
                ps.setInt(2, id);
                ps.executeUpdate();
                con.close();
                response.sendRedirect("manage-orders.jsp?updated=1");
                return;
            }

            HttpSession session = request.getSession(false);
            String customerName = "Customer A";
            if (session != null && session.getAttribute("userName") != null) {
                customerName = (String) session.getAttribute("userName");
            }

            String productName = request.getParameter("productName");
            int price = Integer.parseInt(request.getParameter("price"));
            int quantity = Integer.parseInt(request.getParameter("quantity"));
            int total = price * quantity;
            String orderCode = "#OS-" + (1025 + (int) (Math.random() * 900));

            PreparedStatement ps = con.prepareStatement(
                "INSERT INTO orders (order_code, customer_name, product_name, quantity, order_date, total_amount, status) VALUES (?, ?, ?, ?, CURDATE(), ?, 'Processing')",
                Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, orderCode);
            ps.setString(2, customerName);
            ps.setString(3, productName);
            ps.setInt(4, quantity);
            ps.setInt(5, total);
            ps.executeUpdate();

            int newOrderId = 1;
            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                newOrderId = rs.getInt(1);
            }
            con.close();

            response.sendRedirect("billing.jsp?id=" + newOrderId);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("products.jsp");
        }
    }
}
`,
    },
    {
      path: 'src/java/opticalcare/InventoryServlet.java',
      folder: 'Source Packages',
      language: 'java',
      content: `package opticalcare;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import ${pkg}.servlet.ServletException;
import ${pkg}.servlet.annotation.WebServlet;
import ${pkg}.servlet.http.HttpServlet;
import ${pkg}.servlet.http.HttpServletRequest;
import ${pkg}.servlet.http.HttpServletResponse;

@WebServlet("/InventoryServlet")
public class InventoryServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String productName = request.getParameter("productName");
        String category = request.getParameter("category");
        int available = Integer.parseInt(request.getParameter("available"));
        int reorderLevel = Integer.parseInt(request.getParameter("reorderLevel"));

        try {
            Connection con = DBConnection.getConnection();
            PreparedStatement ps = con.prepareStatement(
                "INSERT INTO inventory (product_name, category, available, reorder_level) VALUES (?, ?, ?, ?)"
            );
            ps.setString(1, productName);
            ps.setString(2, category);
            ps.setInt(3, available);
            ps.setInt(4, reorderLevel);
            ps.executeUpdate();
            con.close();

            response.sendRedirect("manage-inventory.jsp?added=1");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("manage-inventory.jsp?error=1");
        }
    }
}
`,
    },
  ];
}
