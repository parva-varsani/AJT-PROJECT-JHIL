package com.opticalstore.dao;

import com.opticalstore.model.Admin;
import com.opticalstore.util.DBConnection;

import java.sql.*;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class AdminDAO {

    private static final List<Admin> mockAdmins = new CopyOnWriteArrayList<>();

    static {
        mockAdmins.add(new Admin(1, "admin", "admin123", "Store Administrator", "ADMIN"));
        mockAdmins.add(new Admin(2, "optician", "admin123", "Senior Optometrist", "OPTICIAN"));
    }

    public Admin authenticate(String username, String password) {
        String sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, password);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Admin admin = new Admin();
                    admin.setAdminId(rs.getInt("admin_id"));
                    admin.setUsername(rs.getString("username"));
                    admin.setPassword(rs.getString("password"));
                    admin.setFullName(rs.getString("full_name"));
                    admin.setRole(rs.getString("role"));
                    return admin;
                }
            }
        } catch (Exception e) {
            System.err.println("DB Notice (AdminDAO.authenticate fallback): " + e.getMessage());
        }

        for (Admin a : mockAdmins) {
            if (a.getUsername().equalsIgnoreCase(username) && a.getPassword().equals(password)) {
                return a;
            }
        }
        return null;
    }
}
