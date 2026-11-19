package com.opticalstore.controller;

import com.opticalstore.model.Product;
import com.opticalstore.service.OpticalStoreService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@WebServlet(urlPatterns = {"/products", "/product-details", "/manage-products"})
public class ProductServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final OpticalStoreService service = new OpticalStoreService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath();

        if ("/product-details".equals(path)) {
            handleProductDetails(request, response);
        } else if ("/manage-products".equals(path)) {
            handleManageProducts(request, response);
        } else {
            handleProductListing(request, response);
        }
    }

    private void handleProductListing(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String category = request.getParameter("category");
        String search = request.getParameter("search");

        List<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = service.searchProducts(search.trim());
            request.setAttribute("searchKeyword", search);
        } else if (category != null && !category.trim().isEmpty()) {
            products = service.getProductsByCategory(category.trim());
            request.setAttribute("selectedCategory", category);
        } else {
            products = service.getAllProducts();
        }

        request.setAttribute("products", products);
        request.getRequestDispatcher("/products.jsp").forward(request, response);
    }

    private void handleProductDetails(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String idStr = request.getParameter("id");
        int productId = 1; // default to first product if missing
        if (idStr != null) {
            try {
                productId = Integer.parseInt(idStr);
            } catch (NumberFormatException ignored) {}
        }

        Product product = service.getProductById(productId);
        if (product == null) {
            product = service.getProductById(1);
        }

        request.setAttribute("product", product);
        request.getRequestDispatcher("/product-details.jsp").forward(request, response);
    }

    private void handleManageProducts(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Verify admin
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            response.sendRedirect(request.getContextPath() + "/login?role=admin");
            return;
        }

        List<Product> products = service.getAllProducts();
        request.setAttribute("products", products);
        request.getRequestDispatcher("/manage-products.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");
        if (action == null) action = "add";

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            response.sendRedirect(request.getContextPath() + "/login?role=admin");
            return;
        }

        if ("delete".equalsIgnoreCase(action)) {
            String idStr = request.getParameter("productId");
            if (idStr != null) {
                try {
                    int id = Integer.parseInt(idStr);
                    service.deleteProduct(id);
                } catch (NumberFormatException ignored) {}
            }
            response.sendRedirect(request.getContextPath() + "/manage-products?deleted=true");
            return;
        }

        String name = request.getParameter("productName");
        String category = request.getParameter("category");
        String priceStr = request.getParameter("price");
        String qtyStr = request.getParameter("quantity");
        String description = request.getParameter("description");
        String material = request.getParameter("material");
        String features = request.getParameter("features");

        BigDecimal price = new BigDecimal("1000.00");
        int qty = 10;
        try {
            if (priceStr != null) price = new BigDecimal(priceStr);
            if (qtyStr != null) qty = Integer.parseInt(qtyStr);
        } catch (Exception ignored) {}

        if ("update".equalsIgnoreCase(action)) {
            String idStr = request.getParameter("productId");
            if (idStr != null) {
                try {
                    int id = Integer.parseInt(idStr);
                    Product existing = service.getProductById(id);
                    if (existing != null) {
                        existing.setProductName(name);
                        existing.setCategory(category);
                        existing.setPrice(price);
                        existing.setQuantity(qty);
                        existing.setDescription(description);
                        existing.setMaterial(material);
                        existing.setFeatures(features);
                        service.updateProduct(existing);
                    }
                } catch (NumberFormatException ignored) {}
            }
            response.sendRedirect(request.getContextPath() + "/manage-products?updated=true");
        } else {
            Product p = new Product(name, category, price, qty, description, material, features,
                    qty <= 5 ? "Low stock" : "In stock", "images/eyeglasses-classic.svg");
            service.addProduct(p);
            response.sendRedirect(request.getContextPath() + "/manage-products?added=true");
        }
    }
}
