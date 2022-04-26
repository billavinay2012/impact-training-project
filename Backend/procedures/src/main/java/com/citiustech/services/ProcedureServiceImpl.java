package com.citiustech.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.citiustech.models.AppointmentProcedures;
import com.citiustech.models.Procedure;
import com.citiustech.repositories.AppointmentProceduresRepository;
import com.citiustech.repositories.ProcedureRepository;

@Service
public class ProcedureServiceImpl implements ProcedureService {

	@Autowired
	private ProcedureRepository procedureRepo;

	@Autowired
	private AppointmentProceduresRepository apptProceduresRepo;

	@Override
	public Procedure getProcedureDetailsByProcedureId(int procedureId) {
		return procedureRepo.findById(procedureId).get();
	}

	@Override
	public List<Procedure> getProcedureDetails(int start, int count) {
		List<Procedure> list = (List<Procedure>) procedureRepo.findAll();
		return list.stream().limit(count).collect(Collectors.toList());
	}

	@Override
	public void deleteProcedureById(int id) {
		procedureRepo.deleteById(id);
	}

	@Override
	public Procedure addProcedure(Procedure procedure) {
		return procedureRepo.save(procedure);
	}

	@Override
	public Procedure addNewProcedure(Procedure procedure) {
		return procedureRepo.save(procedure);
	}

	@Override
	public List<Procedure> getProceduresByAppointmentId(int appointmentId) {
		AppointmentProcedures apptProcedures = apptProceduresRepo.findById(appointmentId).orElse(null);
		
		if(apptProcedures == null) {
			return List.of();
		}
		
		return apptProcedures.getProcedureIds().stream()
				.map(procedureId -> procedureRepo.findById(procedureId).orElse(null))
				.filter(procedure -> procedure != null)
				.collect(Collectors.toList());
	}

	@Override
	public AppointmentProcedures addProceduresForAppointment(AppointmentProcedures appointmentProcedures) {
		return apptProceduresRepo.save(appointmentProcedures);
	}

}