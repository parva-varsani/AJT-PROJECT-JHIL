package com.opticalstore.dao;

import com.opticalstore.model.Product;
import com.opticalstore.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class ProductDAO {

    private static final List<Product> mockProducts = new CopyOnWriteArrayList<>();

    static {
        mockProducts.add(new Product(1, "Classic Everyday Frame", "Eyeglasses", new BigDecimal("1850.00"), 32,
                "Comfortable frame for everyday use. Designed with lightweight acetate and flexible hinges for all-day comfort.",
                "Lightweight acetate", "Lightweight design, Multiple size options, Available while stock lasts", "In stock", "images/eyeglasses-classic.svg"));
        mockProducts.add(new Product(2, "UV protection", "Sunglasses", new BigDecimal("2400.00"), 18,
                "Polarized UV400 protective sunglasses offering crisp contrast and complete UVA/UVB eye defense.",
                "Polycarbonate / Metal", "100% UV400 protection, Scratch-resistant coating, Lightweight rim, Includes hard case", "In stock", "images/sunglasses-uv.svg"));
        mockProducts.add(new Product(3, "Daily lens pack", "Contact lenses", new BigDecimal("980.00"), 5,
                "High oxygen permeable hydrogel daily disposable contact lenses for comfortable hydration all day long.",
                "Silicone Hydrogel", "Daily disposable (30 lenses), 58% water content, Breathable comfort, UV blocking", "Low stock", "images/contact-lenses.svg"));
        mockProducts.add(new Product(4, "Cleaning kit", "Accessories", new BigDecimal("350.00"), 2,
                "Complete lens care essential kit containing anti-fog cleaning spray, microfiber cloth, and precision screwdriver.",
                "Lens Care Essentials", "Anti-fog optical spray 60ml, 2x Microfiber cloths, 3-in-1 precision repair tool", "Low stock", "images/accessories-kit.svg"));
        mockProducts.add(new Product(5, "Blue-light glasses", "Eyeglasses", new BigDecimal("2400.00"), 25,
                "Modern computer and digital screen glasses engineered to filter harmful blue-violet light and reduce eye strain.",
                "TR90 Ultra-flex", "Blue cut filtering filter, Anti-reflective coating, Zero power default or prescription ready", "In stock", "images/eyeglasses-bluelight.svg"));
        mockProducts.add(new Product(6, "Titanium Minimalist Frame", "Eyeglasses", new BigDecimal("3200.00"), 14,
                "Ultra-lightweight premium titanium round frames for professional and formal wear.",
                "Pure Titanium", "Ultra-light 11 grams, Hypoallergenic nose pads, Corrosive resistant", "In stock", "images/eyeglasses-titanium.svg"));
        mockProducts.add(new Product(7, "Aviator Polarized Sunglasses", "Sunglasses", new BigDecimal("2850.00"), 20,
                "Timeless pilot aviator sunglasses featuring gradient green lenses and gold double-bridge frame.",
                "Stainless Steel Alloy", "Polarized HD lenses, Classic teardrop shape, Spring hinges, 100% UV defense", "In stock", "images/sunglasses-aviator.svg"));
        mockProducts.add(new Product(8, "Monthly Moisture Lens (6pk)", "Contact lenses", new BigDecimal("1450.00"), 12,
                "Extended wear monthly disposable contact lenses with AquaComfort moisture technology.",
                "Lotrafilcon B", "Monthly replacement, High oxygen transmissibility, Retains moisture up to 16 hours", "In stock", "images/contact-monthly.svg"));
        mockProducts.add(new Product(9, "Premium Leather Eyeglass Case", "Accessories", new BigDecimal("499.00"), 15,
                "Handcrafted soft leather protective case with magnetic snap closure to safeguard your glasses.",
                "Genuine PU Leather", "Magnetic lock closure, Velvet-lined interior, Fits all standard sizes", "In stock", "images/accessories-case.svg"));
    }

    public List<Product> getAllProducts() {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM product ORDER BY product_id ASC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapResultSetToProduct(rs));
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (ProductDAO.getAllProducts fallback): " + e.getMessage());
        }

        return new ArrayList<>(mockProducts);
    }

    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.trim().isEmpty() || "All".equalsIgnoreCase(category)) {
            return getAllProducts();
        }
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM product WHERE LOWER(category) = LOWER(?) ORDER BY product_id ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, category);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToProduct(rs));
                }
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (ProductDAO.getProductsByCategory fallback): " + e.getMessage());
        }

        List<Product> filtered = new ArrayList<>();
        for (Product p : mockProducts) {
            if (p.getCategory().equalsIgnoreCase(category)) {
                filtered.add(p);
            }
        }
        return filtered;
    }

    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllProducts();
        }
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM product WHERE LOWER(product_name) LIKE ? OR LOWER(category) LIKE ? OR LOWER(description) LIKE ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            String pattern = "%" + keyword.toLowerCase() + "%";
            ps.setString(1, pattern);
            ps.setString(2, pattern);
            ps.setString(3, pattern);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToProduct(rs));
                }
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (ProductDAO.searchProducts fallback): " + e.getMessage());
        }

        List<Product> matches = new ArrayList<>();
        String kw = keyword.toLowerCase();
        for (Product p : mockProducts) {
            if (p.getProductName().toLowerCase().contains(kw) ||
                p.getCategory().toLowerCase().contains(kw) ||
                (p.getDescription() != null && p.getDescription().toLowerCase().contains(kw))) {
                matches.add(p);
            }
        }
        return matches;
    }

    public Product getProductById(int productId) {
        String sql = "SELECT * FROM product WHERE product_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, productId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToProduct(rs);
                }
            }
        } catch (Exception e) {
            System.err.println("DB Notice (ProductDAO.getProductById fallback): " + e.getMessage());
        }

        for (Product p : mockProducts) {
            if (p.getProductId() == productId) {
                return p;
            }
        }
        return null;
    }

    public boolean addProduct(Product product) {
        String sql = "INSERT INTO product (product_name, category, price, quantity, description, material, features, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, product.getProductName());
            ps.setString(2, product.getCategory());
            ps.setBigDecimal(3, product.getPrice());
            ps.setInt(4, product.getQuantity());
            ps.setString(5, product.getDescription());
            ps.setString(6, product.getMaterial());
            ps.setString(7, product.getFeatures());
            ps.setString(8, product.getQuantity() <= 5 ? "Low stock" : "In stock");
            ps.setString(9, product.getImageUrl());
            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        product.setProductId(rs.getInt(1));
                        // Also insert into inventory table
                        String invSql = "INSERT INTO inventory (product_id, quantity_available, reorder_level) VALUES (?, ?, ?)";
                        try (PreparedStatement invPs = conn.prepareStatement(invSql)) {
                            invPs.setInt(1, product.getProductId());
                            invPs.setInt(2, product.getQuantity());
                            invPs.setInt(3, 10);
                            invPs.executeUpdate();
                        }
                    }
                }
                return true;
            }
        } catch (Exception e) {
            System.err.println("DB Notice (ProductDAO.addProduct fallback): " + e.getMessage());
        }

        product.setProductId(mockProducts.size() + 1);
        product.setStatus(product.getQuantity() <= 5 ? "Low stock" : "In stock");
        mockProducts.add(product);
        return true;
    }

    public boolean updateProduct(Product product) {
        String sql = "UPDATE product SET product_name = ?, category = ?, price = ?, quantity = ?, description = ?, material = ?, features = ?, status = ? WHERE product_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, product.getProductName());
            ps.setString(2, product.getCategory());
            ps.setBigDecimal(3, product.getPrice());
            ps.setInt(4, product.getQuantity());
            ps.setString(5, product.getDescription());
            ps.setString(6, product.getMaterial());
            ps.setString(7, product.getFeatures());
            ps.setString(8, product.getQuantity() <= 5 ? "Low stock" : "In stock");
            ps.setInt(9, product.getProductId());
            boolean ok = ps.executeUpdate() > 0;
            if (ok) {
                // Update inventory too
                String invSql = "UPDATE inventory SET quantity_available = ? WHERE product_id = ?";
                try (PreparedStatement invPs = conn.prepareStatement(invSql)) {
                    invPs.setInt(1, product.getQuantity());
                    invPs.setInt(2, product.getProductId());
                    invPs.executeUpdate();
                }
            }
            return ok;
        } catch (Exception e) {
            System.err.println("DB Notice (ProductDAO.updateProduct fallback): " + e.getMessage());
        }

        for (int i = 0; i < mockProducts.size(); i++) {
            if (mockProducts.get(i).getProductId() == product.getProductId()) {
                product.setStatus(product.getQuantity() <= 5 ? "Low stock" : "In stock");
                mockProducts.set(i, product);
                return true;
            }
        }
        return false;
    }

    public boolean deleteProduct(int productId) {
        String sql = "DELETE FROM product WHERE product_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, productId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            System.err.println("DB Notice (ProductDAO.deleteProduct fallback): " + e.getMessage());
        }

        return mockProducts.removeIf(p -> p.getProductId() == productId);
    }

    public int getTotalCount() {
        String sql = "SELECT COUNT(*) FROM product";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) return rs.getInt(1);
        } catch (Exception e) {
            System.err.println("DB Notice (ProductDAO.getTotalCount fallback): " + e.getMessage());
        }
        return mockProducts.size();
    }

    private Product mapResultSetToProduct(ResultSet rs) throws SQLException {
        Product p = new Product();
        p.setProductId(rs.getInt("product_id"));
        p.setProductName(rs.getString("product_name"));
        p.setCategory(rs.getString("category"));
        p.setPrice(rs.getBigDecimal("price"));
        p.setQuantity(rs.getInt("quantity"));
        p.setDescription(rs.getString("description"));
        p.setMaterial(rs.getString("material"));
        p.setFeatures(rs.getString("features"));
        p.setStatus(rs.getString("status"));
        p.setImageUrl(rs.getString("image_url"));
        return p;
    }
}
