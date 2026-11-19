package com.opticalstore.controller;

import com.opticalstore.model.Customer;
import com.opticalstore.service.OpticalStoreService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;

@WebServlet(urlPatterns = {"/register"})
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final OpticalStoreService service = new OpticalStoreService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/register.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String name = request.getParameter("fullName");
        if (name == null || name.trim().isEmpty()) {
            name = request.getParameter("name");
        }
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String password = request.getParameter("password");
        String address = request.getParameter("address");

        if (name == null || name.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Full name, email, and password are required.");
            request.setAttribute("name", name);
            request.setAttribute("email", email);
            request.setAttribute("phone", phone);
            request.getRequestDispatcher("/register.jsp").forward(request, response);
            return;
        }

        Customer customer = new Customer(name.trim(), email.trim(),
                phone != null ? phone.trim() : "",
                address != null ? address.trim() : "",
                password.trim());

        boolean success = service.registerCustomer(customer);
        if (success) {
            HttpSession session = request.getSession(true);
            session.setAttribute("customer", customer);
            session.setAttribute("userRole", "CUSTOMER");
            session.setAttribute("userName", customer.getName());
            session.setAttribute("customerId", customer.getCustomerId());
            response.sendRedirect(request.getContextPath() + "/customer-dashboard?registered=true");
        } else {
            request.setAttribute("errorMessage", "An account with this email address already exists.");
            request.setAttribute("name", name);
            request.setAttribute("email", email);
            request.setAttribute("phone", phone);
            request.getRequestDispatcher("/register.jsp").forward(request, response);
        }
    }
}
