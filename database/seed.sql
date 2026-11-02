-- HireHub Seed Data
-- Passwords are encrypted with BCrypt ($2a$10$...)

-- Admin: admin@hirehub.com / Admin@123456
INSERT INTO users (id, email, password, full_name, role, is_active, created_at, updated_at)
VALUES (1, 'admin@hirehub.com', '$2a$10$w0/5k7rUo1j/1XkPzO4cZeZ2E6p2M8aQ8rY6K.Zz7uJ8T2kQ6sW9K', 'HireHub Administrator', 'ADMIN', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Recruiter: recruiter@techcorp.com / Recruiter@123456
INSERT INTO users (id, email, password, full_name, role, is_active, created_at, updated_at)
VALUES (2, 'recruiter@techcorp.com', '$2a$10$w0/5k7rUo1j/1XkPzO4cZeZ2E6p2M8aQ8rY6K.Zz7uJ8T2kQ6sW9K', 'Sarah Jenkins', 'RECRUITER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Candidate: candidate@hirehub.com / Candidate@123456
INSERT INTO users (id, email, password, full_name, role, is_active, created_at, updated_at)
VALUES (3, 'candidate@hirehub.com', '$2a$10$w0/5k7rUo1j/1XkPzO4cZeZ2E6p2M8aQ8rY6K.Zz7uJ8T2kQ6sW9K', 'Alex Morgan', 'CANDIDATE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Company
INSERT INTO companies (id, name, description, website, industry, company_size, location, logo_url)
VALUES (1, 'TechCorp Innovations', 'Leading enterprise cloud software and AI solutions provider.', 'https://techcorp.example.com', 'Information Technology', '500-1000 employees', 'San Francisco, CA', 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&q=80')
ON CONFLICT DO NOTHING;

-- Recruiter Profile
INSERT INTO recruiter_profiles (id, user_id, company_id, phone, designation, is_approved, approval_notes)
VALUES (1, 2, 1, '+1 (555) 234-5678', 'Lead Technical Talent Partner', TRUE, 'Verified enterprise employer partner.')
ON CONFLICT DO NOTHING;

-- Candidate Profile
INSERT INTO candidate_profiles (id, user_id, phone, headline, summary, current_location, linkedin_url, github_url, skills_text)
VALUES (1, 3, '+1 (555) 987-6543', 'Full Stack Java & React Developer', 'Passionate software engineer with 4+ years creating responsive web applications with React, Tailwind CSS, and scalable Spring Boot backend architectures.', 'San Jose, CA', 'https://linkedin.com/in/alexmorgan-demo', 'https://github.com/alexmorgan-demo', 'Java, Spring Boot, React, JavaScript, TypeScript, PostgreSQL, Docker, Git, RESTful APIs')
ON CONFLICT DO NOTHING;

-- Jobs
INSERT INTO jobs (id, recruiter_id, company_id, title, description, required_skills, location, employment_type, experience_requirements, min_salary, max_salary, openings, qualification_requirements, application_deadline, status)
VALUES (1, 2, 1, 'Senior Full-Stack Engineer (React & Java)', 'Lead the design and development of our core cloud microservices and responsive React web applications.', 'Java 17, Spring Boot, React, Tailwind CSS, PostgreSQL, Docker, AWS, REST APIs', 'Remote (US/Global)', 'REMOTE', '5+ years in full-stack web software development', 130000.00, 170000.00, 3, 'B.S. or M.S. in Computer Science or equivalent practical experience', CURRENT_DATE + INTERVAL '60 days', 'OPEN'),
       (2, 2, 1, 'Backend Engineer (Spring Boot & Microservices)', 'Join our core backend infrastructure team scaling our distributed microservices and database streaming architectures.', 'Java, Spring Boot, Spring Security, Hibernate, PostgreSQL, Kafka, Redis', 'New York, NY (Hybrid)', 'HYBRID', '3-5 years backend engineering experience', 115000.00, 150000.00, 2, 'Bachelor''s degree in Computer Engineering or related discipline', CURRENT_DATE + INTERVAL '45 days', 'OPEN')
ON CONFLICT DO NOTHING;
