package com.citiustech.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.citiustech.models.AppointmentStatistics;
import com.citiustech.models.Employee;
import com.citiustech.models.Patient;
import com.citiustech.services.AdminService;
import com.citiustech.services.AppointmentStatisticsService;
import com.google.gson.Gson;

@RestController
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private AdminService adminService;

	@Autowired
	private AppointmentStatisticsService appointmentStatisticsService;

	@Autowired
	private Gson gson;

	@GetMapping("/employees")
	public ResponseEntity<?> getAllEmployees(@RequestParam(required = false) String adminId) {
		List<Employee> employees = adminService.getAllEmployees(adminId);
		return new ResponseEntity<>(employees, HttpStatus.OK);
	}

	@GetMapping("/patients")
	public ResponseEntity<?> getAllPatients() {
		List<Patient> patients = adminService.getAllPatients();
		return new ResponseEntity<>(patients, HttpStatus.OK);
	}

	@PostMapping({ "/register", "/update" })
	public ResponseEntity<?> registerEmployee(@RequestBody Employee employee) {
		Employee registeredEmployee = adminService.register(employee);
		return new ResponseEntity<>(registeredEmployee, HttpStatus.CREATED);
	}

	@PutMapping({ "/api/updateEmployee" })
	public ResponseEntity<?> updateEmployee(@RequestBody Employee employee) {
		Employee registeredEmployee = adminService.updateEmployee(employee);
		return new ResponseEntity<>(registeredEmployee, HttpStatus.CREATED);
	}

	@KafkaListener(topics = "appointment-data", groupId = "appointment")
	public void consumeAppointment(@RequestBody String request) {
		AppointmentStatistics apptStats = gson.fromJson(request, AppointmentStatistics.class);
		appointmentStatisticsService.saveStatistics(apptStats);
	}

}
