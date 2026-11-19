package com.opticalstore.controller;

import com.opticalstore.model.Customer;
import com.opticalstore.model.Prescription;
import com.opticalstore.service.OpticalStoreService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

@WebServlet(urlPatterns = {"/prescriptions", "/prescription-form", "/manage-prescriptions"})
public class PrescriptionServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final OpticalStoreService service = new OpticalStoreService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath();

        if ("/manage-prescriptions".equals(path)) {
            handleManagePrescriptions(request, response);
        } else {
            handlePrescriptionForm(request, response);
        }
    }

    private void handlePrescriptionForm(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        Customer customer = (session != null) ? (Customer) session.getAttribute("customer") : null;

        if (customer != null) {
            List<Prescription> customerRxList = service.getPrescriptionsByCustomer(customer.getCustomerId());
            request.setAttribute("savedPrescriptions", customerRxList);
        }

        request.getRequestDispatcher("/prescription-form.jsp").forward(request, response);
    }

    private void handleManagePrescriptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            response.sendRedirect(request.getContextPath() + "/login?role=admin");
            return;
        }

        List<Prescription> allRx = service.getAllPrescriptions();
        request.setAttribute("prescriptions", allRx);
        request.getRequestDispatcher("/manage-prescriptions.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getServletPath();

        if ("/manage-prescriptions".equals(path)) {
            // Admin updating status
            String rxIdStr = request.getParameter("prescriptionId");
            String status = request.getParameter("status");
            if (rxIdStr != null && status != null) {
                try {
                    int id = Integer.parseInt(rxIdStr);
                    service.updatePrescriptionStatus(id, status);
                } catch (NumberFormatException ignored) {}
            }
            response.sendRedirect(request.getContextPath() + "/manage-prescriptions?updated=true");
            return;
        }

        // Customer saving prescription form
        HttpSession session = request.getSession(false);
        Customer customer = (session != null) ? (Customer) session.getAttribute("customer") : null;

        int customerId = 1;
        String customerName = "Customer A";
        if (customer != null) {
            customerId = customer.getCustomerId();
            customerName = customer.getName();
        }

        String rightSph = request.getParameter("rightEyeSph");
        String rightCyl = request.getParameter("rightEyeCyl");
        String rightAxis = request.getParameter("rightEyeAxis");
        String rightAdd = request.getParameter("rightEyeAdd");

        String leftSph = request.getParameter("leftEyeSph");
        String leftCyl = request.getParameter("leftEyeCyl");
        String leftAxis = request.getParameter("leftEyeAxis");
        String leftAdd = request.getParameter("leftEyeAdd");

        String doctorName = request.getParameter("doctorName");
        if (doctorName == null || doctorName.trim().isEmpty()) {
            doctorName = "Dr. R. K. Mehta";
        }

        Prescription rx = new Prescription();
        rx.setCustomerId(customerId);
        rx.setCustomerName(customerName);
        rx.setDoctorName(doctorName);
        rx.setPrescriptionDate(new Date(System.currentTimeMillis()));
        rx.setRightEyeSph(rightSph != null ? rightSph : "0.00");
        rx.setRightEyeCyl(rightCyl != null ? rightCyl : "0.00");
        rx.setRightEyeAxis(rightAxis != null ? rightAxis : "0");
        rx.setRightEyeAdd(rightAdd != null ? rightAdd : "0.00");
        rx.setLeftEyeSph(leftSph != null ? leftSph : "0.00");
        rx.setLeftEyeCyl(leftCyl != null ? leftCyl : "0.00");
        rx.setLeftEyeAxis(leftAxis != null ? leftAxis : "0");
        rx.setLeftEyeAdd(leftAdd != null ? leftAdd : "0.00");
        rx.setStatus("Submitted");
        rx.setNotes("Saved from online prescription form.");

        service.savePrescription(rx);
        response.sendRedirect(request.getContextPath() + "/prescription-form?success=true");
    }
}
