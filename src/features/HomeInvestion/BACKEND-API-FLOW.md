# Home Investigation — Backend API Flow Document

> This document describes the backend API endpoints, database schema, business logic, and data flow required to support the Home Investigation frontend.  
> **Frontend service files:** `src/features/HomeInvestion/service/service.ts` (3-status system) and `src/features/HomeInvestion/service/investigationService.ts` (legacy 5-status system)  
> **Base URL (from axios config):** `http://127.0.0.1:8000/api`

---

## Table of Contents

1. [Overview & Status Flow](#1-overview--status-flow)
2. [Database Schema](#2-database-schema)
3. [API Endpoints](#3-api-endpoints)
   - [3.1 Page Metadata](#31-page-metadata)
   - [3.2 Candidates List](#32-candidates-list)
   - [3.3 Investigation Form Data](#33-investigation-form-data)
   - [3.4 Save Draft](#34-save-draft)
   - [3.5 Submit Investigation](#35-submit-investigation)
   - [3.6 Selection List Endpoints](#36-selection-list-endpoints)
   - [3.7 Attachments](#37-attachments)
   - [3.8 Legacy 5-Status Endpoints](#38-legacy-5-status-endpoints)
4. [Data Flow Diagrams](#4-data-flow-diagrams)
5. [Authorization & Role Rules](#5-authorization--role-rules)
6. [Key Business Logic](#6-key-business-logic)

---

## 1. Overview & Status Flow

The Home Investigation feature has **two status systems** used across different views:

### 1A. New 3-Status System (Main View)

Used by `HomeInvestigationView.vue` — the primary workspace where investigators manage their assigned candidates.

```
Assigned ──► In Progress ──► Submitted
```

| Status        | Meaning                                                      |
|---------------|--------------------------------------------------------------|
| `Assigned`    | Investigator has been assigned. Form is empty.               |
| `In Progress` | Draft saved. Investigator has filled some fields.            |
| `Submitted`   | Investigation submitted for review. Form becomes read-only.  |

### 1B. Legacy 5-Status System (List / Detail Views)

Used by list, detail, create, dashboard, and investigator form views.

```
Pending ──► In Progress ──► Submitted ──► Approved
                                      └──► Rejected
```

| Status        | Meaning                                                     |
|---------------|-------------------------------------------------------------|
| `Pending`     | Created but not yet started.                                |
| `In Progress` | Draft saved with partial data.                              |
| `Submitted`   | Completed and submitted for manager review.                 |
| `Approved`    | Manager approved the investigation.                         |
| `Rejected`    | Manager rejected with a reason.                             |

---

## 2. Database Schema

### 2.1 `home_investigations` Table (Core Table)

Stores the main investigation record per candidate.

| Column                   | Type           | Constraints                     | Description                                       |
|--------------------------|----------------|----------------------------------|---------------------------------------------------|
| `id`                     | UUID / BIGINT  | PK                               | Primary key                                       |
| `candidate_id`           | VARCHAR(20)    | NOT NULL, UNIQUE                 | Reference to candidate (e.g. `C00001`)            |
| `candidate_name`         | VARCHAR(255)   | NOT NULL                         | Denormalized candidate name for fast display      |
| `campaign`               | VARCHAR(255)   | NOT NULL                         | Campaign name (e.g. `2026 Intake`)                |
| `gender`                 | VARCHAR(20)    | NULLABLE                         | Candidate gender                                  |
| `phone_number`           | VARCHAR(50)    | NULLABLE                         | Candidate phone number                            |
| `current_address`        | TEXT           | NULLABLE                         | Candidate current address                         |
| `assigned_investigator`  | VARCHAR(255)   | NOT NULL                         | Investigator name assigned to this candidate      |
| `current_status`         | ENUM / VARCHAR | NOT NULL, DEFAULT `'Assigned'`   | `Assigned`, `In Progress`, `Submitted`            |
| `visit_date`             | DATE           | NULLABLE                         | Date of the visit                                 |
| `location`               | TEXT           | NULLABLE                         | Address/location visited                          |
| `gps_coordinates`        | VARCHAR(100)   | NULLABLE                         | GPS latitude, longitude (e.g. `11.5564, 104.9282`)|
| `people_met`             | TEXT           | NULLABLE                         | People met during the visit                       |
| `observations`           | TEXT           | NULLABLE                         | Investigator's observations                       |
| `findings`               | TEXT           | NULLABLE                         | Investigation findings                            |
| `recommendation`         | ENUM / VARCHAR | NULLABLE                         | `Recommend`, `Not Recommend`, or empty            |
| `reason`                 | TEXT           | NULLABLE                         | Reason for the recommendation                     |
| `created_at`             | TIMESTAMP      | NOT NULL, DEFAULT NOW()          |                                                   |
| `updated_at`             | TIMESTAMP      | NOT NULL, DEFAULT NOW()          |                                                   |
| `submitted_at`           | TIMESTAMP      | NULLABLE                         | Timestamp of submission                           |
| `approved_at`            | TIMESTAMP      | NULLABLE                         | Timestamp of approval (5-status only)             |
| `rejected_at`            | TIMESTAMP      | NULLABLE                         | Timestamp of rejection (5-status only)            |
| `rejection_reason`       | TEXT           | NULLABLE                         | Reason for rejection (5-status only)              |
| `notes`                  | TEXT           | NULLABLE                         | Additional notes (5-status only)                  |
| `summary`                | TEXT           | NULLABLE                         | Investigation summary (5-status only)             |

**Indexes:**
- `idx_candidate_id` on `candidate_id`
- `idx_current_status` on `current_status`
- `idx_assigned_investigator` on `assigned_investigator`
- `idx_campaign` on `campaign`
- Composite index: `(assigned_investigator, current_status)`

### 2.2 `investigation_attachments` Table

Stores file attachments linked to an investigation.

| Column             | Type           | Constraints      | Description                                       |
|--------------------|----------------|------------------|---------------------------------------------------|
| `id`               | UUID / BIGINT  | PK               | Primary key                                       |
| `investigation_id` | UUID / BIGINT  | FK, NOT NULL     | References `home_investigations.id`               |
| `file_name`        | VARCHAR(255)   | NOT NULL         | Original file name                                |
| `file_type`        | VARCHAR(20)    | NOT NULL         | `image`, `pdf`, or `docx`                         |
| `file_size`        | BIGINT         | NOT NULL         | File size in bytes                                |
| `file_path`        | TEXT           | NOT NULL         | Server storage path or S3 key                     |
| `mime_type`        | VARCHAR(100)   | NULLABLE         | e.g. `image/jpeg`, `application/pdf`              |
| `uploaded_at`      | TIMESTAMP      | NOT NULL, DEFAULT NOW() |                                            |

### 2.3 `investigation_history` Table (5-Status System Only)

Tracks status changes and actions on investigations.

| Column              | Type           | Constraints      | Description                                   |
|---------------------|----------------|------------------|-----------------------------------------------|
| `id`                | UUID / BIGINT  | PK               | Primary key                                   |
| `investigation_id`  | UUID / BIGINT  | FK, NOT NULL     | References `home_investigations.id`           |
| `action`            | VARCHAR(50)    | NOT NULL         | `Created`, `Updated`, `Submitted`, `Approved`, `Rejected` |
| `user_id`           | VARCHAR(100)   | NOT NULL         | User who performed the action                 |
| `user_name`         | VARCHAR(255)   | NOT NULL         | Display name of the user                      |
| `notes`             | TEXT           | NULLABLE         | Optional notes about the action               |
| `timestamp`         | TIMESTAMP      | NOT NULL, DEFAULT NOW() |                                          |

---

## 3. API Endpoints

### 3.1 Page Metadata

**`GET /home-investigation/meta`**

Returns page-level metadata such as breadcrumbs, title, roles, and requirement range.

**Response 200:**
```json
{
  "breadcrumb": ["Evaluation", "Home Investigation"],
  "title": "Home Investigation",
  "roles": [
    { "role": "Investigator", "scope": "own only" },
    { "role": "Manager", "scope": "all" }
  ],
  "reqRange": ["FR-HI-1", "FR-HI-6"]
}
```

---

### 3.2 Candidates List

**`GET /home-investigation/candidates`**

Returns a filtered, paginated list of candidates assigned for home investigation.

**Query Parameters:**
| Param          | Type     | Required | Description                              |
|----------------|----------|----------|------------------------------------------|
| `search`       | string   | No       | Search by candidate ID or name (case-insensitive partial match) |
| `campaign`     | string   | No       | Filter by campaign name                  |
| `investigator` | string   | No       | Filter by investigator name              |
| `status`       | string   | No       | Filter by status (`Assigned`, `In Progress`, `Submitted`) |
| `dateFrom`     | date     | No       | Filter visit date >= this date (ISO 8601) |
| `dateTo`       | date     | No       | Filter visit date <= this date (ISO 8601) |
| `page`         | integer  | No       | Page number (default: 1)                 |
| `perPage`      | integer  | No       | Items per page (default: 50)             |

**Authorization:**  
- `Investigator` role: Returns only candidates where `assigned_investigator` matches the authenticated user.  
- `Manager` role: Returns all candidates.

**Response 200:**
```json
{
  "data": [
    {
      "candidateId": "C00001",
      "candidateName": "Sok Dara",
      "campaign": "2026 Intake",
      "assignedInvestigator": "David",
      "visitDate": "20/08/2026",
      "status": "Assigned",
      "gender": "Male",
      "phoneNumber": "012 345 678",
      "currentAddress": "Phnom Penh"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 50,
    "total": 10,
    "totalPages": 1
  }
}
```

**Frontend calling code** — `service.ts` → `fetchCandidates(filters: CandidateFilters)`

---

### 3.3 Investigation Form Data

**`GET /home-investigation/candidates/{candidateId}`**

Returns the full investigation form data for a specific candidate.

**Response 200:**
```json
{
  "candidateId": "C00001",
  "candidateName": "Sok Dara",
  "campaign": "2026 Intake",
  "gender": "Male",
  "phoneNumber": "012 345 678",
  "currentAddress": "Phnom Penh",
  "assignedInvestigator": "David",
  "currentStatus": "Assigned",
  "visitDate": "2026-08-20",
  "location": "Street 123, Toul Kork",
  "gpsCoordinates": "11.5564, 104.9282",
  "peopleMet": "Mother, Father, Younger Sister",
  "observations": "",
  "findings": "",
  "recommendation": "",
  "reason": ""
}
```

**Response 404:**
```json
{ "error": "Candidate not found" }
```

**Frontend calling code** — `service.ts` → `fetchFormData(candidateId: string)`

---

### 3.4 Save Draft

**`PUT /home-investigation/candidates/{candidateId}/draft`**

Saves the investigation form as a draft. Updates the status to `In Progress` if it was `Assigned`.

**Request Body:**
```json
{
  "visitDate": "2026-08-20",
  "location": "Street 123, Toul Kork",
  "gpsCoordinates": "11.5564, 104.9282",
  "peopleMet": "Mother, Father, Younger Sister",
  "observations": "The household is well-maintained...",
  "findings": "Good family environment...",
  "recommendation": "Recommend",
  "reason": "Candidate shows academic promise..."
}
```

**Response 200:**
```json
{
  "candidateId": "C00001",
  "currentStatus": "In Progress",
  ...full updated data
}
```

**Business Logic:**
1. Find investigation by `candidateId`.
2. Update all provided fields.
3. If `currentStatus === 'Assigned'`, change to `'In Progress'`.
4. Update `updated_at` timestamp.
5. Return full updated investigation record.

**Frontend calling code** — `service.ts` → `saveDraft(data: InvestigationFormData)`

---

### 3.5 Submit Investigation

**`PUT /home-investigation/candidates/{candidateId}/submit`**

Submits the completed investigation for review. Status moves to `Submitted`.

**Request Body:**
```json
{
  "visitDate": "2026-08-20",
  "location": "Street 123, Toul Kork",
  "gpsCoordinates": "11.5564, 104.9282",
  "peopleMet": "Mother, Father, Younger Sister",
  "observations": "The household is well-maintained...",
  "findings": "Good family environment...",
  "recommendation": "Recommend",
  "reason": "Candidate shows academic promise..."
}
```

**Response 200:**
```json
{
  "candidateId": "C00001",
  "currentStatus": "Submitted",
  ...full updated data
}
```

**Validation Rules:**
- `visitDate` is required (must not be empty).
- `recommendation` is required (must be `'Recommend'` or `'Not Recommend'`).
- `observations` must have minimum 10 characters.
- `findings` must have minimum 10 characters.

**Business Logic:**
1. Validate required fields.
2. Find investigation by `candidateId`.
3. Update all fields.
4. Set `currentStatus = 'Submitted'`.
5. Set `submittedAt = now()`.
6. Update `updatedAt = now()`.
7. (Optional) Log to `investigation_history` table.
8. Return full updated record.

**Frontend calling code** — `service.ts` → `submitInvestigation(data: InvestigationFormData)`

---

### 3.6 Selection List Endpoints

**`GET /home-investigation/campaigns`**

Returns list of unique campaign names for filter dropdowns.

**Response 200:**
```json
{
  "data": ["2026 Intake", "2025 Intake"]
}
```

**`GET /home-investigation/investigators`**

Returns list of investigator names for filter dropdowns.

**Response 200:**
```json
{
  "data": ["David", "John", "Sokha"]
}
```

**`GET /home-investigation/statuses`**

Returns list of valid status values for filter dropdowns.

**Response 200:**
```json
{
  "data": ["Assigned", "In Progress", "Submitted"]
}
```

---

### 3.7 Attachments

#### 3.7.1 List Attachments

**`GET /home-investigation/candidates/{candidateId}/attachments`**

Returns all attachments for a given candidate's investigation.

**Response 200:**
```json
{
  "data": [
    {
      "id": "att-1",
      "name": "IMG_0142.jpg",
      "type": "image",
      "size": 2400000,
      "uploadDate": "2026-08-19T10:30:00Z",
      "url": "https://storage.example.com/uploads/att-1.jpg"
    }
  ]
}
```

**Frontend calling code** — `service.ts` → `fetchAttachments(candidateId: string)`

#### 3.7.2 Upload Attachment

**`POST /home-investigation/candidates/{candidateId}/attachments`**

Uploads a file and associates it with the candidate's investigation.

**Request:** `multipart/form-data`
| Field  | Type | Description             |
|--------|------|-------------------------|
| `file` | File | The file to upload      |

**Response 201:**
```json
{
  "id": "att-8",
  "name": "photo.jpg",
  "type": "image",
  "size": 2400000,
  "uploadDate": "2026-08-19T10:30:00Z",
  "url": "https://storage.example.com/uploads/att-8.jpg"
}
```

**Business Logic:**
1. Validate file type — allowed: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
2. Validate file size — max 10 MB (same as frontend limit in `FileUploadZone.vue`).
3. Store the file (local filesystem or S3-compatible storage).
4. Determine `file_type`: if MIME starts with `image/` → `'image'`; if `application/pdf` → `'pdf'`; if `docx` → `'docx'`.
5. Insert record into `investigation_attachments` table.
6. Return the attachment metadata with the public URL.

**Frontend calling code** — `service.ts` → `addAttachment(candidateId: string, file: File)`

#### 3.7.3 Delete Attachment

**`DELETE /home-investigation/candidates/{candidateId}/attachments/{attachmentId}`**

Deletes a specific attachment.

**Response 204:** No content.

**Business Logic:**
1. Verify the attachment belongs to the given candidate's investigation.
2. Delete the file from storage.
3. Delete the record from `investigation_attachments`.
4. Return 204.

**Frontend calling code** — `service.ts` → `removeAttachment(candidateId: string, attachmentId: string)`

---

### 3.8 Legacy 5-Status Endpoints

These endpoints support the list view, detail view, create, dashboard, and investigator form. They use the `investigationService.ts` file.

#### 3.8.1 List Investigations (with Pagination & Filters)

**`GET /home-investigation/investigations`**

**Query Parameters:**
| Param            | Type     | Description                              |
|------------------|----------|------------------------------------------|
| `search`         | string   | Search by candidate name, campaign, investigator |
| `campaign`       | string   | Filter by campaign                        |
| `investigatorId` | string   | Filter by investigator ID                 |
| `status`         | string   | Filter by status                          |
| `dateFrom`       | date     | Filter by scheduled date >=               |
| `dateTo`         | date     | Filter by scheduled date <=               |
| `page`           | integer  | Page number (default: 1)                  |
| `perPage`        | integer  | Items per page (default: 10)              |

**Response 200:**
```json
{
  "data": [
    {
      "id": "inv1",
      "candidateId": "c1",
      "candidateName": "Sokha N.",
      "candidatePhoto": "https://...",
      "gender": "Female",
      "school": "Battambang High School",
      "campaign": "2025 Scholarship Program",
      "investigatorId": "i1",
      "investigatorName": "Dara K.",
      "scheduledDate": "2026-03-15",
      "visitDate": "2026-03-17",
      "status": "Approved",
      "recommendation": "Recommend",
      "summary": "Family is supportive...",
      "notes": "Met with mother...",
      "createdAt": "2026-03-10T08:00:00Z",
      "updatedAt": "2026-03-18T10:00:00Z",
      "submittedAt": "2026-03-17T14:00:00Z",
      "approvedAt": "2026-03-18T10:00:00Z",
      "rejectedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

#### 3.8.2 Get Single Investigation

**`GET /home-investigation/investigations/{id}`**

**Response 200:** Returns a single `Investigation` object.
**Response 404:** `{ "error": "Investigation not found" }`

#### 3.8.3 Create Investigation

**`POST /home-investigation/investigations`**

**Request Body:**
```json
{
  "candidateName": "Srey P.",
  "campaign": "2025 Scholarship Program",
  "scheduledDate": "2026-03-28",
  "investigatorId": "i2",
  "investigatorName": "Vibol S."
}
```

**Response 201:** Returns the newly created `Investigation` with status `Pending`.

**Business Logic:**
1. Generate a new ID.
2. Set `status = 'Pending'`.
3. Set `createdAt = now()`, `updatedAt = now()`.
4. Create a history entry with action `'Created'`.

#### 3.8.4 Update Investigation

**`PUT /home-investigation/investigations/{id}`**

**Response 200:** Returns updated `Investigation`.

#### 3.8.5 Delete Investigation

**`DELETE /home-investigation/investigations/{id}`**

**Response 204:** No content.

#### 3.8.6 Save Draft (5-status)

**`PUT /home-investigation/investigations/{id}/draft`**

**Request Body:**
```json
{
  "visitDate": "2026-03-20",
  "recommendation": "Recommend",
  "notes": "Student showed excellent communication skills."
}
```

**Response 200:** Returns investigation with `status = 'In Progress'`.

#### 3.8.7 Submit for Review (5-status)

**`PUT /home-investigation/investigations/{id}/submit`**

**Response 200:** Returns investigation with `status = 'Submitted'` and `submittedAt` set.

#### 3.8.8 Approve Investigation

**`PUT /home-investigation/investigations/{id}/approve`**

**Response 200:** Returns investigation with `status = 'Approved'` and `approvedAt` set.

#### 3.8.9 Reject Investigation

**`PUT /home-investigation/investigations/{id}/reject`**

**Request Body:**
```json
{
  "reason": "Financial status does not meet eligibility criteria"
}
```

**Response 200:** Returns investigation with `status = 'Rejected'`, `rejectionReason` set, and `rejectedAt` set.

#### 3.8.10 Get Investigation History

**`GET /home-investigation/investigations/{id}/history`**

**Response 200:**
```json
{
  "data": [
    {
      "id": "h1",
      "investigationId": "inv1",
      "action": "Created",
      "userId": "admin",
      "userName": "Admin User",
      "timestamp": "2026-03-10T08:00:00Z",
      "notes": null
    }
  ]
}
```

#### 3.8.11 Dashboard Stats

**`GET /home-investigation/dashboard/stats`**

**Response 200:**
```json
{
  "pending": 2,
  "inProgress": 1,
  "submitted": 1,
  "approved": 1,
  "rejected": 1,
  "total": 6
}
```

#### 3.8.12 Investigator Workload

**`GET /home-investigation/dashboard/workload`**

**Response 200:**
```json
{
  "data": [
    {
      "investigatorId": "i1",
      "investigatorName": "Sokha N.",
      "pending": 0,
      "inProgress": 1,
      "submitted": 2,
      "total": 3
    }
  ]
}
```

#### 3.8.13 Chart Data

**`GET /home-investigation/dashboard/chart`**

**Response 200:**
```json
{
  "data": [
    { "month": "Jan", "count": 15 },
    { "month": "Feb", "count": 22 }
  ]
}
```

---

## 4. Data Flow Diagrams

### 4.1 Main Investigation Flow (3-Status System)

```
User opens HomeInvestigationView.vue
            │
            ▼
  ┌──────────────────────────────────────────────┐
  │  onMounted: Fetch in parallel:               │
  │  • GET /home-investigation/meta              │
  │  • GET /home-investigation/campaigns         │
  │  • GET /home-investigation/investigators     │
  │  • GET /home-investigation/statuses          │
  │  • GET /home-investigation/candidates        │
  └──────────────────────────────────────────────┘
            │
            ▼
  ┌──────────────────────┐     ┌──────────────────────────┐
  │ Left Panel           │     │ Right Panel              │
  │ Candidate Table      │     │ Investigation Form       │
  │ (filters & search)   │     │ (empty state initially)  │
  └──────────┬───────────┘     └─────────────┬────────────┘
             │                                │
             ▼                                │
  User clicks a candidate row ────────────────┤
             │                                │
             ▼                                ▼
  ┌──────────────────────────────────────────────────────┐
  │  Fetch in parallel:                                  │
  │  • GET /home-investigation/candidates/{candidateId}  │
  │  • GET /home-investigation/candidates/{id}/attachments│
  └──────────────────────────────────────────────────────┘
             │
             ▼
  ┌──────────────────────────────────────────────────────┐
  │   Form appears populated with candidate info          │
  │   User fills out fields, uploads attachments          │
  └──────────────────────────────────────────────────────┘
             │
       ┌─────┴─────┐
       ▼           ▼
  Save Draft    Submit
       │           │
       ▼           ▼
  PUT .../draft  PUT .../submit
       │           │
       ▼           ▼
  Status →       Status →
  'In Progress'  'Submitted'
```

### 4.2 Legacy 5-Status Flow

```
Manager creates investigation → POST /investigations → status: Pending
                                    │
                                    ▼
Investigator opens → Saves draft → PUT .../draft → status: In Progress
                                    │
                                    ▼
Investigator submits → PUT .../submit → status: Submitted
                                    │
                          ┌─────────┴─────────┐
                          ▼                   ▼
                  Manager approves     Manager rejects
                          │                   │
                          ▼                   ▼
                  PUT .../approve       PUT .../reject
                  status: Approved      status: Rejected
```

---

## 5. Authorization & Role Rules

| Role             | Scope             | Permissions                                                      |
|------------------|-------------------|------------------------------------------------------------------|
| `Investigator`   | `own only`        | - View and edit only their own assigned candidates               |
|                   |                   | - Cannot approve/reject investigations                           |
|                   |                   | - Can save drafts and submit for review                          |
| `Manager`        | `all`             | - View all candidates/investigations                             |
|                   |                   | - Can approve and reject submitted investigations                |
|                   |                   | - Can create and delete investigations (5-status system)         |
| `Admin`          | `all`             | - Full CRUD access to all investigations                         |

**Implementation Guidance:**
- The backend should derive the authenticated user's role and investigator name from the JWT token (set in the `Authorization: Bearer` header by the axios interceptor).
- For `Investigator` role, the candidates endpoint should automatically filter by the authenticated user's name.
- The candidate list in `CandidateDataTable.vue` passes filter by `investigator`, which the frontend already does.

---

## 6. Key Business Logic

### 6.1 Status Transition Rules

```
Allowed transitions (3-status):
  Assigned    → In Progress  (save draft)
  Assigned    → Submitted    (submit directly, if data is valid)
  In Progress → Submitted    (submit for review)
  Submitted   → [read-only, no further transitions in 3-status system]

Allowed transitions (5-status):
  Pending     → In Progress  (save draft)
  Pending     → Submitted    (submit directly)
  In Progress → Submitted    (submit for review)
  Submitted   → Approved     (manager approve)
  Submitted   → Rejected     (manager reject, requires reason)
```

### 6.2 Validation on Submit

When submitting (`PUT .../submit`), validate:
- `visitDate` — must be a valid date and not empty
- `location` — must not be empty
- `peopleMet` — must not be empty (at least one person)
- `observations` — minimum 10 characters
- `findings` — minimum 10 characters
- `recommendation` — must be `'Recommend'` or `'Not Recommend'`
- `reason` — must not be empty if recommendation is provided

### 6.3 Attachment Rules

- **Max file size**: 10 MB (configured in both frontend `FileUploadZone.vue` and enforced backend-side)
- **Allowed MIME types**:
  - `image/jpeg`, `image/png`, `image/gif`, `image/webp`
  - `application/pdf`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Storage**: Files should be stored on a file server or cloud storage (e.g., S3). The database stores only the path.
- **Cleanup**: When deleting an investigation, all associated attachments should also be deleted from storage.

### 6.4 Geo-location

The frontend's `InvestigationForm.vue` uses the browser's `navigator.geolocation.getCurrentPosition()` API to auto-fill GPS coordinates. The backend should accept this as a free-text string in the format `"latitude, longitude"`.

### 6.5 Sorting

- Candidate list should default to sort by `visit_date ASC` or `candidate_id ASC`.
- Investigation list (5-status) should default to sort by `updated_at DESC` (most recent first).

---

## 7. Frontend ↔ Backend Field Mapping

### InvestigationFormData (3-status system)

| Frontend Field      | Backend Column         | Notes                                 |
|---------------------|------------------------|---------------------------------------|
| `candidateId`       | `candidate_id`         | Read-only, used as identifier         |
| `candidateName`     | `candidate_name`       | Read-only, displayed from candidate   |
| `campaign`          | `campaign`             | Read-only                             |
| `gender`            | `gender`               | Read-only                             |
| `phoneNumber`       | `phone_number`         | Read-only                             |
| `currentAddress`    | `current_address`      | Read-only                             |
| `assignedInvestigator` | `assigned_investigator` | Read-only                          |
| `currentStatus`     | `current_status`       | Read-only status indicator            |
| `visitDate`         | `visit_date`           | Editable                              |
| `location`          | `location`             | Editable                              |
| `gpsCoordinates`    | `gps_coordinates`      | Editable / auto-filled from geolocation|
| `peopleMet`         | `people_met`           | Editable                              |
| `observations`      | `observations`         | Editable                              |
| `findings`          | `findings`             | Editable                              |
| `recommendation`    | `recommendation`       | Editable dropdown                     |
| `reason`            | `reason`               | Editable                              |

### Candidate (list item)

| Frontend Field      | Backend Column / Source    | Notes                                 |
|---------------------|---------------------------|---------------------------------------|
| `candidateId`       | `candidate_id`            |                                       |
| `candidateName`     | `candidate_name`          |                                       |
| `campaign`          | `campaign`                |                                       |
| `assignedInvestigator` | `assigned_investigator` |                                       |
| `visitDate`         | `visit_date`              | Formatted as `DD/MM/YYYY`             |
| `status`            | `current_status`          |                                       |
| `gender`            | `gender`                  | Optional read-only                    |
| `phoneNumber`       | `phone_number`            | Optional read-only                    |
| `currentAddress`    | `current_address`         | Optional read-only                    |

---

## 8. Error Handling

All API endpoints should return consistent error responses:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {}  // Optional, field-level validation errors
}
```

**Common HTTP Status Codes:**
| Code | Meaning                          |
|------|----------------------------------|
| 200  | Success                          |
| 201  | Created (attachment upload, investigation create) |
| 204  | Deleted (no content)             |
| 400  | Bad request / validation error   |
| 401  | Unauthenticated                  |
| 403  | Forbidden (wrong role)           |
| 404  | Not found (candidate/investigation/attachment) |
| 413  | File too large                   |
| 415  | Unsupported file type            |
| 422  | Validation error (submit without required fields) |
| 500  | Internal server error            |

---

*This document is derived from the frontend implementation files: `service.ts`, `investigationService.ts`, `types/visit.ts`, `types/investigation.ts`, and all related Vue components in `src/features/HomeInvestion/`. Last updated: July 23, 2026.*
