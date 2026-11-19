package com.opticalstore.service;

import com.opticalstore.dao.*;
import com.opticalstore.model.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OpticalStoreService {

    private final CustomerDAO customerDAO = new CustomerDAO();
    private final ProductDAO productDAO = new ProductDAO();
    private final PrescriptionDAO prescriptionDAO = new PrescriptionDAO();
    private final OrderDAO orderDAO = new OrderDAO();
    private final InventoryDAO inventoryDAO = new InventoryDAO();
    private final BillingDAO billingDAO = new BillingDAO();
    private final AdminDAO adminDAO = new AdminDAO();

    // Customer operations
    public Customer authenticateCustomer(String email, String password) {
        return customerDAO.authenticate(email, password);
    }

    public boolean registerCustomer(Customer customer) {
        if (customerDAO.emailExists(customer.getEmail())) {
            return false;
        }
        return customerDAO.register(customer);
    }

    public Customer getCustomerById(int customerId) {
        return customerDAO.getById(customerId);
    }

    public List<Customer> getAllCustomers() {
        return customerDAO.getAll();
    }

    // Admin operations
    public Admin authenticateAdmin(String username, String password) {
        return adminDAO.authenticate(username, password);
    }

    // Product operations
    public List<Product> getAllProducts() {
        return productDAO.getAllProducts();
    }

    public List<Product> getProductsByCategory(String category) {
        return productDAO.getProductsByCategory(category);
    }

    public List<Product> searchProducts(String keyword) {
        return productDAO.searchProducts(keyword);
    }

    public Product getProductById(int productId) {
        return productDAO.getProductById(productId);
    }

    public boolean addProduct(Product product) {
        return productDAO.addProduct(product);
    }

    public boolean updateProduct(Product product) {
        return productDAO.updateProduct(product);
    }

    public boolean deleteProduct(int productId) {
        return productDAO.deleteProduct(productId);
    }

    // Prescription operations
    public boolean savePrescription(Prescription prescription) {
        return prescriptionDAO.addPrescription(prescription);
    }

    public List<Prescription> getPrescriptionsByCustomer(int customerId) {
        return prescriptionDAO.getPrescriptionsByCustomer(customerId);
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionDAO.getAllPrescriptions();
    }

    public Prescription getPrescriptionById(int prescriptionId) {
        return prescriptionDAO.getPrescriptionById(prescriptionId);
    }

    public boolean updatePrescriptionStatus(int prescriptionId, String status) {
        return prescriptionDAO.updateStatus(prescriptionId, status);
    }

    // Order operations
    public boolean placeOrder(Order order) {
        return orderDAO.placeOrder(order);
    }

    public List<Order> getOrdersByCustomer(int customerId) {
        return orderDAO.getOrdersByCustomer(customerId);
    }

    public List<Order> getAllOrders() {
        return orderDAO.getAllOrders();
    }

    public Order getOrderById(int orderId) {
        return orderDAO.getOrderById(orderId);
    }

    public Order getOrderByCode(String orderCode) {
        return orderDAO.getOrderByCode(orderCode);
    }

    public boolean updateOrderStatus(int orderId, String status) {
        return orderDAO.updateStatus(orderId, status);
    }

    // Inventory operations
    public List<Inventory> getAllInventory() {
        return inventoryDAO.getAllInventory();
    }

    public List<Inventory> getLowStockInventory() {
        return inventoryDAO.getLowStockItems();
    }

    public boolean updateStock(int productId, int quantity, int reorderLevel) {
        return inventoryDAO.updateStock(productId, quantity, reorderLevel);
    }

    public boolean addInventoryItem(int productId, int quantity, int reorderLevel) {
        return inventoryDAO.addInventoryItem(productId, quantity, reorderLevel);
    }

    // Billing operations
    public List<Bill> getAllBills() {
        return billingDAO.getAllBills();
    }

    public Bill getBillById(int billId) {
        return billingDAO.getBillById(billId);
    }

    public Bill getBillByOrderId(int orderId) {
        return billingDAO.getBillByOrderId(orderId);
    }

    public Bill getBillByCode(String billCode) {
        return billingDAO.getBillByCode(billCode);
    }

    // Admin Dashboard Summary Metrics (aligned with Image 8)
    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        int productCount = productDAO.getTotalCount();
        int orderCount = orderDAO.getTotalCount();
        int lowStockCount = inventoryDAO.getLowStockCount();
        BigDecimal sales = orderDAO.getTotalSales();

        // Image 8 shows sample/mock: 128 products, 24 orders, 6 low stock, ₹48.6k sales
        // If DB has our initial seed rows (9 products, 5 orders, 2 low stock), we can show live stats or format nicely:
        stats.put("totalProducts", productCount);
        stats.put("totalOrders", orderCount);
        stats.put("lowStockCount", lowStockCount);
        stats.put("totalSales", sales);
        stats.put("formattedSales", String.format("₹ %,.2f", sales));

        return stats;
    }
}
