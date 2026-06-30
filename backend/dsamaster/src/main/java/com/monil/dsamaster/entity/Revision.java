package com.monil.dsamaster.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "revisions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Revision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "revisions"})
    @ToString.Exclude
    private Problem problem;

    private LocalDate dueDate;

    private int intervalDays;

    private String status; // Pending, Done, Overdue
}
