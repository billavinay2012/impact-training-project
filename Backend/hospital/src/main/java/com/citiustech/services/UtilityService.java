package com.citiustech.services;

import java.util.List;
import java.util.Map;

import com.citiustech.models.Employee;
import com.citiustech.models.Patient;

public interface UtilityService {

	public boolean emailExists(String email);

	public boolean phoneExists(String phone);

	public List<Map<String, Object>> getAllEmployeeNames();

	public List<Map<String, Object>> getPatientNames();

	public int getPatientIdByEmail(String email);

	public int getEmployeeId(String email);

	public Patient updatePatient(Patient patient);

	public Patient getPatientByEmail(String email);

	public Employee getEmployeeByEmail(String email);

	public Map<String, String> mapEmailsToIds(Map<String, String> map);

	public List<Employee> getAllEmployees();

	public Patient getPatientById(String patientId);

}
