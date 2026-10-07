package com.example.sessionauth.controller;

import com.example.sessionauth.dto.DocumentDTO;
import com.example.sessionauth.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }


    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<DocumentDTO> createDocument(@RequestBody DocumentDTO documentDTO) {
        DocumentDTO createdDocument = documentService.createDocument(documentDTO);
        return new ResponseEntity<>(createdDocument, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<DocumentDTO> getDocumentById(@PathVariable Long id) {
        DocumentDTO documentDTO = documentService.getDocumentById(id);
        return ResponseEntity.ok(documentDTO);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<List<DocumentDTO>> getAllDocuments() {
        List<DocumentDTO> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<DocumentDTO> updateDocument(
            @PathVariable Long id,
            @RequestBody DocumentDTO documentDTO) {
        DocumentDTO updatedDocument = documentService.updateDocument(id, documentDTO);
        return ResponseEntity.ok(updatedDocument);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}