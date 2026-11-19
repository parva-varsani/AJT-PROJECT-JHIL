package com.opticalstore.dao;

import com.opticalstore.model.Order;
import com.opticalstore.model.OrderDetail;
import com.opticalstore.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class OrderDAO {

    private static final List<Order> mockOrders = new CopyOnWriteArrayList<>();

    static {
        // Order 1: #OS-1024
        Order o1 = new Order();
        o1.setOrderId(1);
        o1.setOrderCode("#OS-1024");
        o1.setCustomerId(1);
        o1.setCustomerName("Customer A");
        o1.setOrderDate(Date.valueOf("2026-11-02"));
        o1.setTotalAmount(new BigDecimal("1850.00"));
        o1.setStatus("Processing");
        o1.setItemsSummary("Classic frame");
        o1.getOrderDetails().add(new OrderDetail(1, 1, 1, "Classic Everyday Frame", 1, new BigDecimal("1850.00")));
        mockOrders.add(o1);

        // Order 2: #OS-1023
        Order o2 = new Order();
        o2.setOrderId(2);
        o2.setOrderCode("#OS-1023");
        o2.setCustomerId(2);
        o2.setCustomerName("Customer B");
        o2.setOrderDate(Date.valueOf("2026-11-01"));
        o2.setTotalAmount(new BigDecimal("2400.00"));
        o2.setStatus("Confirmed");
        o2.setItemsSummary("UV protection");
        o2.getOrderDetails().add(new OrderDetail(2, 2, 2, "UV protection", 1, new BigDecimal("2400.00")));
        mockOrders.add(o2);

        // Order 3: #OS-1022
        Order o3 = new Order();
        o3.setOrderId(3);
        o3.setOrderCode("#OS-1022");
        o3.setCustomerId(3);
        o3.setCustomerName("Customer C");
        o3.setOrderDate(Date.valueOf("2026-10-31"));
        o3.setTotalAmount(new BigDecimal("980.00"));
        o3.setStatus("Delivered");
        o3.setItemsSummary("Daily lens pack");
        o3.getOrderDetails().add(new OrderDetail(3, 3, 3, "Daily lens pack", 1, new BigDecimal("980.00")));
        mockOrders.add(o3);

        // Order 4: #OS-1018
        Order o4 = new Order();
        o4.setOrderId(4);
        o4.setOrderCode("#OS-1018");
        o4.setCustomerId(2);
        o4.setCustomerName("Customer B");
        o4.setOrderDate(Date.valueOf("2026-10-27"));
        o4.setTotalAmount(new BigDecimal("2400.00"));
        o4.setStatus("Delivered");
        o4.setItemsSummary("Blue-light glasses");
        o4.getOrderDetails().add(new OrderDetail(4, 4, 5, "Blue-light glasses", 1, new BigDecimal("2400.00")));
        mockOrders.add(o4);

        // Order 5: #OS-1009
        Order o5 = new Order();
        o5.setOrderId(5);
        o5.setOrderCode("#OS-1009");
        o5.setCustomerId(3);
        o5.setCustomerName("Customer C");
        o5.setOrderDate(Date.valueOf("2026-10-15"));
        o5.setTotalAmount(new BigDecimal("980.00"));
        o5.setStatus("Delivered");
        o5.setItemsSummary("Daily lens pack");
        o5.getOrderDetails().add(new OrderDetail(5, 5, 3, "Daily lens pack", 1, new BigDecimal("980.00")));
        mockOrders.add(o5);
    }

    public List<Order> getAllOrders() {
        List<Order> list = new ArrayList<>();
        String sql = "SELECT o.*, c.name AS customer_name FROM orders o " +
                     "LEFT JOIN customer c ON o.customer_id = c.customer_id " +
                     "ORDER BY o.order_id DESC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Order order = mapResultSetToOrder(rs);
                loadOrderDetails(conn, order);
                list.add(order);
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (OrderDAO.getAllOrders fallback): " + e.getMessage());
        }

        return new ArrayList<>(mockOrders);
    }

    public List<Order> getOrdersByCustomer(int customerId) {
        List<Order> list = new ArrayList<>();
        String sql = "SELECT o.*, c.name AS customer_name FROM orders o " +
                     "LEFT JOIN customer c ON o.customer_id = c.customer_id " +
                     "WHERE o.customer_id = ? ORDER BY o.order_id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Order order = mapResultSetToOrder(rs);
                    loadOrderDetails(conn, order);
                    list.add(order);
                }
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (OrderDAO.getOrdersByCustomer fallback): " + e.getMessage());
        }

        List<Order> customerOrders = new ArrayList<>();
        for (Order o : mockOrders) {
            if (o.getCustomerId() == customerId) {
                customerOrders.add(o);
            }
        }
        return customerOrders;
    }

    public Order getOrderById(int orderId) {
        String sql = "SELECT o.*, c.name AS customer_name FROM orders o " +
                     "LEFT JOIN customer c ON o.customer_id = c.customer_id " +
                     "WHERE o.order_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Order order = mapResultSetToOrder(rs);
                    loadOrderDetails(conn, order);
                    return order;
                }
            }
        } catch (Exception e) {
            System.err.println("DB Notice (OrderDAO.getOrderById fallback): " + e.getMessage());
        }

        for (Order o : mockOrders) {
            if (o.getOrderId() == orderId) {
                return o;
            }
        }
        return null;
    }

    public Order getOrderByCode(String orderCode) {
        String sql = "SELECT o.*, c.name AS customer_name FROM orders o " +
                     "LEFT JOIN customer c ON o.customer_id = c.customer_id " +
                     "WHERE o.order_code = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, orderCode);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Order order = mapResultSetToOrder(rs);
                    loadOrderDetails(conn, order);
                    return order;
                }
            }
        } catch (Exception e) {
            System.err.println("DB Notice (OrderDAO.getOrderByCode fallback): " + e.getMessage());
        }

        for (Order o : mockOrders) {
            if (o.getOrderCode().equalsIgnoreCase(orderCode)) {
                return o;
            }
        }
        return null;
    }

    public boolean placeOrder(Order order) {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            String orderCode = "#OS-" + (1025 + (int)(Math.random() * 500));
            order.setOrderCode(orderCode);
            order.setOrderDate(new Date(System.currentTimeMillis()));
            order.setStatus("Processing");

            String sql = "INSERT INTO orders (order_code, customer_id, order_date, total_amount, status, items_summary) VALUES (?, ?, ?, ?, ?, ?)";
            try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, order.getOrderCode());
                ps.setInt(2, order.getCustomerId());
                ps.setDate(3, order.getOrderDate());
                ps.setBigDecimal(4, order.getTotalAmount());
                ps.setString(5, order.getStatus());
                ps.setString(6, order.getItemsSummary());
                ps.executeUpdate();
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        order.setOrderId(rs.getInt(1));
                    }
                }
            }

            // Insert details
            String detailSql = "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
            try (PreparedStatement dps = conn.prepareStatement(detailSql)) {
                for (OrderDetail d : order.getOrderDetails()) {
                    dps.setInt(1, order.getOrderId());
                    dps.setInt(2, d.getProductId());
                    dps.setInt(3, d.getQuantity());
                    dps.setBigDecimal(4, d.getPrice());
                    dps.addBatch();
                }
                dps.executeBatch();
            }

            // Create bill
            String billCode = "#INV-" + order.getOrderCode().replace("#OS-", "");
            String billSql = "INSERT INTO bill (bill_code, order_id, bill_date, subtotal, tax_amount, amount, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement bps = conn.prepareStatement(billSql)) {
                bps.setString(1, billCode);
                bps.setInt(2, order.getOrderId());
                bps.setDate(3, order.getOrderDate());
                bps.setBigDecimal(4, order.getTotalAmount());
                bps.setBigDecimal(5, BigDecimal.ZERO);
                bps.setBigDecimal(6, order.getTotalAmount());
                bps.setString(7, "Paid");
                bps.executeUpdate();
            }

            // Update product stock
            String stockSql = "UPDATE product SET quantity = GREATEST(quantity - ?, 0) WHERE product_id = ?";
            try (PreparedStatement sps = conn.prepareStatement(stockSql)) {
                for (OrderDetail d : order.getOrderDetails()) {
                    sps.setInt(1, d.getQuantity());
                    sps.setInt(2, d.getProductId());
                    sps.addBatch();
                }
                sps.executeBatch();
            }

            conn.commit();
            return true;
        } catch (Exception e) {
            System.err.println("DB Notice (OrderDAO.placeOrder fallback): " + e.getMessage());
            if (conn != null) {
                try { conn.rollback(); } catch (Exception ignored) {}
            }
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (Exception ignored) {}
            }
        }

        // Mock fallback
        order.setOrderId(mockOrders.size() + 1);
        if (order.getOrderCode() == null) {
            order.setOrderCode("#OS-" + (1025 + (int)(Math.random() * 500)));
        }
        if (order.getOrderDate() == null) {
            order.setOrderDate(new Date(System.currentTimeMillis()));
        }
        order.setStatus("Processing");
        mockOrders.add(0, order);
        return true;
    }

    public boolean updateStatus(int orderId, String newStatus) {
        String sql = "UPDATE orders SET status = ? WHERE order_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, newStatus);
            ps.setInt(2, orderId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            System.err.println("DB Notice (OrderDAO.updateStatus fallback): " + e.getMessage());
        }

        for (Order o : mockOrders) {
            if (o.getOrderId() == orderId) {
                o.setStatus(newStatus);
                return true;
            }
        }
        return false;
    }

    public int getTotalCount() {
        String sql = "SELECT COUNT(*) FROM orders";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) {
            System.err.println("DB Notice (OrderDAO.getTotalCount fallback): " + e.getMessage());
        }
        return mockOrders.size();
    }

    public BigDecimal getTotalSales() {
        String sql = "SELECT SUM(total_amount) FROM orders";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next() && rs.getBigDecimal(1) != null) {
                return rs.getBigDecimal(1);
            }
        } catch (Exception e) {
            System.err.println("DB Notice (OrderDAO.getTotalSales fallback): " + e.getMessage());
        }

        BigDecimal sum = BigDecimal.ZERO;
        for (Order o : mockOrders) {
            if (o.getTotalAmount() != null) {
                sum = sum.add(o.getTotalAmount());
            }
        }
        return sum;
    }

    private void loadOrderDetails(Connection conn, Order order) {
        String sql = "SELECT od.*, p.product_name, p.category FROM order_details od " +
                     "LEFT JOIN product p ON od.product_id = p.product_id " +
                     "WHERE od.order_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, order.getOrderId());
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    OrderDetail d = new OrderDetail();
                    d.setOrderDetailId(rs.getInt("order_detail_id"));
                    d.setOrderId(rs.getInt("order_id"));
                    d.setProductId(rs.getInt("product_id"));
                    d.setProductName(rs.getString("product_name"));
                    d.setCategory(rs.getString("category"));
                    d.setQuantity(rs.getInt("quantity"));
                    d.setPrice(rs.getBigDecimal("price"));
                    order.getOrderDetails().add(d);
                }
            }
        } catch (Exception ignored) {}
    }

    private Order mapResultSetToOrder(ResultSet rs) throws SQLException {
        Order o = new Order();
        o.setOrderId(rs.getInt("order_id"));
        o.setOrderCode(rs.getString("order_code"));
        o.setCustomerId(rs.getInt("customer_id"));
        try {
            o.setCustomerName(rs.getString("customer_name"));
        } catch (Exception ignored) {}
        o.setOrderDate(rs.getDate("order_date"));
        o.setTotalAmount(rs.getBigDecimal("total_amount"));
        o.setStatus(rs.getString("status"));
        o.setItemsSummary(rs.getString("items_summary"));
        return o;
    }
}
