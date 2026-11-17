# EduTalent — Academic and Extracurricular Progress Platform

A Laravel + Inertia + React application for school progress, grades, activities and user-role workflows.

**Public demo:** Not currently provided. Review the code on GitHub or follow the local setup instructions below. This repository is a portfolio project, not a claim of production deployment.

## What it demonstrates

| Area | Evidence in source code |
| --- | --- |
| Multiple dashboards | Role-specific dashboard handling in `app/Http/Controllers/DashboardController.php` |
| Academic grades | Grade update actions and academic models (`updateGrade`, `app/Models/AcademicGrade.php`) |
| Extracurricular talents | Talent update actions and related models (`updateTalent`, `app/Models/TalentGrade.php`) |
| Schedules and administration | Admin user and schedule actions (`saveUser`, `saveSchedule` in `DashboardController.php`) |
| Data visualization | React frontend with Recharts listed in `package.json` |

## Stack

PHP, Laravel 12, Inertia.js, React 18, Recharts, Vite, Tailwind CSS, Eloquent, PHPUnit

## Architecture

```text
Browser
  -> UI (React/Inertia or Blade/Livewire, depending on this project)
  -> Laravel routes / middleware
  -> Controllers or Livewire components
  -> Eloquent models and database
```

Refer to `routes/web.php` and `app/` for this project's implementation details.

## Local development

Requirements: a compatible PHP/Composer environment, Node.js/npm, and a database configured for Laravel.

```bash
git clone https://github.com/Maximust27/EduTalent.git
cd EduTalent
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Configure your `.env` database settings and run:

```bash
php artisan migrate
php artisan serve
```

In another terminal run `npm run dev`. Run tests with `php artisan test` and check production asset compilation using `npm run build`.

**Verification:** These commands are a standard starting point, not evidence that this repository was installed or tested during this documentation change. Project-specific seed data or configuration may be needed. Do not commit secrets or real personal data.

## Source code walkthrough

- [`routes/web.php`](./routes/web.php)
- [`app/Http/Controllers/DashboardController.php`](./app/Http/Controllers/DashboardController.php)
- [`app/Models/AcademicGrade.php`](./app/Models/AcademicGrade.php)
- [`resources/js/Pages`](./resources/js/Pages)
- [`database/seeders/DummyDataSeeder.php`](./database/seeders/DummyDataSeeder.php)

Read [PORTFOLIO_CASE_STUDY.md](./docs/PORTFOLIO_CASE_STUDY.md) for engineering decisions, current limitations, and proposed verification tasks.

## Engineering next steps

- The central dashboard controller is large and manages many responsibilities. Consider moving role-specific workflows into services/controllers, verifying authorization per action, and using synthetic student data in demos.
- Add tests for who can update grades, remove student activity links, or edit schedules. Existing auth/profile tests alone do not prove these workflows.
- Capture screenshots using fictional sample data and record a short walkthrough.
- Add a verified demo and reproducible setup instructions when available.

## Recruiter note

The documentation describes code that is visible in this repository. It does **not** claim real deployments, production users, validated performance gains, or a completed security assessment. Any team contribution should be described accurately before including it on a CV.

**Maintained by:** [@Maximust27](https://github.com/Maximust27) · [Portfolio](https://maximust27.github.io/)
