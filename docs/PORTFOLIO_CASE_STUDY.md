# EduTalent — Academic and Extracurricular Progress Platform: Engineering Case Study

## Overview

A Laravel + Inertia + React application for school progress, grades, activities and user-role workflows.

**Context:** This project models an application domain rather than a documented commercial production deployment. Its value as a portfolio sample comes from how the workflows are implemented and tested.

## Implementation evidence

### Multiple dashboards

Role-specific dashboard handling in `app/Http/Controllers/DashboardController.php`.

### Academic grades

Grade update actions and academic models (`updateGrade`, `app/Models/AcademicGrade.php`).

### Extracurricular talents

Talent update actions and related models (`updateTalent`, `app/Models/TalentGrade.php`).

### Schedules and administration

Admin user and schedule actions (`saveUser`, `saveSchedule` in `DashboardController.php`).

### Data visualization

React frontend with Recharts listed in `package.json`.


## Architecture

- **Stack:** PHP, Laravel 12, Inertia.js, React 18, Recharts, Vite, Tailwind CSS, Eloquent, PHPUnit
- **Routing and permissions:** Begin at [routes/web.php](../routes/web.php).
- **Application layer:** Inspect the linked controllers or Livewire components in the project README.
- **Persistence:** Eloquent models and migrations model the application's data and relationships.

## Code review entry points

- [`routes/web.php`](../routes/web.php)
- [`app/Http/Controllers/DashboardController.php`](../app/Http/Controllers/DashboardController.php)
- [`app/Models/AcademicGrade.php`](../app/Models/AcademicGrade.php)
- [`resources/js/Pages`](../resources/js/Pages)
- [`database/seeders/DummyDataSeeder.php`](../database/seeders/DummyDataSeeder.php)

## Risks and improvement opportunities

The central dashboard controller is large and manages many responsibilities. Consider moving role-specific workflows into services/controllers, verifying authorization per action, and using synthetic student data in demos.

### Testing

Add tests for who can update grades, remove student activity links, or edit schedules. Existing auth/profile tests alone do not prove these workflows.

### Reproducibility

The repository was inspected remotely. Its tests were **not executed** as part of this documentation-only update. A clean installation, test run, security review, and a short recorded walkthrough are recommended before presenting this project as production-ready.

## How to present the project to recruiters

1. Define the user problem and what the project models.
2. Demonstrate a concrete end-to-end workflow using fictional data.
3. Explain one implementation tradeoff and locate the relevant code.
4. Show passing tests or state clearly which tests remain to be added.
5. Specify your exact personal contribution and any team collaboration honestly.

Avoid unsupported claims about business impact, usage statistics, uptime or performance.
