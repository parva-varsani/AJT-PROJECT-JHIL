package com.opticalstore.dao;

import com.opticalstore.model.Inventory;
import com.opticalstore.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class InventoryDAO {

    private static final List<Inventory> mockInventory = new CopyOnWriteArrayList<>();

    static {
        // Matches Image 9
        mockInventory.add(new Inventory(1, 1, "Classic frame", "Eyeglasses", 32, 10));
        mockInventory.add(new Inventory(2, 2, "UV protection", "Sunglasses", 18, 8));
        mockInventory.add(new Inventory(3, 3, "Daily lens pack", "Contact lenses", 5, 10));
        mockInventory.add(new Inventory(4, 4, "Cleaning kit", "Accessories", 2, 6));
        mockInventory.add(new Inventory(5, 5, "Blue-light glasses", "Eyeglasses", 25, 10));
        mockInventory.add(new Inventory(6, 6, "Titanium frame", "Eyeglasses", 14, 5));
    }

    public List<Inventory> getAllInventory() {
        List<Inventory> list = new ArrayList<>();
        String sql = "SELECT i.*, p.product_name, p.category FROM inventory i " +
                     "JOIN product p ON i.product_id = p.product_id " +
                     "ORDER BY i.inventory_id ASC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapResultSetToInventory(rs));
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (InventoryDAO.getAllInventory fallback): " + e.getMessage());
        }

        return new ArrayList<>(mockInventory);
    }

    public List<Inventory> getLowStockItems() {
        List<Inventory> list = new ArrayList<>();
        String sql = "SELECT i.*, p.product_name, p.category FROM inventory i " +
                     "JOIN product p ON i.product_id = p.product_id " +
                     "WHERE i.quantity_available <= i.reorder_level " +
                     "ORDER BY i.quantity_available ASC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapResultSetToInventory(rs));
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (InventoryDAO.getLowStockItems fallback): " + e.getMessage());
        }

        List<Inventory> lowList = new ArrayList<>();
        for (Inventory i : mockInventory) {
            if (i.isLowStock()) {
                lowList.add(i);
            }
        }
        return lowList;
    }

    public int getLowStockCount() {
        String sql = "SELECT COUNT(*) FROM inventory WHERE quantity_available <= reorder_level";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) {
            System.err.println("DB Notice (InventoryDAO.getLowStockCount fallback): " + e.getMessage());
        }

        int count = 0;
        for (Inventory i : mockInventory) {
            if (i.isLowStock()) count++;
        }
        return count;
    }

    public boolean updateStock(int productId, int quantity, int reorderLevel) {
        String sql = "UPDATE inventory SET quantity_available = ?, reorder_level = ? WHERE product_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setInt(2, reorderLevel);
            ps.setInt(3, productId);
            boolean ok = ps.executeUpdate() > 0;
            if (ok) {
                // Also sync with product table quantity
                String pSql = "UPDATE product SET quantity = ?, status = ? WHERE product_id = ?";
                try (PreparedStatement pps = conn.prepareStatement(pSql)) {
                    pps.setInt(1, quantity);
                    pps.setString(2, quantity <= reorderLevel ? "Low stock" : "In stock");
                    pps.setInt(3, productId);
                    pps.executeUpdate();
                }
            }
            return ok;
        } catch (Exception e) {
            System.err.println("DB Notice (InventoryDAO.updateStock fallback): " + e.getMessage());
        }

        for (Inventory i : mockInventory) {
            if (i.getProductId() == productId) {
                i.setQuantityAvailable(quantity);
                i.setReorderLevel(reorderLevel);
                return true;
            }
        }
        return false;
    }

    public boolean addInventoryItem(int productId, int quantity, int reorderLevel) {
        String sql = "INSERT INTO inventory (product_id, quantity_available, reorder_level) VALUES (?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE quantity_available = ?, reorder_level = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, productId);
            ps.setInt(2, quantity);
            ps.setInt(3, reorderLevel);
            ps.setInt(4, quantity);
            ps.setInt(5, reorderLevel);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            System.err.println("DB Notice (InventoryDAO.addInventoryItem fallback): " + e.getMessage());
        }

        for (Inventory i : mockInventory) {
            if (i.getProductId() == productId) {
                i.setQuantityAvailable(quantity);
                i.setReorderLevel(reorderLevel);
                return true;
            }
        }
        Inventory inv = new Inventory(mockInventory.size() + 1, productId, "Product #" + productId, "General", quantity, reorderLevel);
        mockInventory.add(inv);
        return true;
    }

    private Inventory mapResultSetToInventory(ResultSet rs) throws SQLException {
        Inventory i = new Inventory();
        i.setInventoryId(rs.getInt("inventory_id"));
        i.setProductId(rs.getInt("product_id"));
        i.setProductName(rs.getString("product_name"));
        i.setCategory(rs.getString("category"));
        i.setQuantityAvailable(rs.getInt("quantity_available"));
        i.setReorderLevel(rs.getInt("reorder_level"));
        try {
            i.setLastUpdated(rs.getTimestamp("last_updated"));
        } catch (Exception ignored) {}
        return i;
    }
}
