package com.opticalstore.controller;

import com.opticalstore.model.Admin;
import com.opticalstore.model.Customer;
import com.opticalstore.service.OpticalStoreService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet(urlPatterns = {"/login", "/logout"})
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final OpticalStoreService service = new OpticalStoreService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String servletPath = request.getServletPath();

        if ("/logout".equals(servletPath)) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            response.sendRedirect(request.getContextPath() + "/login?logout=true");
            return;
        }

        // Check if already logged in
        HttpSession session = request.getSession(false);
        if (session != null) {
            if (session.getAttribute("customer") != null) {
                response.sendRedirect(request.getContextPath() + "/customer-dashboard");
                return;
            } else if (session.getAttribute("admin") != null) {
                response.sendRedirect(request.getContextPath() + "/admin-dashboard");
                return;
            }
        }

        request.getRequestDispatcher("/login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String role = request.getParameter("role"); // "customer" or "admin"
        String emailOrUser = request.getParameter("email");
        String password = request.getParameter("password");

        if (emailOrUser == null || emailOrUser.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Please provide both credentials.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
            return;
        }

        emailOrUser = emailOrUser.trim();
        password = password.trim();

        // 1. Check if trying admin login or if role is admin
        if ("admin".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(emailOrUser)) {
            Admin admin = service.authenticateAdmin(emailOrUser, password);
            if (admin != null) {
                HttpSession session = request.getSession(true);
                session.setAttribute("admin", admin);
                session.setAttribute("userRole", "ADMIN");
                session.setAttribute("userName", admin.getFullName());
                response.sendRedirect(request.getContextPath() + "/admin-dashboard");
                return;
            }
        }

        // 2. Customer login
        Customer customer = service.authenticateCustomer(emailOrUser, password);
        if (customer != null) {
            HttpSession session = request.getSession(true);
            session.setAttribute("customer", customer);
            session.setAttribute("userRole", "CUSTOMER");
            session.setAttribute("userName", customer.getName());
            session.setAttribute("customerId", customer.getCustomerId());
            response.sendRedirect(request.getContextPath() + "/customer-dashboard");
            return;
        }

        // 3. Fallback check: maybe an admin typed username in standard login box
        Admin fallbackAdmin = service.authenticateAdmin(emailOrUser, password);
        if (fallbackAdmin != null) {
            HttpSession session = request.getSession(true);
            session.setAttribute("admin", fallbackAdmin);
            session.setAttribute("userRole", "ADMIN");
            session.setAttribute("userName", fallbackAdmin.getFullName());
            response.sendRedirect(request.getContextPath() + "/admin-dashboard");
            return;
        }

        request.setAttribute("errorMessage", "Invalid email/username or password. Please try again.");
        request.setAttribute("enteredEmail", emailOrUser);
        request.getRequestDispatcher("/login.jsp").forward(request, response);
    }
}
