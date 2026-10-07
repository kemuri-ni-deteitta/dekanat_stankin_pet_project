package com.example.sessionauth.controller;

import com.example.sessionauth.dto.KafedraDTO;
import com.example.sessionauth.service.KafedraService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/kafedras")
public class KafedraController {
    private final KafedraService kafedraService;

    public KafedraController(KafedraService kafedraService) {
        this.kafedraService = kafedraService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<KafedraDTO> createKafedra(@RequestBody KafedraDTO kafedraDTO) {
        KafedraDTO createdKafedra = kafedraService.createKafedra(kafedraDTO);
        return new ResponseEntity<>(createdKafedra, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<KafedraDTO> getKafedraById(@PathVariable Long id) {
        KafedraDTO kafedraDTO = kafedraService.getKafedraById(id);
        return ResponseEntity.ok(kafedraDTO);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<List<KafedraDTO>> getAllKafedras() {
        List<KafedraDTO> kafedras = kafedraService.getAllKafedras();
        return ResponseEntity.ok(kafedras);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<KafedraDTO> updateKafedra(
            @PathVariable Long id,
            @RequestBody KafedraDTO kafedraDTO) {
        KafedraDTO updatedKafedra = kafedraService.updateKafedra(id, kafedraDTO);
        return ResponseEntity.ok(updatedKafedra);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<Void> deleteKafedra(@PathVariable Long id) {
        kafedraService.deleteKafedra(id);
        return ResponseEntity.noContent().build();
    }
}

