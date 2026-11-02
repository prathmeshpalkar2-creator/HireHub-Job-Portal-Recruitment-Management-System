package com.hirehub.config;

import com.hirehub.entity.*;
import com.hirehub.enums.EmploymentType;
import com.hirehub.enums.JobStatus;
import com.hirehub.enums.Role;
import com.hirehub.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${hirehub.admin.email:admin@hirehub.com}")
    private String adminEmail;

    @Value("${hirehub.admin.password:Admin@123456}")
    private String adminPassword;

    @Value("${hirehub.admin.name:HireHub System Administrator}")
    private String adminName;

    public DataInitializer(
            UserRepository userRepository,
            CandidateProfileRepository candidateProfileRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedAdminUser();
        seedInitialSampleData();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail(adminEmail.toLowerCase().trim())) {
            User admin = new User();
            admin.setEmail(adminEmail.toLowerCase().trim());
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setFullName(adminName);
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
            logger.info("Default Administrator initialized successfully with email: {}", adminEmail);
        }
    }

    private void seedInitialSampleData() {
        if (jobRepository.count() == 0) {
            logger.info("Seeding initial demo recruiter, company, and job postings...");

            // 1. Approved Recruiter
            String recruiterEmail = "recruiter@techcorp.com";
            if (!userRepository.existsByEmail(recruiterEmail)) {
                User recruiterUser = new User();
                recruiterUser.setEmail(recruiterEmail);
                recruiterUser.setPassword(passwordEncoder.encode("Recruiter@123456"));
                recruiterUser.setFullName("Sarah Jenkins");
                recruiterUser.setRole(Role.RECRUITER);
                recruiterUser.setActive(true);
                User savedRecruiter = userRepository.save(recruiterUser);

                Company techCorp = new Company();
                techCorp.setName("TechCorp Innovations");
                techCorp.setDescription("Leading enterprise cloud software and AI solutions provider.");
                techCorp.setWebsite("https://techcorp.example.com");
                techCorp.setIndustry("Information Technology");
                techCorp.setCompanySize("500-1000 employees");
                techCorp.setLocation("San Francisco, CA");
                techCorp.setLogoUrl("https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&q=80");
                Company savedCompany = companyRepository.save(techCorp);

                RecruiterProfile recruiterProfile = new RecruiterProfile(savedRecruiter);
                recruiterProfile.setPhone("+1 (555) 234-5678");
                recruiterProfile.setDesignation("Lead Technical Talent Partner");
                recruiterProfile.setCompany(savedCompany);
                recruiterProfile.setApproved(true);
                recruiterProfile.setApprovalNotes("Verified enterprise employer partner.");
                recruiterProfileRepository.save(recruiterProfile);

                // Sample Jobs
                Job job1 = new Job();
                job1.setRecruiter(savedRecruiter);
                job1.setCompany(savedCompany);
                job1.setTitle("Senior Full-Stack Engineer (React & Java)");
                job1.setDescription("We are seeking an experienced Full-Stack Engineer to lead the design and development of our core cloud microservices and responsive React web applications.");
                job1.setRequiredSkills("Java 17, Spring Boot, React, Tailwind CSS, PostgreSQL, Docker, AWS, REST APIs");
                job1.setLocation("Remote (US/Global)");
                job1.setEmploymentType(EmploymentType.REMOTE);
                job1.setExperienceRequirements("5+ years in full-stack web software development");
                job1.setMinSalary(new BigDecimal("130000.00"));
                job1.setMaxSalary(new BigDecimal("170000.00"));
                job1.setOpenings(3);
                job1.setQualificationRequirements("B.S. or M.S. in Computer Science or equivalent practical experience");
                job1.setApplicationDeadline(LocalDate.now().plusMonths(2));
                job1.setStatus(JobStatus.OPEN);
                jobRepository.save(job1);

                Job job2 = new Job();
                job2.setRecruiter(savedRecruiter);
                job2.setCompany(savedCompany);
                job2.setTitle("Backend Engineer (Spring Boot & Microservices)");
                job2.setDescription("Join our core backend infrastructure team scaling our distributed microservices and database streaming architectures.");
                job2.setRequiredSkills("Java, Spring Boot, Spring Security, Hibernate, PostgreSQL, Kafka, Redis");
                job2.setLocation("New York, NY (Hybrid)");
                job2.setEmploymentType(EmploymentType.HYBRID);
                job2.setExperienceRequirements("3-5 years backend engineering experience");
                job2.setMinSalary(new BigDecimal("115000.00"));
                job2.setMaxSalary(new BigDecimal("150000.00"));
                job2.setOpenings(2);
                job2.setQualificationRequirements("Bachelor's degree in Computer Engineering or related discipline");
                job2.setApplicationDeadline(LocalDate.now().plusMonths(1));
                job2.setStatus(JobStatus.OPEN);
                jobRepository.save(job2);
            }

            // 2. Demo Candidate
            String candidateEmail = "candidate@hirehub.com";
            if (!userRepository.existsByEmail(candidateEmail)) {
                User candidateUser = new User();
                candidateUser.setEmail(candidateEmail);
                candidateUser.setPassword(passwordEncoder.encode("Candidate@123456"));
                candidateUser.setFullName("Alex Morgan");
                candidateUser.setRole(Role.CANDIDATE);
                candidateUser.setActive(true);
                User savedCandidate = userRepository.save(candidateUser);

                CandidateProfile profile = new CandidateProfile(savedCandidate);
                profile.setPhone("+1 (555) 987-6543");
                profile.setHeadline("Full Stack Java & React Developer | Cloud & REST APIs");
                profile.setSummary("Passionate software engineer with 4+ years creating responsive web applications with React, Tailwind CSS, and scalable Spring Boot backend architectures.");
                profile.setCurrentLocation("San Jose, CA");
                profile.setLinkedinUrl("https://linkedin.com/in/alexmorgan-demo");
                profile.setGithubUrl("https://github.com/alexmorgan-demo");
                profile.setSkillsText("Java, Spring Boot, React, JavaScript, TypeScript, PostgreSQL, Docker, Git, RESTful APIs");

                Education edu = new Education();
                edu.setCandidateProfile(profile);
                edu.setInstitution("University of California, Berkeley");
                edu.setDegree("B.S. in Computer Science");
                edu.setFieldOfStudy("Computer Science");
                edu.setStartYear(2018);
                edu.setGraduationYear(2022);
                edu.setGrade("3.85 GPA");
                profile.getEducations().add(edu);

                WorkExperience exp = new WorkExperience();
                exp.setCandidateProfile(profile);
                exp.setCompanyName("CloudSphere Technologies");
                exp.setJobTitle("Software Engineer");
                exp.setLocation("San Jose, CA");
                exp.setStartDate("July 2022");
                exp.setEndDate("Present");
                exp.setCurrentlyWorking(true);
                exp.setDescription("Developed and maintained secure Spring Boot REST APIs handling 50k+ daily transactions; improved frontend load performance by 35% with React memoization.");
                profile.getWorkExperiences().add(exp);

                candidateProfileRepository.save(profile);
                logger.info("Demo candidate Alex Morgan initialized successfully.");
            }
        }
    }
}
