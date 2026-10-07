package com.example.sessionauth.service;

import com.example.sessionauth.dto.DocumentDTO;
import com.example.sessionauth.entity.Document;
import com.example.sessionauth.entity.User;
import com.example.sessionauth.repository.DocumentRepository;
import com.example.sessionauth.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public DocumentService(DocumentRepository documentRepository, UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public DocumentDTO createDocument(DocumentDTO documentDTO) {
        User user = userRepository.findById(documentDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Document document = new Document();
        document.setName(documentDTO.getName());
        document.setBytes(documentDTO.getBytes());
        document.setUser(user);

        Document savedDocument = documentRepository.save(document);
        return convertToDTO(savedDocument);
    }

    public DocumentDTO getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
        return convertToDTO(document);
    }

    public List<DocumentDTO> getAllDocuments() {
        return documentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DocumentDTO updateDocument(Long id, DocumentDTO documentDTO) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        User user = userRepository.findById(documentDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        document.setName(documentDTO.getName());
        document.setBytes(documentDTO.getBytes());
        document.setUser(user);

        Document updatedDocument = documentRepository.save(document);
        return convertToDTO(updatedDocument);
    }

    @Transactional
    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    private DocumentDTO convertToDTO(Document document) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(document.getId());
        dto.setName(document.getName());
        dto.setBytes(document.getBytes());
        dto.setUserId(document.getUser().getId());
        return dto;
    }
}
