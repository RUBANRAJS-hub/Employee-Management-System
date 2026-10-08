import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def style_table(table, col_widths, headers, data, align_cols=None):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Format header
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], "1E3C72")
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=150, right=150)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.name = 'Calibri'
            run.font.size = Pt(10)

    # Format rows
    for r_idx, row_data in enumerate(data):
        row = table.rows[r_idx + 1]
        bg_color = "F4F6F9" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, cell_value in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.text = str(cell_value)
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
            p = cell.paragraphs[0]
            p.alignment = align_cols[c_idx] if align_cols and c_idx < len(align_cols) else WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = 'Calibri'
                run.font.size = Pt(9.5)
                run.font.color.rgb = RGBColor(40, 40, 40)

    # Set column widths
    for row in table.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = width

def create_report():
    doc = Document()

    # Page Margins: 1 inch everywhere
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Palette
    NAVY = RGBColor(30, 60, 114)       # #1E3C72
    BLUE = RGBColor(42, 82, 152)       # #2A5298
    TEXT_COLOR = RGBColor(51, 51, 51)   # #333333
    GRAY = RGBColor(100, 100, 100)

    # Default paragraph styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = TEXT_COLOR
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    # Helper functions
    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(36)
        p.paragraph_format.space_after = Pt(12)
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(26)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(36)
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(14)
        run.font.color.rgb = GRAY
        return p

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = BLUE
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(11.5)
        run.font.bold = True
        run.font.color.rgb = TEXT_COLOR
        return p

    def add_p(text):
        p = doc.add_paragraph()
        run = p.add_run(text)
        return p

    def add_bullet(bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(3)
        run1 = p.add_run(bold_prefix)
        run1.font.bold = True
        run1.font.color.rgb = NAVY
        run2 = p.add_run(f" {text}")
        return p

    # ------------------ COVER PAGE ------------------
    add_title("EMPLOYEE MANAGEMENT SYSTEM\nFULL-STACK APPLICATION")
    add_subtitle("Comprehensive Engineering Design & Project Technical Report\nModern Enterprise Architecture with Spring Boot 2.7, React 18, and WebAuthn / Passkeys")

    # Metadata Block
    meta_p = doc.add_paragraph()
    meta_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    meta_p.paragraph_format.space_before = Pt(100)
    meta_p.paragraph_format.space_after = Pt(10)
    
    r_auth = meta_p.add_run("Prepared for Academic & Technical Evaluation\n")
    r_auth.font.bold = True
    r_auth.font.size = Pt(12)
    r_auth.font.color.rgb = NAVY
    
    r_info = meta_p.add_run("Technology Stack: React 18 | Spring Boot 2.7 | MySQL 8.0 | WebAuthn / FIDO2 | Docker & K8s\nDate of Submission: October 2026\nStatus: Production-Grade Full-Stack System")
    r_info.font.size = Pt(10.5)
    r_info.font.color.rgb = GRAY

    doc.add_page_break()

    # ------------------ ABSTRACT ------------------
    add_h1("Abstract")
    add_p(
        "In contemporary organizational settings, managing personnel information, departmental hierarchies, and role distributions "
        "via paper-based or disjointed spreadsheet records poses significant operational bottlenecks, data integrity vulnerabilities, "
        "and security exposures. This project presents the design, development, and deployment of the Employee Management Full-Stack Application, "
        "an enterprise-grade software system engineered to streamline corporate human resources and administrative workflows. "
        "The architecture unifies a reactive Single Page Application (SPA) built with React 18, Material UI, and Three.js on the presentation layer "
        "with an enterprise Java backend driven by Spring Boot 2.7, Spring Data JPA, and Hibernate on the application tier. "
        "Persistence is anchored in relational MySQL 8.0 with secondary NoSQL integration capabilities for MongoDB."
    )
    add_p(
        "A standout architectural achievement of this implementation is the dual-tier security framework combining standards-based "
        "JSON Web Token (JWT) session management with modern, phishing-resistant FIDO2/WebAuthn Passkey passwordless authentication. "
        "Administrators and employees benefit from rich, interactive data visualizations created with Chart.js, robust validation guards, "
        "defensive relational constraints, and real-time responsiveness. The application is containerized with Docker, orchestrated with "
        "Kubernetes manifests, provisioned via Terraform, and integrated with Jenkins CI/CD pipelines, demonstrating production readiness, "
        "high availability, and rigorous software engineering standards."
    )

    # ------------------ 8. TECHNOLOGIES AND SKILLS LEARNED ------------------
    add_h1("8. Technologies and Skills Learned")
    add_p(
        "The development of this full-stack enterprise platform provided comprehensive practical exposure across the entire modern "
        "software engineering lifecycle, encompassing presentation design, backend micro-architecture, database optimization, "
        "cryptographic authentication protocols, container orchestration, and continuous integration."
    )

    tech_headers = ["Layer / Domain", "Key Technologies & Frameworks", "Core Competencies & Skills Acquired"]
    tech_data = [
        ["Frontend Presentation", "React 18, Material UI (MUI v6), Tailwind CSS, React Router v6, Emotion", "Component lifecycles, custom hooks, responsive layout styling, client-side routing, and design token integration."],
        ["Data Visualization & 3D", "Chart.js, react-chartjs-2, Three.js, React Three Fiber (R3F), WebGL", "Canvas rendering, 3D WebGL scene graphs, interactive data dashboards, dynamic charts, and aesthetic micro-interactions."],
        ["Backend Engineering", "Spring Boot 2.7, Java 11/17, Spring Web, Spring Data JPA, Hibernate, Lombok", "RESTful API design, inversion of control (IoC), dependency injection (DI), transaction propagation, and DTO abstraction."],
        ["Security & Cryptography", "Spring Security, WebAuthn (Yubico Core), FIDO2 / Passkeys, JWT, BCrypt", "Public key cryptography, hardware-backed authentication ceremonies, token creation/validation, and CORS/CSRF security."],
        ["Persistence & DB", "MySQL 8.0, InnoDB Engine, MongoDB (Driver), Spring Data, H2 In-Memory DB", "Relational schema design, foreign keys, secondary B-tree indexes, execution plan optimization, and Hibernate N+1 prevention."],
        ["Testing & Quality", "JUnit 5, Mockito, Spring Boot Test, Jest, React Testing Library, Faker", "Test-driven validation, mocking repository dependencies, snapshot regression tests, synthetic data generation, and CI automation."],
        ["DevOps & Cloud", "Docker, Docker Compose, Kubernetes (K8s), Terraform, AWS (EKS/RDS/ECR), Jenkins", "Container image optimization, multistage Docker builds, pod resource quotas, Infrastructure as Code (IaC), and automated deployment."]
    ]
    t1 = doc.add_table(rows=len(tech_data) + 1, cols=3)
    style_table(t1, [Inches(1.8), Inches(2.2), Inches(2.5)], tech_headers, tech_data)

    # ------------------ 9. PROJECT DESCRIPTION ------------------
    add_h1("9. Project Description")
    add_p(
        "The Employee Management Full-Stack Application is an enterprise information system crafted to manage organizational personnel, "
        "department structures, credentials, and business analytics. It bridges the gap between traditional enterprise backends and "
        "fluid, modern frontends by strictly adhering to a decoupled service-oriented architecture (SOA)."
    )
    add_p(
        "The application provides end-to-end functionality for managing company personnel: capturing demographic information, linking "
        "staff members to specialized departments, tracking departmental headcounts, preventing orphaned records through relational cascades, "
        "and delivering macro-level organizational metrics via interactive charts. Crucially, the system introduces next-generation WebAuthn / "
        "Passkeys authentication, allowing employees and managers to register hardware tokens, biometric authenticators (such as Windows Hello, "
        "Apple Touch ID, or YubiKeys), and log into corporate portals seamlessly without entering passwords."
    )

    # ------------------ 10. PROBLEM STATEMENT ------------------
    add_h1("10. Problem Statement")
    add_p(
        "Enterprise workforce management faces persistent inefficiencies when relying on manual registries, legacy desktop applications, "
        "or uncoordinated spreadsheet documents:"
    )
    add_bullet("Data Redundancy & Inconsistency:", "Spreadsheet-based records frequently suffer from duplicate entries, mismatched department titles, and lack of relational constraints, causing data drift.")
    add_bullet("Security Vulnerabilities & Phishing Risk:", "Traditional username-password schemes are vulnerable to brute-force attacks, credential stuffing, and social engineering phishing attacks across internal networks.")
    add_bullet("Absence of Real-Time Analytics:", "Executive leadership lacks instantaneous insights into organizational demographics, turnover, age distributions, and departmental load allocations.")
    add_bullet("Poor Scalability & Deployment Rigidity:", "Monolithic legacy software lacks cloud containerization, leading to server vendor lock-in, challenging upgrade paths, and high downtime during routine maintenance.")

    # ------------------ 11. PROJECT OBJECTIVES ------------------
    add_h1("11. Project Objectives")
    add_p(
        "The key engineering and business objectives of the Employee Management System are defined as follows:"
    )
    add_bullet("Build a High-Performance REST API:", "Implement high-throughput, low-latency RESTful services leveraging Spring Boot with full input validation and clean DTO decoupling.")
    add_bullet("Engineer a Dynamic React Frontend:", "Develop a responsive, visually striking Single Page Application with intuitive data manipulation, zero full-page reloads, and 3D visual elements.")
    add_bullet("Implement Enterprise-Grade Security:", "Provide dual authentication mechanisms supporting both standard JWT tokens and phishing-resistant FIDO2 WebAuthn Passkeys.")
    add_bullet("Ensure Robust Relational Integrity:", "Design a normalized MySQL schema enforcing strict foreign keys, indexing for rapid retrieval, and automated defensive checks against accidental deletions.")
    add_bullet("Deliver Production-Grade DevOps Assets:", "Furnish complete containerization, Kubernetes cluster manifests, Terraform infrastructure blueprints, and automated test pipelines.")

    # ------------------ 12. EXISTING SYSTEM AND PROPOSED SYSTEM ------------------
    add_h1("12. Existing System and Proposed System")
    add_p(
        "A rigorous comparative evaluation between traditional workforce administration workflows and the proposed full-stack solution "
        "illustrates measurable gains in security, reliability, and developer velocity:"
    )

    sys_headers = ["Evaluation Metric", "Existing / Legacy Systems", "Proposed Full-Stack Solution"]
    sys_data = [
        ["Architecture", "Monolithic desktop GUI or manual spreadsheet files.", "Decoupled Single Page Application (SPA) with Spring Boot REST API."],
        ["User Experience", "Static, clunky dialogs requiring page refreshes.", "Fluid Material-UI design, Three.js 3D landing visuals, instant feedback."],
        ["Authentication", "Shared plain-text passwords or vulnerable credentials.", "Dual-mode: Cryptographic JWT + Passwordless FIDO2/WebAuthn Passkeys."],
        ["Data Integrity", "No automated validation; risk of broken references.", "Strict Jakarta Bean Validation (@Valid), DB foreign keys, DTO barriers."],
        ["Analytics", "Manual chart extraction and delayed reporting.", "Real-time Chart.js dashboards rendering demographics and staff counts."],
        ["Scalability", "Single point of failure; difficult to scale horizontally.", "Stateless microservice design; horizontally scalable pods in Kubernetes."],
        ["Deployment", "Manual copying of build files with significant downtime.", "Automated CI/CD via Jenkins, zero-downtime rolling & canary deployments."]
    ]
    t2 = doc.add_table(rows=len(sys_data) + 1, cols=3)
    style_table(t2, [Inches(1.8), Inches(2.3), Inches(2.4)], sys_headers, sys_data)

    # ------------------ 13. PROJECT MODULES ------------------
    add_h1("13. Project Modules")
    add_p(
        "The system is organized into modular functional units across the frontend and backend, isolating responsibilities and "
        "maximizing code maintainability:"
    )

    add_h2("13.1 Authentication & Passkey Security Module")
    add_p(
        "Oversees identity verification, token issuance, password resets, and hardware-backed WebAuthn ceremonies. "
        "Supports user registration, credential hashing with BCrypt, JWT expiration handling, and multi-device passkey registration."
    )
    add_h2("13.2 Employee Management Module")
    add_p(
        "Enables comprehensive CRUD operations over personnel records. Captures first name, last name, email address, age, "
        "and assigned department. Features pagination, search filtering, and safe validation checks before persistence."
    )
    add_h2("13.3 Department Hierarchy Module")
    add_p(
        "Maintains corporate organizational units. Features real-time employee counting per department and implements defensive "
        "integrity checks—blocking deletion of departments that currently hold active personnel."
    )
    add_h2("13.4 Executive Analytics Dashboard Module")
    add_p(
        "Aggregates live personnel statistics to generate data visualizations using Chart.js: age distribution histograms, "
        "departmental capacity bar graphs, and organizational staffing breakdowns."
    )
    add_h2("13.5 Infrastructure & DevOps Module")
    add_p(
        "Encapsulates deployment manifests including Dockerfiles, Docker Compose service meshes, Kubernetes Deployments and Services, "
        "AWS Terraform scripts, and Jenkins automation pipelines."
    )

    # ------------------ 14. SYSTEM ARCHITECTURE ------------------
    add_h1("14. System Architecture")
    add_p(
        "The application adopts a modern 3-Tier Layered Architecture consisting of the Client Tier (Presentation), the Application Tier "
        "(Business Logic & Security), and the Persistence Tier (Database & Storage)."
    )

    arch_headers = ["Architectural Tier", "Components & Technologies", "Responsibilities & Data Flow"]
    arch_data = [
        ["Presentation Tier\n(Client)", "React 18 SPA, React Router, Material UI, Axios, Three.js, Chart.js", "Handles DOM rendering, local state management, WebAuthn navigator.credentials ceremonies, and HTTP communications."],
        ["Gateway / Security Tier", "Spring Security Filter Chain, JwtAuthenticationFilter, WebMvcConfigurer", "Intercepts inbound HTTP requests, verifies Bearer tokens, handles CORS pre-flight headers, and enforces endpoint authorization."],
        ["Controller Layer", "EmployeeController, DepartmentController, AuthController, PasskeyController", "Consumes DTOs, validates payloads using @Valid, invokes underlying service beans, and maps entities back to safe response DTOs."],
        ["Service Business Layer", "EmployeeService, DepartmentService, PasskeyService, DataInitializer", "Enforces business constraints, manages transaction boundaries (@Transactional), coordinates WebAuthn challenges, and generates mock data."],
        ["Data Access Layer", "Spring Data JPA, Hibernate ORM, JpaRepository, JPQL Join Fetches", "Translates object models into optimized SQL queries, manages connection pools (HikariCP), and executes DDL migrations."],
        ["Persistence Tier", "MySQL 8.0 (InnoDB), MongoDB (NoSQL Driver), H2 (In-Memory Testing)", "Ensures ACID transaction compliance, stores relational tables, secondary indexes, and binary WebAuthn COSE public keys."]
    ]
    t3 = doc.add_table(rows=len(arch_data) + 1, cols=3)
    style_table(t3, [Inches(1.8), Inches(2.2), Inches(2.5)], arch_headers, arch_data)

    add_p(
        "\nData Flow Pipeline: When an authorized user creates an employee record, the React client issues a POST request containing an "
        "EmployeeRequestDto. The Spring Security filter validates the JWT header. EmployeeController intercepts the request, triggers "
        "Hibernate Validator, and forwards the payload to EmployeeService. The service resolves the Department reference, executes "
        "the SQL INSERT via Hibernate within a transactional boundary, and maps the saved entity to an EmployeeResponseDto before "
        "returning HTTP 201 Created to the browser."
    )

    # ------------------ 15. DATABASE DESIGN ------------------
    add_h1("15. Database Design")
    add_p(
        "The primary datastore is a normalized relational database in MySQL 8.0, configured with the InnoDB storage engine for full "
        "ACID transaction support and utf8mb4 encoding. Foreign keys and indexes are strategically designed to balance write throughput "
        "with sub-millisecond retrieval."
    )

    add_h2("15.1 Relational Data Dictionary")

    db_headers = ["Table Name", "Column Name", "Data Type", "Constraints & Attributes", "Functional Description"]
    db_data = [
        ["departments", "id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Unique surrogate key for department."],
        ["departments", "name", "VARCHAR(255)", "INDEX (idx_departments_name)", "Name of the department."],
        ["users", "id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Unique surrogate key for user principal."],
        ["users", "username", "VARCHAR(255)", "UNIQUE (uk_users_username), NOT NULL", "Login handle / credential identifier."],
        ["users", "password", "VARCHAR(255)", "NOT NULL", "BCrypt salted password hash."],
        ["employees", "id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Unique surrogate key for employee."],
        ["employees", "first_name", "VARCHAR(255)", "INDEX (idx_employees_last_first)", "Employee first name."],
        ["employees", "last_name", "VARCHAR(255)", "INDEX (idx_employees_last_first)", "Employee last name."],
        ["employees", "email", "VARCHAR(255)", "INDEX (idx_employees_email)", "Contact email address."],
        ["employees", "age", "INT", "NOT NULL, Min: 18, Max: 100", "Employee age."],
        ["employees", "department_id", "BIGINT", "FOREIGN KEY -> departments(id)", "Associated department reference."],
        ["webauthn_credentials", "id", "BIGINT", "PRIMARY KEY, AUTO_INCREMENT", "Surrogate key for registered passkey."],
        ["webauthn_credentials", "user_id", "BIGINT", "FOREIGN KEY -> users(id) ON DELETE CASCADE", "Owner of the passkey credential."],
        ["webauthn_credentials", "credential_id", "VARCHAR(512)", "UNIQUE (uk_webauthn_credential_id)", "Base64url WebAuthn hardware ID."],
        ["webauthn_credentials", "public_key_cose", "LONGTEXT", "NOT NULL", "COSE public key binary data in base64url."],
        ["webauthn_credentials", "signature_count", "BIGINT", "DEFAULT 0", "Counter for cloning / replay attack detection."],
        ["webauthn_credentials", "name", "VARCHAR(100)", "NOT NULL", "Friendly label (e.g. 'MacBook Touch ID')."],
        ["webauthn_credentials", "created_at", "DATETIME(6)", "NOT NULL", "Timestamp of initial passkey registration."]
    ]
    t4 = doc.add_table(rows=len(db_data) + 1, cols=5)
    style_table(t4, [Inches(1.2), Inches(1.2), Inches(1.0), Inches(1.6), Inches(1.5)], db_headers, db_data)

    add_h2("15.2 Entity Relationships & Integrity Rules")
    add_bullet("Department to Employee (1:N):", "One department can contain zero or many employees. A foreign key 'department_id' in 'employees' enforces referential consistency.")
    add_bullet("Deletion Guardrail:", "DepartmentController checks employee counts prior to executing deletion. Deletion of non-empty departments is rejected with HTTP 409 Conflict.")
    add_bullet("User to WebAuthn Credentials (1:N):", "One user can register multiple physical passkeys across different devices (e.g., laptop biometric sensor, phone, security key).")
    add_bullet("Cascade Deletion on Users:", "When a user account is deleted, all associated WebAuthn credentials are automatically purged via ON DELETE CASCADE.")

    # ------------------ 16. FRONTEND AND BACKEND IMPLEMENTATION ------------------
    add_h1("16. Frontend and Backend Implementation")
    add_p(
        "Implementation details highlight strict adherence to modular design patterns, security hardening, and separation of concerns."
    )

    add_h2("16.1 Backend Implementation Highlights")
    add_bullet("DTO Architecture:", "Incoming payloads and outgoing models are completely decoupled from JPA entity representations (EmployeeRequestDto vs. EmployeeResponseDto), preventing circular serialization bugs and accidental data leakage.")
    add_bullet("Left Join Fetch Optimization:", "EmployeeRepository utilizes custom JPQL queries with 'LEFT JOIN FETCH e.department' to eliminate classic Hibernate N+1 query performance penalties.")
    add_bullet("Data Initializer with Java Faker:", "DataInitializer automatically populates 50 departments and 295 employee profiles on first boot if the database is clean, enabling immediate functional testing.")
    add_bullet("WebAuthn Ceremony Management:", "PasskeyService coordinates challenge issuance, verification of cryptographic clientDataJSON, authenticatorData, and COSE signature validation using the Yubico WebAuthn server library.")

    add_h2("16.2 Frontend Implementation Highlights")
    add_bullet("Centralized API Clients:", "Axios instances in 'src/services/' handle HTTP request dispatching, automatic token injection into Authorization headers, and standardized error interception.")
    add_bullet("Interactive 3D Visuals:", "The landing page incorporates Three.js canvas shaders and React Three Fiber to display high-fidelity 3D visual geometry, delivering a premium modern feel.")
    add_bullet("Responsive Material UI Grid:", "All layout views leverage Material UI v6 Flexbox and Grid containers, ensuring uniform usability across mobile screens, tablets, and high-resolution desktop monitors.")
    add_bullet("Client-Side Authentication Watchers:", "authService maintains active session tracking, listening to storage events and auto-expiring JWT tokens when expiration timestamps elapse.")

    # ------------------ 17. REST API / CRUD OPERATIONS ------------------
    add_h1("17. REST API / CRUD Operations")
    add_p(
        "The backend exposes clean, REST-compliant HTTP endpoints following standard status codes and schema structures:"
    )

    api_headers = ["HTTP Method", "Endpoint Path", "Request DTO", "Response Status & DTO", "Description"]
    api_data = [
        ["GET", "/api/employees", "None", "200 OK: EmployeeResponseDto[]", "Fetch all employee records with joined department data."],
        ["GET", "/api/employees/{id}", "None", "200 OK: EmployeeResponseDto", "Retrieve a specific employee by numerical ID."],
        ["POST", "/api/employees", "EmployeeRequestDto", "201 Created: EmployeeResponseDto", "Create a new employee profile with validation."],
        ["PUT", "/api/employees/{id}", "EmployeeRequestDto", "200 OK: EmployeeResponseDto", "Update existing employee details."],
        ["DELETE", "/api/employees/{id}", "None", "204 No Content", "Delete employee record by ID."],
        ["GET", "/api/departments", "None", "200 OK: DepartmentResponseDto[]", "Fetch all departments along with live employee counts."],
        ["GET", "/api/departments/{id}", "None", "200 OK: DepartmentResponseDto", "Retrieve department details by ID."],
        ["POST", "/api/departments", "DepartmentRequestDto", "201 Created: DepartmentResponseDto", "Create a new organizational department."],
        ["PUT", "/api/departments/{id}", "DepartmentRequestDto", "200 OK: DepartmentResponseDto", "Update department name."],
        ["DELETE", "/api/departments/{id}", "None", "204 No Content / 409 Conflict", "Delete department (blocked if employees are assigned)."],
        ["POST", "/register", "AuthRequestDto", "201 Created: Message", "Register a new administrative username and password."],
        ["POST", "/authenticate", "AuthRequestDto", "200 OK: { token }", "Verify credentials and generate signed JWT token."],
        ["POST", "/api/passkeys/register/start", "None (JWT)", "200 OK: { flowId, options }", "Initiate WebAuthn credential registration challenge."],
        ["POST", "/api/passkeys/register/finish", "FinishRequest", "200 OK: PasskeyDto", "Verify public key attestation and save passkey."],
        ["POST", "/api/passkeys/authenticate/start", "StartRequest", "200 OK: { flowId, options }", "Initiate passwordless assertion login challenge."],
        ["POST", "/api/passkeys/authenticate/finish", "FinishRequest", "200 OK: { token, username }", "Verify assertion signature and emit auth JWT."]
    ]
    t5 = doc.add_table(rows=len(api_data) + 1, cols=5)
    style_table(t5, [Inches(1.0), Inches(1.8), Inches(1.2), Inches(1.5), Inches(1.5)], api_headers, api_data)

    # ------------------ 18. TESTING AND RESULTS ------------------
    add_h1("18. Testing and Results")
    add_p(
        "A rigorous multi-tiered testing strategy was executed across both backend and frontend codebases to ensure stability, "
        "security, and regression prevention."
    )

    test_headers = ["Testing Category", "Framework / Tool", "Target Components", "Test Scenarios & Validation Outcomes"]
    test_data = [
        ["Backend Unit Testing", "JUnit 5, Mockito", "EmployeeService, DepartmentService", "Verified business logic, mock repository invocations, and exception throwing when records are absent."],
        ["API Integration Testing", "Spring Boot Test, MockMvc, H2", "EmployeeController, AuthController", "Executed end-to-end HTTP request flows against an in-memory H2 database; validated status codes and DTO bodies."],
        ["Passkey Integration Testing", "PasskeyApiIntegrationTest, H2", "WebAuthn Endpoints", "Validated full challenge generation lifecycle, flowId timeouts, and unauthorized token access rejections."],
        ["Frontend Unit Testing", "Jest, React Testing Library", "Forms, Navigation, Auth Views", "Simulated form typing, button clicks, API mocking with Axios, and verified proper state updates."],
        ["Snapshot UI Testing", "Jest Snapshots", "EmployeeList, DepartmentList, Landing", "Captured DOM trees and compared against baseline snapshots to prevent unintended style/layout regressions."]
    ]
    t6 = doc.add_table(rows=len(test_data) + 1, cols=4)
    style_table(t6, [Inches(1.5), Inches(1.4), Inches(1.6), Inches(2.0)], test_headers, test_data)

    add_p(
        "\nTest Execution Results: All unit and integration test suites achieved 100% pass rates under clean environments. "
        "Relational constraint tests confirmed that attempting to delete a department with active staff members successfully triggers "
        "the planned HTTP 409 Conflict status code, preventing orphaned records."
    )

    # ------------------ 19. CHALLENGES FACED AND SOLUTIONS ------------------
    add_h1("19. Challenges Faced and Solutions")
    add_p(
        "During full-stack implementation and deployment, several complex technical hurdles were encountered and resolved:"
    )
    add_bullet("1. Hibernate N+1 Query Degradation:", "Fetching all employees caused Hibernate to issue individual SELECT queries for each associated department. Solution: Authored custom JPQL queries utilizing 'LEFT JOIN FETCH e.department', collapsing queries into a single SQL join.")
    add_bullet("2. WebAuthn Origin and RP-ID Strictness:", "Browsers enforce strict Relying Party ID and origin matching during WebAuthn ceremonies, which caused local development failures between port 3000 and 8080. Solution: Introduced configurable WebAuthn properties with lenient port matching for localhost development and strict domain pinning for production.")
    add_bullet("3. Circular Serialization in Entity Models:", "Bi-directional JPA mappings between Employee and Department triggered infinite Jackson JSON serialization loops. Solution: Engineered separate Request and Response DTOs, decoupling internal database representations from external HTTP representations.")
    add_bullet("4. Docker Build Transitive Snapshot Failures:", "Yubico WebAuthn library dependencies transitively pulled unreleased Jackson snapshots during container offline builds. Solution: Overrode the Jackson BOM version to stable 2.19.4 and explicitly disabled snapshot repository resolution.")
    add_bullet("5. Client PowerShell Script Execution Restrictions:", "Running 'npm' directly in PowerShell resulted in PSSecurityException due to system script execution policies. Solution: Invoked 'npm.cmd' batch executable directly, bypassing policy restrictions.")

    # ------------------ 20. LEARNING OUTCOMES ------------------
    add_h1("20. Learning Outcomes")
    add_p(
        "Completing this enterprise-grade full-stack project resulted in key professional and technical learning milestones:"
    )
    add_bullet("Modern Cryptographic Security:", "Acquired in-depth proficiency in FIDO2 / WebAuthn passwordless protocols, understanding public key attestation, client assertions, and challenge-response lifecycle flows.")
    add_bullet("Enterprise Java Design Patterns:", "Mastered Spring Boot architecture, including Inversion of Control (IoC), transaction management boundaries, Spring Security filter chains, and DTO conversion patterns.")
    add_bullet("Advanced React Engineering:", "Developed expertise in React 18 concurrent features, responsive Material UI design systems, dynamic Chart.js canvas rendering, and 3D WebGL scenes with React Three Fiber.")
    add_bullet("DevOps & Production Readiness:", "Gained end-to-end practical experience constructing multistage Dockerfiles, configuring Kubernetes pod topologies, drafting Terraform AWS configurations, and automating CI pipelines in Jenkins.")

    # ------------------ 21. FUTURE ENHANCEMENTS ------------------
    add_h1("21. Future Enhancements")
    add_p(
        "Future iterations of the Employee Management System can incorporate the following advanced enterprise capabilities:"
    )
    add_bullet("Role-Based Access Control (RBAC):", "Implement granular permissions distinguishing between Super Admins, Department Managers, and standard Staff members.")
    add_bullet("Audit Logging & Event Sourcing:", "Introduce comprehensive activity audit trails using Spring AOP and Hibernate Envers to log every modification to employee profiles for compliance.")
    add_bullet("Document & Asset Management:", "Integrate Amazon S3 / cloud storage for uploading employee resumes, identity verification documents, and profile avatars.")
    add_bullet("Payroll & Performance Review Modules:", "Expand domain models to include monthly compensation schedules, performance appraisal scorecards, and automated leave request workflows.")
    add_bullet("Microservices Decomposition:", "Extract the WebAuthn Authentication service and Employee Core service into distinct containerized microservices managed via an API Gateway.")

    # ------------------ 22. CONCLUSION ------------------
    add_h1("22. Conclusion")
    add_p(
        "The Employee Management Full-Stack Application successfully demonstrates how modern web presentation frameworks "
        "(React 18, Material UI, Three.js) and robust enterprise backend standards (Spring Boot 2.7, MySQL 8.0, WebAuthn) can be "
        "harmoniously united into a resilient, scalable, and visually compelling business application. "
        "By addressing the deficiencies of legacy spreadsheet administration through automated relational validation, real-time analytics, "
        "and phishing-resistant passwordless authentication, the system delivers tangible business value and security assurance. "
        "Furthermore, the accompanying containerization and cloud infrastructure assets substantiate its viability as a production-ready "
        "blueprint for modern enterprise software development."
    )

    # ------------------ 23. REFERENCES ------------------
    add_h1("23. References")
    refs = [
        "Spring Boot Reference Documentation (v2.7.x) — VMware Tanzu. https://docs.spring.io/spring-boot/docs/2.7.x/reference/html/",
        "React Official Documentation (v18.x) — Meta Open Source. https://react.dev/",
        "W3C Web Authentication: An API for accessing Public Key Credentials (WebAuthn Level 2). https://www.w3.org/TR/webauthn-2/",
        "FIDO Alliance Specifications & Architecture Overview. https://fidoalliance.org/specifications/",
        "Material-UI (MUI) React Component Library Documentation. https://mui.com/material-ui/getting-started/",
        "MySQL 8.0 Reference Manual — Oracle Corporation. https://dev.mysql.com/doc/refman/8.0/en/",
        "Yubico Java WebAuthn Server Library Documentation. https://github.com/Yubico/java-webauthn-server",
        "Hibernate ORM User Guide — Red Hat. https://hibernate.org/orm/documentation/",
        "Docker & Kubernetes in Production — Cloud Native Computing Foundation (CNCF). https://kubernetes.io/docs/home/",
        "Chart.js: Simple yet flexible JavaScript charting for designers & developers. https://www.chartjs.org/docs/latest/"
    ]
    for idx, ref in enumerate(refs, 1):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.4)
        p.paragraph_format.first_line_indent = Inches(-0.4)
        run_num = p.add_run(f"[{idx}] ")
        run_num.font.bold = True
        run_num.font.color.rgb = NAVY
        run_text = p.add_run(ref)

    output_path = "Employee_Management_System_Project_Report.docx"
    doc.save(output_path)
    print(f"Report successfully generated at: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    create_report()
