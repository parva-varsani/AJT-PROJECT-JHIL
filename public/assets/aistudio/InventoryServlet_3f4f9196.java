package com.opticalstore.controller;

import com.opticalstore.model.Inventory;
import com.opticalstore.service.OpticalStoreService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/manage-inventory"})
public class InventoryServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final OpticalStoreService service = new OpticalStoreService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            response.sendRedirect(request.getContextPath() + "/login?role=admin");
            return;
        }

        List<Inventory> inventoryList = service.getAllInventory();
        request.setAttribute("inventoryList", inventoryList);
        request.getRequestDispatcher("/manage-inventory.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            response.sendRedirect(request.getContextPath() + "/login?role=admin");
            return;
        }

        String productIdStr = request.getParameter("productId");
        String qtyStr = request.getParameter("quantityAvailable");
        String reorderStr = request.getParameter("reorderLevel");

        if (productIdStr != null && qtyStr != null) {
            try {
                int productId = Integer.parseInt(productIdStr);
                int qty = Integer.parseInt(qtyStr);
                int reorder = (reorderStr != null && !reorderStr.trim().isEmpty()) ? Integer.parseInt(reorderStr) : 10;
                service.updateStock(productId, qty, reorder);
            } catch (NumberFormatException ignored) {}
        }

        response.sendRedirect(request.getContextPath() + "/manage-inventory?updated=true");
    }
}
