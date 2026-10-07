package com.example.sessionauth.service;
import com.example.sessionauth.dto.KafedraDTO;
import com.example.sessionauth.entity.Institute;
import com.example.sessionauth.entity.Kafedra;
import com.example.sessionauth.repository.InstituteRepository;
import com.example.sessionauth.repository.KafedraRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KafedraService {
    private final KafedraRepository kafedraRepository;
    private final InstituteRepository instituteRepository;

    public KafedraService(KafedraRepository kafedraRepository,
                          InstituteRepository instituteRepository) {
        this.kafedraRepository = kafedraRepository;
        this.instituteRepository = instituteRepository;
    }

    @Transactional
    public KafedraDTO createKafedra(KafedraDTO kafedraDTO) {
        Institute institute = instituteRepository.findById(kafedraDTO.getInstituteId())
                .orElseThrow(() -> new EntityNotFoundException("Institute not found"));

        Kafedra kafedra = new Kafedra();
        kafedra.setName(kafedraDTO.getName());
        kafedra.setEmail(kafedraDTO.getEmail());
        kafedra.setRoom(kafedraDTO.getRoom());
        kafedra.setPhone(kafedraDTO.getPhone());
        kafedra.setCredentialsNonExpired(kafedraDTO.isCredentialsNonExpired());
        kafedra.setInstitute(institute);

        Kafedra savedKafedra = kafedraRepository.save(kafedra);
        return convertToDTO(savedKafedra);
    }

    public KafedraDTO getKafedraById(Long id) {
        Kafedra kafedra = kafedraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Kafedra not found"));
        return convertToDTO(kafedra);
    }

    public List<KafedraDTO> getAllKafedras() {
        return kafedraRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public KafedraDTO updateKafedra(Long id, KafedraDTO kafedraDTO) {
        Kafedra kafedra = kafedraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Kafedra not found"));

        Institute institute = instituteRepository.findById(kafedraDTO.getInstituteId())
                .orElseThrow(() -> new EntityNotFoundException("Institute not found"));

        kafedra.setName(kafedraDTO.getName());
        kafedra.setEmail(kafedraDTO.getEmail());
        kafedra.setRoom(kafedraDTO.getRoom());
        kafedra.setPhone(kafedraDTO.getPhone());
        kafedra.setCredentialsNonExpired(kafedraDTO.isCredentialsNonExpired());
        kafedra.setInstitute(institute);

        Kafedra updatedKafedra = kafedraRepository.save(kafedra);
        return convertToDTO(updatedKafedra);
    }

    @Transactional
    public void deleteKafedra(Long id) {
        kafedraRepository.deleteById(id);
    }

    private KafedraDTO convertToDTO(Kafedra kafedra) {
        KafedraDTO dto = new KafedraDTO();
        dto.setId(kafedra.getId());
        dto.setName(kafedra.getName());
        dto.setEmail(kafedra.getEmail());
        dto.setRoom(kafedra.getRoom());
        dto.setPhone(kafedra.getPhone());
        dto.setCredentialsNonExpired(kafedra.isCredentialsNonExpired());
        dto.setInstituteId(kafedra.getInstitute().getId());
        return dto;
    }
}
