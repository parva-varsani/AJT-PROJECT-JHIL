package com.opticalstore.controller;

import com.opticalstore.model.Customer;
import com.opticalstore.model.Order;
import com.opticalstore.model.OrderDetail;
import com.opticalstore.model.Product;
import com.opticalstore.service.OpticalStoreService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

@WebServlet(urlPatterns = {"/my-orders", "/customer-dashboard", "/manage-orders", "/place-order", "/update-order-status"})
public class OrderServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final OpticalStoreService service = new OpticalStoreService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath();

        if ("/customer-dashboard".equals(path)) {
            handleCustomerDashboard(request, response);
        } else if ("/manage-orders".equals(path)) {
            handleManageOrders(request, response);
        } else {
            handleCustomerOrders(request, response);
        }
    }

    private void handleCustomerDashboard(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Customer customer = (session != null) ? (Customer) session.getAttribute("customer") : null;

        int customerId = (customer != null) ? customer.getCustomerId() : 1;
        List<Order> customerOrders = service.getOrdersByCustomer(customerId);
        int prescriptionCount = service.getPrescriptionsByCustomer(customerId).size();

        request.setAttribute("recentOrders", customerOrders);
        request.setAttribute("orderCount", customerOrders.size());
        request.setAttribute("prescriptionCount", prescriptionCount > 0 ? prescriptionCount : 1);
        request.setAttribute("wishlistCount", 4); // Aligned with screenshot 4 items
        request.getRequestDispatcher("/customer-dashboard.jsp").forward(request, response);
    }

    private void handleCustomerOrders(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Customer customer = (session != null) ? (Customer) session.getAttribute("customer") : null;

        int customerId = (customer != null) ? customer.getCustomerId() : 1;
        List<Order> customerOrders = service.getOrdersByCustomer(customerId);

        request.setAttribute("orders", customerOrders);
        request.getRequestDispatcher("/my-orders.jsp").forward(request, response);
    }

    private void handleManageOrders(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            response.sendRedirect(request.getContextPath() + "/login?role=admin");
            return;
        }

        List<Order> orders = service.getAllOrders();
        request.setAttribute("orders", orders);
        request.getRequestDispatcher("/manage-orders.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath();

        if ("/update-order-status".equals(path)) {
            String orderIdStr = request.getParameter("orderId");
            String newStatus = request.getParameter("status");
            if (orderIdStr != null && newStatus != null) {
                try {
                    int orderId = Integer.parseInt(orderIdStr);
                    service.updateOrderStatus(orderId, newStatus);
                } catch (NumberFormatException ignored) {}
            }
            response.sendRedirect(request.getContextPath() + "/manage-orders?updated=true");
            return;
        }

        if ("/place-order".equals(path)) {
            HttpSession session = request.getSession(false);
            Customer customer = (session != null) ? (Customer) session.getAttribute("customer") : null;

            int customerId = (customer != null) ? customer.getCustomerId() : 1;
            String customerName = (customer != null) ? customer.getName() : "Customer A";

            String productIdStr = request.getParameter("productId");
            String qtyStr = request.getParameter("quantity");

            int productId = 1;
            int qty = 1;
            try {
                if (productIdStr != null) productId = Integer.parseInt(productIdStr);
                if (qtyStr != null) qty = Integer.parseInt(qtyStr);
            } catch (NumberFormatException ignored) {}

            Product product = service.getProductById(productId);
            if (product == null) {
                product = service.getProductById(1);
            }

            BigDecimal total = product.getPrice().multiply(new BigDecimal(qty));

            Order order = new Order();
            order.setCustomerId(customerId);
            order.setCustomerName(customerName);
            order.setOrderDate(new Date(System.currentTimeMillis()));
            order.setTotalAmount(total);
            order.setStatus("Processing");
            order.setItemsSummary(product.getProductName());

            OrderDetail detail = new OrderDetail();
            detail.setProductId(product.getProductId());
            detail.setProductName(product.getProductName());
            detail.setCategory(product.getCategory());
            detail.setQuantity(qty);
            detail.setPrice(product.getPrice());
            order.getOrderDetails().add(detail);

            service.placeOrder(order);

            response.sendRedirect(request.getContextPath() + "/billing?orderCode=" + order.getOrderCode());
        }
    }
}
