# EduAdmin — Professional Student Registration & Management System

[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-React-f43f5e.svg?style=flat)](https://lucide.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive, and feature-rich **Student Registration and Management SaaS Application** built with **React.js, Vite, and modular CSS3**. Designed with a premium university administration dashboard aesthetic, this project demonstrates real-world frontend engineering practices, robust state management, clean component architecture, and comprehensive validation.

Built as an **Intermediate Full Stack Web Development Internship Task**, ready for GitHub and LinkedIn portfolio showcases.

---

## 🌟 Key Features

### 1. Executive University Dashboard
- **Live Statistics Overview**:
  - **Total Registered Students**: Dynamically calculated from local storage.
  - **Academic Departments**: Active department counts with progress tracking.
  - **First-Year Students**: Real-time cohort percentage monitoring.
  - **Latest Registrations**: Instant view of recent enrollment activity.
- **Department Distribution Chart**: Proportional visual progress bars representing student density across faculties.
- **Recent Registrations Feed**: Quick student identification with initials avatar badges, department chips, and one-click dossier inspection.

### 2. Validated Student Registration & Editing (CRUD)
- **Comprehensive Fields**:
  - Full Name (alpha & punctuation check, min 3 chars)
  - Register Number (uniqueness enforcement across the student registry)
  - Email Address (RFC-compliant format and duplicate prevention)
  - Phone Number (standard 10–14 digit format validation)
  - Academic Department (dropdown with 7 university departments)
  - Year of Study (1st, 2nd, 3rd, 4th Year)
  - Gender (Male, Female, Other)
  - Date of Birth (calendar input with minimum age validation)
  - Permanent Residential Address (detailed address input)
- **Inline Validation Engine**: Real-time visual feedback, red field borders, error icons, and descriptive warning messages.
- **Duplicate Prevention**: Register Number and Email are verified against the existing database before insertion or modification.

### 3. Student Directory & Record Management
- **Search & Multi-Facet Filtering**:
  - Live query search across **Student Name**, **Register Number**, and **Email Address**.
  - Dropdown filter by **Department**.
  - Dropdown filter by **Academic Year**.
  - Active filter tags with single-click dismissal.
  - One-click **Reset Filters** button.
  - Clear empty-state illustration when queries return zero results.
- **Interactive Data Table**:
  - Column sorting (click on headers: Name, Register Number, Department, Year).
  - Responsive layout optimized for mobile, tablet, and desktop viewports.
  - Paginated view with previous/next controls and numbered page buttons.
  - Student initials avatar badge with personalized color coding.
  - Color-coded badges for academic departments and year levels.
- **Action Suite**:
  - 👁️ **View Profile Dossier**: Modal displaying full student record, enrollment status, contact cards, and creation timestamp.
  - ✏️ **Edit Record**: Pre-populated modal form with pre-validation against other records.
  - 🗑️ **Delete Record**: Accessible two-step confirmation dialog with safety warnings.
  - 📥 **Export to CSV**: Real-time export of filtered student directory to `.csv` format.

### 4. Data Persistence
- **Browser LocalStorage**: Records persist across page reloads and browser sessions.
- **Safe Fallback**: Includes a pre-populated dataset of 8 realistic students on initial launch. If storage is corrupted or reset, safe recovery is guaranteed.

### 5. UI/UX Excellence
- **Design Philosophy**: Modern SaaS dashboard aesthetic inspired by Stripe and Linear.
- **Color Palette**: Deep slate navy (`#0f172a`), indigo accent (`#4f46e5`), subtle borders, soft elevation shadows.
- **Floating Toast System**: Auto-dismissing success, error, and informative alert banners.
- **Mobile Responsive**: Off-canvas sliding drawer sidebar on tablets and phones.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [React 18](https://react.dev/) | Component architecture, Virtual DOM, Hooks (`useState`, `useEffect`, `useMemo`) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) | Ultra-fast HMR and production bundling |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, modern vector icons |
| **Styles** | Vanilla CSS3 (Custom Modular) | Design tokens, CSS variables, flexbox, CSS grid, smooth keyframe transitions |
| **Storage** | Web Storage API (LocalStorage) | Client-side persistent student data records |

---

## 📁 Project Structure

```text
student-management-system/
├── index.html                   # HTML entry point with Inter typography
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite build configuration
├── .gitignore                   # Git exclusion rules
├── README.md                    # Documentation
└── src/
    ├── main.jsx                 # React root render
    ├── App.jsx                  # Main application state, CRUD, & modal routing
    ├── data/
    │   └── initialStudents.js   # Realistic initial students dataset & constants
    ├── utils/
    │   ├── storage.js           # Safe LocalStorage CRUD handlers
    │   └── validators.js        # Form validation rules & regex checks
    ├── components/
    │   ├── Sidebar.jsx          # Desktop & mobile responsive sidebar
    │   ├── Header.jsx           # Global header with date, breadcrumb & profile
    │   ├── StatCard.jsx         # Metric card with icons, trends & badges
    │   ├── SearchFilter.jsx     # Search input, dropdown filters & reset button
    │   ├── StudentTable.jsx     # Responsive table, sorting, pagination, actions
    │   ├── StudentFormModal.jsx # Validated form for Registration & Editing
    │   ├── StudentDetailsModal.jsx # Full-view dossier profile modal
    │   ├── ConfirmDialog.jsx    # Deletion safety confirmation modal
    │   └── Toast.jsx            # Notification toast stack
    └── styles/
        ├── global.css           # Design tokens, variables, typography, reset
        ├── sidebar.css          # Navigation drawer & sidebar styling
        ├── header.css           # Header bar styling
        ├── dashboard.css        # Dashboard layout, stats & charts styling
        └── students.css         # Data table, form modal & dialog styling
```

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your system.
Verify by running:
```bash
node -v
npm -v
```

### Installation Steps

1. **Clone or Navigate to the Project**:
   ```bash
   cd student-management-system
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to the local URL displayed in the terminal:
   ```text
   http://localhost:3000
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The compiled assets will be generated inside the `dist/` directory.

6. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 📤 Publishing to GitHub

Follow these steps to push this project to your GitHub account:

1. **Initialize Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Student Registration & Management System"
   ```

2. **Create a New Repository on GitHub**:
   - Go to [GitHub.com](https://github.com/new).
   - Name your repository (e.g., `student-management-system`).
   - Set visibility to **Public**.
   - Do **not** initialize with a README (we already have one).

3. **Link and Push**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/student-management-system.git
   git push -u origin main
   ```

---

## 🌐 Deploying to Vercel

Vercel provides free, high-performance hosting for Vite + React applications.

### Option A: Deploy via Vercel Web Dashboard (Recommended)
1. Push your code to GitHub (as described above).
2. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
3. Click **"Add New..."** > **"Project"**.
4. Import your `student-management-system` repository.
5. In the configuration screen:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your app will be live with a free SSL `.vercel.app` domain in under 60 seconds!

### Option B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the interactive CLI prompts and select default options.

---

## 💼 Portfolio & LinkedIn Showcase Guide

When presenting this project on **LinkedIn** or adding it to your **resume**, emphasize the software engineering principles implemented:

- **Architecture**: Modular component design using React functional components, custom state separation, and decoupled utility validators.
- **Data Integrity**: Real-time form validation with strict regex checking and unique primary-key validation for Register Numbers.
- **Persistence**: Graceful client-side persistence with LocalStorage, handling serialization and corruption fallbacks.
- **UX Details**: Interactive sorting, live multi-field filtering, pagination, accessible modal traps, and non-blocking toast notifications.
- **Zero-Dependency Styling**: Crafted with clean CSS variables and modern layout techniques (CSS Grid & Flexbox) rather than bulky external UI libraries.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
