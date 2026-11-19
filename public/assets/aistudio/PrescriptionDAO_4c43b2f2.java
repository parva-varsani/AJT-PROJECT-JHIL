package com.opticalstore.dao;

import com.opticalstore.model.Prescription;
import com.opticalstore.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class PrescriptionDAO {

    private static final List<Prescription> mockPrescriptions = new CopyOnWriteArrayList<>();

    static {
        Prescription rx1 = new Prescription();
        rx1.setPrescriptionId(1);
        rx1.setRecordCode("RX-0021");
        rx1.setCustomerId(1);
        rx1.setCustomerName("Customer A");
        rx1.setDoctorName("Dr. R. K. Mehta");
        rx1.setPrescriptionDate(Date.valueOf("2026-11-02"));
        rx1.setRightEyeSph("-1.50");
        rx1.setRightEyeCyl("-0.50");
        rx1.setRightEyeAxis("90");
        rx1.setRightEyeAdd("+1.25");
        rx1.setLeftEyeSph("-1.25");
        rx1.setLeftEyeCyl("-0.25");
        rx1.setLeftEyeAxis("85");
        rx1.setLeftEyeAdd("+1.25");
        rx1.setStatus("Submitted");
        rx1.setNotes("Distance and reading combo. Routine checkup.");
        mockPrescriptions.add(rx1);

        Prescription rx2 = new Prescription();
        rx2.setPrescriptionId(2);
        rx2.setRecordCode("RX-0018");
        rx2.setCustomerId(2);
        rx2.setCustomerName("Customer B");
        rx2.setDoctorName("Dr. Sneha Desai");
        rx2.setPrescriptionDate(Date.valueOf("2026-10-29"));
        rx2.setRightEyeSph("-2.00");
        rx2.setRightEyeCyl("-0.75");
        rx2.setRightEyeAxis("85");
        rx2.setRightEyeAdd("+1.00");
        rx2.setLeftEyeSph("-2.00");
        rx2.setLeftEyeCyl("-0.50");
        rx2.setLeftEyeAxis("95");
        rx2.setLeftEyeAdd("+1.00");
        rx2.setStatus("Reviewed");
        rx2.setNotes("Mild astigmatism correction. Anti-reflective lenses recommended.");
        mockPrescriptions.add(rx2);

        Prescription rx3 = new Prescription();
        rx3.setPrescriptionId(3);
        rx3.setRecordCode("RX-0014");
        rx3.setCustomerId(3);
        rx3.setCustomerName("Customer C");
        rx3.setDoctorName("Dr. R. K. Mehta");
        rx3.setPrescriptionDate(Date.valueOf("2026-10-21"));
        rx3.setRightEyeSph("+1.00");
        rx3.setRightEyeCyl("0.00");
        rx3.setRightEyeAxis("0");
        rx3.setRightEyeAdd("+1.50");
        rx3.setLeftEyeSph("+1.25");
        rx3.setLeftEyeCyl("0.00");
        rx3.setLeftEyeAxis("0");
        rx3.setLeftEyeAdd("+1.50");
        rx3.setStatus("Reviewed");
        rx3.setNotes("Reading glasses prescription. Presbyopia adjustment.");
        mockPrescriptions.add(rx3);
    }

    public List<Prescription> getAllPrescriptions() {
        List<Prescription> list = new ArrayList<>();
        String sql = "SELECT p.*, c.name AS customer_name FROM prescription p " +
                     "LEFT JOIN customer c ON p.customer_id = c.customer_id " +
                     "ORDER BY p.prescription_id DESC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapResultSetToPrescription(rs));
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (PrescriptionDAO.getAllPrescriptions fallback): " + e.getMessage());
        }

        return new ArrayList<>(mockPrescriptions);
    }

    public List<Prescription> getPrescriptionsByCustomer(int customerId) {
        List<Prescription> list = new ArrayList<>();
        String sql = "SELECT p.*, c.name AS customer_name FROM prescription p " +
                     "LEFT JOIN customer c ON p.customer_id = c.customer_id " +
                     "WHERE p.customer_id = ? ORDER BY p.prescription_id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToPrescription(rs));
                }
            }
            if (!list.isEmpty()) return list;
        } catch (Exception e) {
            System.err.println("DB Notice (PrescriptionDAO.getPrescriptionsByCustomer fallback): " + e.getMessage());
        }

        List<Prescription> customerList = new ArrayList<>();
        for (Prescription p : mockPrescriptions) {
            if (p.getCustomerId() == customerId) {
                customerList.add(p);
            }
        }
        return customerList;
    }

    public Prescription getPrescriptionById(int prescriptionId) {
        String sql = "SELECT p.*, c.name AS customer_name FROM prescription p " +
                     "LEFT JOIN customer c ON p.customer_id = c.customer_id " +
                     "WHERE p.prescription_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, prescriptionId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToPrescription(rs);
                }
            }
        } catch (Exception e) {
            System.err.println("DB Notice (PrescriptionDAO.getPrescriptionById fallback): " + e.getMessage());
        }

        for (Prescription p : mockPrescriptions) {
            if (p.getPrescriptionId() == prescriptionId) {
                return p;
            }
        }
        return null;
    }

    public boolean addPrescription(Prescription rx) {
        String sql = "INSERT INTO prescription (record_code, customer_id, doctor_name, prescription_date, " +
                     "right_eye_sph, right_eye_cyl, right_eye_axis, right_eye_add, " +
                     "left_eye_sph, left_eye_cyl, left_eye_axis, left_eye_add, status, notes) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            String code = "RX-" + String.format("%04d", (int)(Math.random() * 9000 + 1000));
            if (rx.getRecordCode() == null || rx.getRecordCode().isEmpty()) {
                rx.setRecordCode(code);
            }
            ps.setString(1, rx.getRecordCode());
            ps.setInt(2, rx.getCustomerId());
            ps.setString(3, rx.getDoctorName() != null ? rx.getDoctorName() : "Self reported");
            ps.setDate(4, rx.getPrescriptionDate() != null ? rx.getPrescriptionDate() : new Date(System.currentTimeMillis()));
            ps.setString(5, rx.getRightEyeSph());
            ps.setString(6, rx.getRightEyeCyl());
            ps.setString(7, rx.getRightEyeAxis());
            ps.setString(8, rx.getRightEyeAdd());
            ps.setString(9, rx.getLeftEyeSph());
            ps.setString(10, rx.getLeftEyeCyl());
            ps.setString(11, rx.getLeftEyeAxis());
            ps.setString(12, rx.getLeftEyeAdd());
            ps.setString(13, rx.getStatus() != null ? rx.getStatus() : "Submitted");
            ps.setString(14, rx.getNotes());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        rx.setPrescriptionId(rs.getInt(1));
                    }
                }
                return true;
            }
        } catch (Exception e) {
            System.err.println("DB Notice (PrescriptionDAO.addPrescription fallback): " + e.getMessage());
        }

        rx.setPrescriptionId(mockPrescriptions.size() + 1);
        if (rx.getRecordCode() == null || rx.getRecordCode().isEmpty()) {
            rx.setRecordCode("RX-" + String.format("%04d", (int)(Math.random() * 9000 + 1000)));
        }
        if (rx.getPrescriptionDate() == null) {
            rx.setPrescriptionDate(new Date(System.currentTimeMillis()));
        }
        if (rx.getStatus() == null) {
            rx.setStatus("Submitted");
        }
        mockPrescriptions.add(rx);
        return true;
    }

    public boolean updateStatus(int prescriptionId, String status) {
        String sql = "UPDATE prescription SET status = ? WHERE prescription_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setInt(2, prescriptionId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            System.err.println("DB Notice (PrescriptionDAO.updateStatus fallback): " + e.getMessage());
        }

        for (Prescription p : mockPrescriptions) {
            if (p.getPrescriptionId() == prescriptionId) {
                p.setStatus(status);
                return true;
            }
        }
        return false;
    }

    private Prescription mapResultSetToPrescription(ResultSet rs) throws SQLException {
        Prescription p = new Prescription();
        p.setPrescriptionId(rs.getInt("prescription_id"));
        p.setRecordCode(rs.getString("record_code"));
        p.setCustomerId(rs.getInt("customer_id"));
        try {
            p.setCustomerName(rs.getString("customer_name"));
        } catch (Exception ignored) {}
        p.setDoctorName(rs.getString("doctor_name"));
        p.setPrescriptionDate(rs.getDate("prescription_date"));
        p.setRightEye(rs.getString("right_eye"));
        p.setLeftEye(rs.getString("left_eye"));
        p.setRightEyeSph(rs.getString("right_eye_sph"));
        p.setRightEyeCyl(rs.getString("right_eye_cyl"));
        p.setRightEyeAxis(rs.getString("right_eye_axis"));
        p.setRightEyeAdd(rs.getString("right_eye_add"));
        p.setLeftEyeSph(rs.getString("left_eye_sph"));
        p.setLeftEyeCyl(rs.getString("left_eye_cyl"));
        p.setLeftEyeAxis(rs.getString("left_eye_axis"));
        p.setLeftEyeAdd(rs.getString("left_eye_add"));
        p.setStatus(rs.getString("status"));
        p.setNotes(rs.getString("notes"));
        return p;
    }
}
