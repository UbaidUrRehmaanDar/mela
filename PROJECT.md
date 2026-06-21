# MELA - Centralized University Event Discovery Platform

## Project Overview

MELA is a centralized platform designed to connect students with academic, professional, cultural, and extracurricular events happening across multiple universities. The platform addresses the common problem of students missing valuable opportunities due to fragmented communication channels and the absence of a unified event discovery system.

The application serves as a digital hub where students can discover, register for, and engage with events from their own universities as well as external institutions that allow outside participation.

MELA aims to create a connected university ecosystem where opportunities are easily accessible regardless of a student's department, faculty, or institution.

---

# Problem Statement

Students often miss important events, workshops, seminars, competitions, hackathons, conferences, and networking opportunities because information is scattered across:

* WhatsApp groups
* Social media pages
* University portals
* Society pages
* Word of mouth
* Department announcements

There is currently no centralized platform that aggregates these opportunities into a single accessible system for students.

---

# Proposed Solution

MELA provides a centralized platform where:

* Universities can publish events.
* Students can discover opportunities.
* Organizers can manage registrations.
* Administrators can verify and monitor activities.
* AI-assisted systems can help discover public events from external sources.

The platform acts as a bridge between students, universities, and event organizers.

---

# User Roles

## 1. Student

Students are the primary users of the platform.

### Functionalities

* Register using university email
* Login securely
* Create and manage profile
* Select interests and preferences
* Browse events
* Search events
* Filter events by category
* Register for events
* Save events to wishlist
* Like events
* Comment on events
* View organizer information
* Receive event notifications
* Receive event reminders
* Access event details

### Interest Categories

Students may choose interests such as:

* Technology
* Artificial Intelligence
* Software Development
* Business
* Entrepreneurship
* Arts
* Design
* Sports
* Medical Sciences
* Engineering
* Research
* Community Service

---

## 2. Organizer

Organizers are authorized individuals representing universities, departments, clubs, or societies.

### Examples

* Computer Science Society
* IEEE Student Branch
* ACM Chapter
* Media Society
* Art Club
* Entrepreneurship Society

### Functionalities

* Create events
* Edit event information
* Delete events
* Upload event posters
* Manage registrations
* View participants
* Post announcements
* Share registration links
* Add contact information
* Upload event resources

### Organizer Verification

Not every user can become an organizer.

Proposed workflow:

Student/User
↓
Apply as Organizer
↓
Submit Verification Documents
↓
Admin Review
↓
Approval or Rejection

Verification documents may include:

* University ID Card
* Society Membership Proof
* Department Authorization
* Faculty Recommendation

---

## 3. Admin

Admins manage the entire system.

### Functionalities

* Manage users
* Approve organizers
* Reject organizer applications
* Manage universities
* Manage events
* Remove inappropriate content
* View analytics
* Monitor platform activity
* Manage reports and complaints

---

# University Module

Each university will have its own profile within the platform.

## University Information

* University Name
* Logo
* Description
* Location
* Website
* Registered Organizers
* Associated Events

---

# Event Management System

Every event contains the following information:

## Event Details

* Event Title
* Description
* Category
* Event Type
* Date
* Time
* Venue
* University
* Organizer
* Registration Deadline
* Event Poster
* Registration Link
* Contact Information
* Participant Limit
* Event Status

### Event Categories

* Workshops
* Seminars
* Conferences
* Competitions
* Hackathons
* Sports Events
* Cultural Events
* Career Fairs
* Networking Sessions
* Research Events

---

# Event Participation

Students can:

* Register for events
* View registration status
* Save events
* Like events
* Comment on events
* Share events

If an event is open to external participants, students from other universities may register.

---

# Organizer Contact Information

Each event will display organizer details.

Possible contact methods:

* Email
* WhatsApp
* LinkedIn
* Instagram

This allows students to directly communicate with organizers regarding:

* Registrations
* Eligibility
* Event details
* Participation requirements

---

# AI-Powered Event Discovery

## Objective

Automatically discover publicly available student events and opportunities from external platforms.

### Sources

* University Websites
* Public Event Pages
* LinkedIn Event Posts
* Society Pages
* Public Social Media Announcements

### Workflow

AI Scraper
↓
Extract Event Information
↓
Generate Draft Event
↓
Admin Review
↓
Publish Event

This ensures quality control while reducing manual event entry.

---

# Personalized Recommendations

The system recommends events based on:

* Student interests
* Registration history
* Wishlist activity
* Event engagement

### Example

A student interested in:

* Artificial Intelligence
* Web Development

May receive recommendations for:

* AI Workshops
* Hackathons
* Technical Seminars
* Developer Conferences

---

# Notification System

Students receive notifications for:

* New events
* Registration confirmations
* Event updates
* Organizer announcements

### Reminder Schedule

* 1 Week Before Event
* 1 Day Before Event
* 1 Hour Before Event

---

# Attendance System (Future Enhancement)

Attendance can be tracked through QR Codes.

### Workflow

Student Registers
↓
Receives QR Code
↓
Scans at Venue
↓
Attendance Recorded

---

# Digital Certificates (Future Enhancement)

Organizers may upload participation certificates.

Students can:

* View certificates
* Download certificates
* Store certificates within their profiles

---

# Analytics Dashboard

## Organizer Analytics

* Total Registrations
* Event Views
* Attendance Count
* Likes
* Comments
* Engagement Rate

## Admin Analytics

* Total Users
* Total Events
* Active Universities
* Active Organizers
* Platform Growth Metrics

---

# Technology Stack

## Frontend

* React.js
* React Router
* Tailwind CSS

## Backend

* Supabase Authentication
* Supabase Postgres Database
* Supabase Storage
* Row Level Security (RLS) Policies

## AI Services

* Event Scraping Module
* Recommendation Engine

---

# Minimum Viable Product (MVP)

## Student Features

* Authentication
* Profile Management
* Event Discovery
* Event Registration
* Wishlist
* Comments
* Notifications

## Organizer Features

* Organizer Application
* Event Creation
* Event Management
* Participant Tracking

## Admin Features

* Organizer Approval
* Event Management
* User Management

## AI Features

* Basic Event Recommendation
* Public Event Discovery

---

# Expected Impact

MELA will create a connected ecosystem where students can easily discover opportunities, participate in events, and engage with communities beyond their own departments and universities.

The platform encourages collaboration, increases event participation, improves communication, and ensures that valuable opportunities reach the students who need them most.

---

# Project Vision

To become the central digital hub for university events, opportunities, competitions, workshops, and student engagement across multiple institutions.
