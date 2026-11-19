package com.opticalstore.dao;

import com.opticalstore.model.Bill;
import com.opticalstore.model.OrderDetail;
import com.opticalstore.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class BillingDAO {

    private static final List<Bill> mockBills = new CopyOnWriteArrayList<>();

    static {
        // Bill #INV-1024 matching Image 12
        Bill b1 = new Bill();
        b1.setBillId(1);
        b1.setBillCode("#INV-1024");
        b1.setOrderId(1);
        b1.setOrderCode("#OS-1024");
        b1.setCustomerName("Customer A");
        b1.setCustomerEmail("customer.a@example.com");
        b1.setCustomerPhone("9876543210");
        b1.setCustomerAddress("120 Ring Road, Ahmedabad");
        b1.setBillDate(Date.valueOf("2026-11-02"));
        b1.setSubtotal(new BigDecimal("1850.00"));
        b1.setTaxAmount(BigDecimal.ZERO);
        b1.setAmount(new BigDecimal("1850.00"));
        b1.setPaymentStatus("Paid");
        b1.getItems().add(new OrderDetail(1, 1, 1, "Classic Everyday Frame", 1, new BigDecimal("1850.00")));
        mockBills.add(b1);

        // Bill #INV-1023
        Bill b2 = new Bill();
        b2.setBillId(2);
        b2.setBillCode("#INV-1023");
        b2.setOrderId(2);
        b2.setOrderCode("#OS-1023");
        b2.setCustomerName("Customer B");
        b2.setCustomerEmail("customer.b@example.com");
        b2.setCustomerPhone("9876543211");
        b2.setCustomerAddress("45 Satellite, Ahmedabad");
        b2.setBillDate(Date.valueOf("2026-11-01"));
        b2.setSubtotal(new BigDecimal("2400.00"));
        b2.setTaxAmount(BigDecimal.ZERO);
        b2.setAmount(new BigDecimal("2400.00"));
        b2.setPaymentStatus("Paid");
        b2.getItems().add(new OrderDetail(2, 2, 2, "UV protection", 1, new BigDecimal("2400.00")));
        mockBills.add(b2);

        // Bill #INV-1022
        Bill b3 = new Bill();
        b3.setBillId(3);
        b3.setBillCode("#INV-1022");
        b3.setOrderId(3);
        b3.setOrderCode("#OS-1022");
        b3.setCustomerName("Customer C");
        b3.setCustomerEmail("customer.c@example.com");
        b3.setCustomerPhone("9876543212");
        b3.setCustomerAddress("78 CG Road, Ahmedabad");
        b3.setBillDate(Date.valueOf("2026-10-31"));
        b3.setSubtotal(new BigDecimal("980.00"));
        b3.setTaxAmount(BigDecimal.ZERO);
        b3.setAmount(new BigDecimal("980.00"));
        b3.setPaymentStatus("Paid");
        b3.getItems().add(new OrderDetail(3, 3, 3, "Daily lens pack", 1, new BigDecimal("980.00")));
        mockBills.add(b3);
    }

    public List<Bill> getAllBills() {
        List<Bill> list = new ArrayList<>();
        String sql = "SELECT b.*, o.order_code, c.name AS customer_name, c.email AS customer_email, " +
                     "c.phone AS customer_phone, c.address AS customer_address " +
                     "FROM bill b " +
                     "JOIN orders o ON b.order_id = o.order_id " +
                     "JOIN customer c ON o.customer_id = c.customer_id " +
                     "ORDER BY b.bill_id DESC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Bill b = mapResultSetToBill(rs);
                loadBillItems(conn, b);
                list.add(b);
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (BillingDAO.getAllBills fallback): " + e.getMessage());
        }

        return new ArrayList<>(mockBills);
    }

    public Bill getBillById(int billId) {
        String sql = "SELECT b.*, o.order_code, c.name AS customer_name, c.email AS customer_email, " +
                     "c.phone AS customer_phone, c.address AS customer_address " +
                     "FROM bill b " +
                     "JOIN orders o ON b.order_id = o.order_id " +
                     "JOIN customer c ON o.customer_id = c.customer_id " +
                     "WHERE b.bill_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, billId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Bill b = mapResultSetToBill(rs);
                    loadBillItems(conn, b);
                    return b;
                }
            }
        } catch (Exception e) {
            System.err.println("DB Notice (BillingDAO.getBillById fallback): " + e.getMessage());
        }

        for (Bill b : mockBills) {
            if (b.getBillId() == billId) {
                return b;
            }
        }
        return null;
    }

    public Bill getBillByOrderId(int orderId) {
        String sql = "SELECT b.*, o.order_code, c.name AS customer_name, c.email AS customer_email, " +
                     "c.phone AS customer_phone, c.address AS customer_address " +
                     "FROM bill b " +
                     "JOIN orders o ON b.order_id = o.order_id " +
                     "JOIN customer c ON o.customer_id = c.customer_id " +
                     "WHERE b.order_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Bill b = mapResultSetToBill(rs);
                    loadBillItems(conn, b);
                    return b;
                }
            }
        } catch (Exception e) {
            System.err.println("DB Notice (BillingDAO.getBillByOrderId fallback): " + e.getMessage());
        }

        for (Bill b : mockBills) {
            if (b.getOrderId() == orderId) {
                return b;
            }
        }
        return null;
    }

    public Bill getBillByCode(String billCode) {
        String sql = "SELECT b.*, o.order_code, c.name AS customer_name, c.email AS customer_email, " +
                     "c.phone AS customer_phone, c.address AS customer_address " +
                     "FROM bill b " +
                     "JOIN orders o ON b.order_id = o.order_id " +
                     "JOIN customer c ON o.customer_id = c.customer_id " +
                     "WHERE b.bill_code = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, billCode);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Bill b = mapResultSetToBill(rs);
                    loadBillItems(conn, b);
                    return b;
                }
            }
        } catch (Exception e) {
            System.err.println("DB Notice (BillingDAO.getBillByCode fallback): " + e.getMessage());
        }

        for (Bill b : mockBills) {
            if (b.getBillCode().equalsIgnoreCase(billCode)) {
                return b;
            }
        }
        return null;
    }

    private void loadBillItems(Connection conn, Bill bill) {
        String sql = "SELECT od.*, p.product_name, p.category FROM order_details od " +
                     "LEFT JOIN product p ON od.product_id = p.product_id " +
                     "WHERE od.order_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, bill.getOrderId());
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
                    bill.getItems().add(d);
                }
            }
        } catch (Exception ignored) {}
    }

    private Bill mapResultSetToBill(ResultSet rs) throws SQLException {
        Bill b = new Bill();
        b.setBillId(rs.getInt("bill_id"));
        b.setBillCode(rs.getString("bill_code"));
        b.setOrderId(rs.getInt("order_id"));
        b.setOrderCode(rs.getString("order_code"));
        b.setCustomerName(rs.getString("customer_name"));
        b.setCustomerEmail(rs.getString("customer_email"));
        b.setCustomerPhone(rs.getString("customer_phone"));
        b.setCustomerAddress(rs.getString("customer_address"));
        b.setBillDate(rs.getDate("bill_date"));
        b.setSubtotal(rs.getBigDecimal("subtotal"));
        b.setTaxAmount(rs.getBigDecimal("tax_amount"));
        b.setAmount(rs.getBigDecimal("amount"));
        b.setPaymentStatus(rs.getString("payment_status"));
        return b;
    }
}
