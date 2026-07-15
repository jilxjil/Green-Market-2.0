# Tasks
- [x] Task 1: Align expert dashboard guard and layout
  - [x] Replace custom session/profile checks in `/dashboard/expert` with the shared role guard for `expert`
  - [x] Add/adjust expert dashboard layout structure for profile, services, and requests sections

- [x] Task 2: Add database support for expert services and consultation requests
  - [x] Add `expert_services` table and Drizzle schema
  - [x] Add `consultation_requests` table and Drizzle schema
  - [x] Add migrations and update schema exports

- [x] Task 3: Implement expert profile read/update API
  - [x] Add route handler(s) to fetch current expert profile
  - [x] Add route handler(s) to update expert profile fields with validation

- [x] Task 4: Implement expert services CRUD API
  - [x] Add routes to list/create services for the authenticated expert
  - [x] Add routes to update/archive services with ownership checks

- [ ] Task 5: Implement consultation requests API
  - [ ] Add route to create a request for a service (buyer/seller)
  - [ ] Add route(s) to list requests for experts and requesters
  - [ ] Add route to update request status (expert-only, owner-only, enforce transitions)

- [ ] Task 6: Build expert dashboard UI
  - [ ] Profile editor (expertise, years of experience)
  - [ ] Service list + create/edit/archive actions
  - [ ] Requests list + accept/reject/complete actions

- [ ] Task 7: Build public discovery + request entry points
  - [ ] Add expert/services listing page(s)
  - [ ] Add service detail view with request form for authenticated buyers/sellers

- [ ] Task 8: Validation
  - [ ] Run typecheck and lint
  - [ ] Browser-check expert flows (profile, services, requests) and requester flow (create request)

# Task Dependencies
- Task 3 depends on Task 2
- Task 4 depends on Task 2
- Task 5 depends on Task 2 and Task 4
- Task 6 depends on Tasks 1, 3, 4, 5
- Task 7 depends on Task 4 and Task 5
- Task 8 depends on Tasks 6 and 7
