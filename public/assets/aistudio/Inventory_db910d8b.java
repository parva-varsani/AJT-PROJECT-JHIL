package com.opticalstore.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class Inventory implements Serializable {
    private static final long serialVersionUID = 1L;

    private int inventoryId;
    private int productId;
    private String productName;
    private String category;
    private int quantityAvailable;
    private int reorderLevel;
    private Timestamp lastUpdated;

    public Inventory() {}

    public Inventory(int inventoryId, int productId, String productName, String category, int quantityAvailable, int reorderLevel) {
        this.inventoryId = inventoryId;
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.quantityAvailable = quantityAvailable;
        this.reorderLevel = reorderLevel;
    }

    public int getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(int inventoryId) {
        this.inventoryId = inventoryId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(int quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public int getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(int reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public Timestamp getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Timestamp lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getStockStatus() {
        if (quantityAvailable <= reorderLevel) {
            return "Low stock";
        }
        return "In stock";
    }

    public boolean isLowStock() {
        return quantityAvailable <= reorderLevel;
    }
}
