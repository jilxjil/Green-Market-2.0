# Expert Services Spec

## Why
Experts currently have no functional dashboard or marketplace surface to offer advisory services, which blocks the MVP goal of digitizing consultations for farmers and buyers.

## What Changes
- Add expert-facing profile management (expertise, years of experience).
- Add expert service listings (create/edit/archive services).
- Add consultation requests from buyers/sellers to experts (no real-time chat).
- Add expert dashboard for incoming requests and service management.
- Add public expert/services discovery pages.
- Update expert dashboard route to use shared role guard utilities.

## Impact
- Affected specs: authentication, role-based dashboards, expert services, marketplace discovery
- Affected code: Next.js App Router pages, Route Handlers under `app/api`, Drizzle schema + migrations, shared auth/guard utilities

## ADDED Requirements
### Requirement: Expert Profile Management
The system SHALL allow an authenticated expert to view and update their expert profile.

#### Scenario: Expert updates profile
- **WHEN** an authenticated user with role `expert` opens the expert dashboard profile section
- **THEN** the system shows their current profile fields (expertise, years of experience)
- **WHEN** the expert submits updated fields
- **THEN** the system persists the changes and shows the updated values on refresh

### Requirement: Expert Service Listings
The system SHALL allow an authenticated expert to create and manage consultation service listings.

#### Scenario: Expert creates a service
- **WHEN** an authenticated expert provides a title, description, and optional price/unit metadata
- **THEN** the system creates a service listing owned by that expert
- **AND** the service becomes discoverable in expert/service discovery

#### Scenario: Expert archives a service
- **WHEN** an authenticated expert archives a service listing they own
- **THEN** the service no longer appears in public discovery
- **AND** it remains visible to the expert in their dashboard as archived

### Requirement: Consultation Requests
The system SHALL allow authenticated buyers and sellers to request consultations from experts for a specific service.

#### Scenario: Buyer sends a consultation request
- **WHEN** an authenticated buyer selects an expert service and submits a request message (and optional topic/notes)
- **THEN** the system creates a consultation request with status `pending`
- **AND** the request appears in the expert’s dashboard requests list

### Requirement: Expert Request Handling
The system SHALL allow the owning expert to update consultation request status.

#### Scenario: Expert accepts a request
- **WHEN** an authenticated expert updates a request they own from `pending` to `accepted`
- **THEN** the system persists the new status and the request is shown as accepted

#### Scenario: Terminal states
- **WHEN** a request is marked `completed` or `rejected`
- **THEN** it becomes read-only (no further status transitions)

## MODIFIED Requirements
### Requirement: Expert Dashboard Access Control
The system SHALL protect the expert dashboard routes using the shared role-based guard and redirect non-experts to their role dashboard.

## REMOVED Requirements
### Requirement: Real-Time Expert Chat
**Reason**: Out of scope for MVP.
**Migration**: Consultation requests store a message/thread placeholder field for future messaging expansion; no real-time transport is implemented in this change.
