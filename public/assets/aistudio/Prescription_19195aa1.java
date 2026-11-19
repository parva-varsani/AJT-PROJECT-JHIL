package com.opticalstore.model;

import java.io.Serializable;
import java.sql.Date;

public class Prescription implements Serializable {
    private static final long serialVersionUID = 1L;

    private int prescriptionId;
    private String recordCode;
    private int customerId;
    private String customerName;
    private String doctorName;
    private Date prescriptionDate;
    private String rightEye;
    private String leftEye;
    private String rightEyeSph;
    private String rightEyeCyl;
    private String rightEyeAxis;
    private String rightEyeAdd;
    private String leftEyeSph;
    private String leftEyeCyl;
    private String leftEyeAxis;
    private String leftEyeAdd;
    private String status;
    private String notes;

    public Prescription() {}

    public int getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(int prescriptionId) {
        this.prescriptionId = prescriptionId;
    }

    public String getRecordCode() {
        return recordCode;
    }

    public void setRecordCode(String recordCode) {
        this.recordCode = recordCode;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public Date getPrescriptionDate() {
        return prescriptionDate;
    }

    public void setPrescriptionDate(Date prescriptionDate) {
        this.prescriptionDate = prescriptionDate;
    }

    public String getRightEye() {
        return rightEye;
    }

    public void setRightEye(String rightEye) {
        this.rightEye = rightEye;
    }

    public String getLeftEye() {
        return leftEye;
    }

    public void setLeftEye(String leftEye) {
        this.leftEye = leftEye;
    }

    public String getRightEyeSph() {
        return rightEyeSph;
    }

    public void setRightEyeSph(String rightEyeSph) {
        this.rightEyeSph = rightEyeSph;
    }

    public String getRightEyeCyl() {
        return rightEyeCyl;
    }

    public void setRightEyeCyl(String rightEyeCyl) {
        this.rightEyeCyl = rightEyeCyl;
    }

    public String getRightEyeAxis() {
        return rightEyeAxis;
    }

    public void setRightEyeAxis(String rightEyeAxis) {
        this.rightEyeAxis = rightEyeAxis;
    }

    public String getRightEyeAdd() {
        return rightEyeAdd;
    }

    public void setRightEyeAdd(String rightEyeAdd) {
        this.rightEyeAdd = rightEyeAdd;
    }

    public String getLeftEyeSph() {
        return leftEyeSph;
    }

    public void setLeftEyeSph(String leftEyeSph) {
        this.leftEyeSph = leftEyeSph;
    }

    public String getLeftEyeCyl() {
        return leftEyeCyl;
    }

    public void setLeftEyeCyl(String leftEyeCyl) {
        this.leftEyeCyl = leftEyeCyl;
    }

    public String getLeftEyeAxis() {
        return leftEyeAxis;
    }

    public void setLeftEyeAxis(String leftEyeAxis) {
        this.leftEyeAxis = leftEyeAxis;
    }

    public String getLeftEyeAdd() {
        return leftEyeAdd;
    }

    public void setLeftEyeAdd(String leftEyeAdd) {
        this.leftEyeAdd = leftEyeAdd;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
