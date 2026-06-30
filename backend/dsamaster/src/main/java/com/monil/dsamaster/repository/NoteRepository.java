package com.monil.dsamaster.repository;

import com.monil.dsamaster.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    Optional<Note> findByProblemIdAndUserId(Long problemId, Long userId);
}
