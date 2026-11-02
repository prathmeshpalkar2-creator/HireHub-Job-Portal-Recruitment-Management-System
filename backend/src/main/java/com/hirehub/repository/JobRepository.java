package com.hirehub.repository;

import com.hirehub.entity.Job;
import com.hirehub.enums.EmploymentType;
import com.hirehub.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByRecruiterId(Long recruiterId, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = :status AND " +
           "(:currentDate IS NULL OR j.applicationDeadline IS NULL OR j.applicationDeadline >= :currentDate) AND " +
           "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " (j.company IS NOT NULL AND LOWER(j.company.name) LIKE LOWER(CONCAT('%', :search, '%')))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:employmentType IS NULL OR j.employmentType = :employmentType) AND " +
           "(:minSalary IS NULL OR j.maxSalary >= :minSalary)")
    Page<Job> searchJobs(
            @Param("status") JobStatus status,
            @Param("currentDate") LocalDate currentDate,
            @Param("search") String search,
            @Param("location") String location,
            @Param("employmentType") EmploymentType employmentType,
            @Param("minSalary") BigDecimal minSalary,
            Pageable pageable
    );

    long countByStatus(JobStatus status);

    long countByRecruiterId(Long recruiterId);

    long countByRecruiterIdAndStatus(Long recruiterId, JobStatus status);

    List<Job> findTop5ByStatusOrderByCreatedAtDesc(JobStatus status);
}
