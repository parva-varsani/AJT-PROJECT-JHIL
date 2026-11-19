package com.opticalstore.dao;

import com.opticalstore.model.Customer;
import com.opticalstore.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class CustomerDAO {

    // In-memory fallback list matching seeds
    private static final List<Customer> mockCustomers = new CopyOnWriteArrayList<>();

    static {
        mockCustomers.add(new Customer(1, "Customer A", "customer.a@example.com", "9876543210", "120 Ring Road, Ahmedabad", "customer123"));
        mockCustomers.add(new Customer(2, "Customer B", "customer.b@example.com", "9876543211", "45 Satellite, Ahmedabad", "customer123"));
        mockCustomers.add(new Customer(3, "Customer C", "customer.c@example.com", "9876543212", "78 CG Road, Ahmedabad", "customer123"));
        mockCustomers.add(new Customer(4, "Raval Jhil", "jhil@example.com", "9876543213", "B-12 Vastrapur, Ahmedabad", "jhil123"));
        mockCustomers.add(new Customer(5, "Kachhadiya Zarna", "zarna@example.com", "9876543214", "A-34 Bodakdev, Ahmedabad", "zarna123"));
        mockCustomers.add(new Customer(6, "Jani Neev", "neev@example.com", "9876543215", "C-56 Thaltej, Ahmedabad", "neev123"));
    }

    public boolean register(Customer customer) {
        String sql = "INSERT INTO customer (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());
            ps.setString(3, customer.getPhone());
            ps.setString(4, customer.getAddress());
            ps.setString(5, customer.getPassword());
            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        customer.setCustomerId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (Exception e) {
            System.err.println("DB Notice (CustomerDAO.register fallback): " + e.getMessage());
        }

        // Mock fallback
        customer.setCustomerId(mockCustomers.size() + 1);
        mockCustomers.add(customer);
        return true;
    }

    public Customer authenticate(String email, String password) {
        String sql = "SELECT * FROM customer WHERE email = ? AND password = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            ps.setString(2, password);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToCustomer(rs);
                }
            }
        } catch (Exception e) {
            System.err.println("DB Notice (CustomerDAO.authenticate fallback): " + e.getMessage());
        }

        // Mock fallback
        for (Customer c : mockCustomers) {
            if (c.getEmail().equalsIgnoreCase(email) && c.getPassword().equals(password)) {
                return c;
            }
        }
        return null;
    }

    public Customer getById(int customerId) {
        String sql = "SELECT * FROM customer WHERE customer_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToCustomer(rs);
                }
            }
        } catch (Exception e) {
            System.err.println("DB Notice (CustomerDAO.getById fallback): " + e.getMessage());
        }

        for (Customer c : mockCustomers) {
            if (c.getCustomerId() == customerId) {
                return c;
            }
        }
        return null;
    }

    public List<Customer> getAll() {
        List<Customer> list = new ArrayList<>();
        String sql = "SELECT * FROM customer ORDER BY customer_id ASC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapResultSetToCustomer(rs));
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (CustomerDAO.getAll fallback): " + e.getMessage());
        }

        return new ArrayList<>(mockCustomers);
    }

    public boolean emailExists(String email) {
        String sql = "SELECT 1 FROM customer WHERE email = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (Exception e) {
            System.err.println("DB Notice (CustomerDAO.emailExists fallback): " + e.getMessage());
        }

        for (Customer c : mockCustomers) {
            if (c.getEmail().equalsIgnoreCase(email)) {
                return true;
            }
        }
        return false;
    }

    private Customer mapResultSetToCustomer(ResultSet rs) throws SQLException {
        Customer c = new Customer();
        c.setCustomerId(rs.getInt("customer_id"));
        c.setName(rs.getString("name"));
        c.setEmail(rs.getString("email"));
        c.setPhone(rs.getString("phone"));
        c.setAddress(rs.getString("address"));
        c.setPassword(rs.getString("password"));
        try {
            c.setCreatedAt(rs.getTimestamp("created_at"));
        } catch (Exception ignored) {}
        return c;
    }
}
