# HRDHAT FLRA Application

## Project Overview

This is a React-based web application for managing Field Level Risk Assessment (FLRA) forms. The application is built using modern web technologies and follows a responsive design approach with separate layouts for mobile and desktop views. The primary focus is on providing an excellent form-filling experience for field workers, with easy PDF export and email submission capabilities.

## Tech Stack

- **Frontend Framework**: React 19
- **Routing**: React Router DOM 7
- **Build Tool**: Vite 6
- **Language**: TypeScript 5.7
- **Linting**: ESLint 9
- **Data Storage**:
  - Hybrid: Local Storage + Supabase
  - Local-first architecture with offline support
  - Background synchronization with Supabase
  - Conflict resolution for concurrent edits
- **Future Mobile App**:
  - Separate codebase for Android/iOS
  - Native mobile experience
  - Offline capabilities
  - Camera integration for photos
  - Location services

## Project Structure

```
src/
├── assets/         # Static assets like images and icons
├── components/     # Reusable React components
├── data/          # Data models and constants
├── db/            # Database schema and migrations
├── fillmodes/     # Form filling modes and logic
├── hooks/         # Custom React hooks
├── layout/        # Layout components (AppShell, AppShellMobile)
├── modules/       # Feature-specific modules
├── pages/         # Page components
├── services/      # Service layer (Supabase, Forms, Modules)
├── styles/        # CSS styles
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
```

## Key Features

1. **Dynamic Form Structure**

   - **Module Management**

     - Database-driven module configuration
     - Required vs. optional modules
     - Module order management
     - Module dependencies
     - Future: User-customizable modules

   - **Module Types**

     - Core modules (required)
       - General Information
       - Risk Assessment
       - Safety Measures
     - Optional modules
       - Custom risk assessments
       - Additional safety checks
       - Site-specific requirements
     - Future: User-defined modules

   - **Module Configuration**

     - Module metadata
     - Validation rules
     - Display order
     - Dependencies
     - Required fields
     - Custom fields

2. **User Profiles and Preferences**

   - **Account Management**

     - User registration and login
     - Personal profile information
     - Company/Department details
     - Role-based access

   - **Personalization**

     - Custom form preferences
     - Default form settings
     - Frequently used information
     - Custom company logos
     - Branded PDF exports

   - **User Settings**

     - Default view mode preference
     - Form template preferences
     - Email notification settings
     - PDF export preferences
     - UI theme preferences

3. **Form Lifecycle**

   - **Active State**

     - During shift/task
     - Form can be modified
     - New information can be added
     - Multiple active forms allowed
     - Real-time updates

   - **Completion State**

     - End of shift/task
     - Form becomes read-only
     - No further modifications allowed
     - Ready for export and submission

   - **Submission Process**
     - Export to PDF
     - Email to supervisor
     - Archive in system
     - Confirmation of delivery

4. **Form Filling Experience**

   - **Guided Mode**

     - One input at a time
     - Step-by-step form completion
     - Focused attention on each field
     - Ideal for new users or complex forms
     - Clear field instructions
     - Contextual help

   - **Quick Fill Mode**

     - One module at a time
     - Faster form completion
     - All fields in current module visible
     - Suitable for experienced users
     - Efficient data entry
     - Module-level validation

   - **Print View Mode**

     - Complete form view
     - All modules visible
     - Print-friendly layout
     - Final review before submission

   - **Seamless Mode Switching**
     - Persistent form state across mode changes
     - Maintains current module and field context
     - Example: Switching from Guided to Quick Fill:
       - User filling name in General Information (Guided)
       - Switches to Quick Fill
       - Stays in General Information module
       - Continues from same field
     - Works in reverse (Quick Fill to Guided)
     - Header maintains form context:
       - Form name
       - Form number
       - Creation date
       - Current module title

5. **Form Structure**

   - **Header Module**

     - Shared across all form types
     - Consistent placement at top of PaperContainer
     - Contains:
       - Form title
       - Form ID
       - Creation date
       - Current module indicator
       - Logo display

   - **Dynamic Module Loading**

     - Database-driven module configuration
     - Required modules always included
     - Optional modules based on context
     - Module order management
     - Future: User-customizable modules

6. **Data Management**

   - **Current Implementation**

     - **Local-First Architecture**

       - Forms are stored in local storage first
       - Background sync with Supabase when online
       - Offline support with automatic sync on reconnection
       - Conflict resolution for concurrent edits

     - **Supabase Integration**
       - Core tables implemented:
         - Forms
         - Form modules
         - Attachments
         - Signatures
       - Row Level Security (RLS) policies configured
       - Real-time updates supported
       - Version control for form edits

   - **Future Implementation (Supabase)**
     - Backend database integration
     - Permanent form storage
     - Daily form archival process
     - User authentication and authorization
     - Form history and tracking
     - Data analytics capabilities
     - Planned features:
       - 5 active forms limit per user
       - Form validation and approval workflows
       - Form template management
       - User role management

7. **Smart Form Features**

   - **Recall Functionality**
     - Intelligent autofill based on form history
     - Analyzes previous form submissions
     - Determines most likely values for:
       - Common information (name, department, etc.)
       - Frequently used safety measures
       - Standard risk assessments
       - Regular work locations
     - Learns from user patterns
     - Improves accuracy over time
     - Available in both Guided and Quick Fill modes

8. **Form Submission Workflow**

   - **PDF Export**

     - Generate professional PDF documents
     - Include all form data and signatures
     - Maintain consistent formatting
     - Print-friendly layout
     - Custom branding and logos

   - **Email Integration**
     - Send forms directly to supervisors
     - Include PDF attachments
     - Customizable email templates
     - Delivery confirmation

9. **Navigation System**

   - **Sidebar Component**

     - Persistent navigation available on all pages
     - Key navigation items:
       - Create Form (for creating new forms)
       - Home
       - Active Forms
     - Toggleable visibility
     - Icon-based navigation with labels

   - **Floating Panel Component**
     - Secondary navigation drawer
     - Triggered by sidebar actions
     - Used for:
       - Displaying active forms
       - Additional navigation options
     - Dismissible with close button
     - Customizable content through children props

10. **Content Region**

    - **Main Content Area**

      - Houses primary page content (Home, About, etc.)
      - Flexible layout for different page types
      - Responsive design for all screen sizes

    - **Paper Section**

      - **Paper Container**

        - Displays forms in a paper-like format
        - Maintains consistent paper styling
        - Handles form content layout

      - **Form Toolbar**
        - View mode controls:
          - Guided (step-by-step)
          - Quick Fill (module-based)
          - Print View (complete form)
        - Navigation controls:
          - Back button
          - Continue button
        - Form management:
          - Smart Recall functionality
          - View mode switching

11. **Responsive Design**

    - Dynamic layout switching based on screen size
    - Custom `useIsMobile` hook that:
      - Detects screen width (mobile if ≤ 767px)
      - Updates on window resize
      - Triggers layout changes automatically
    - Separate optimized layouts:
      - `AppShell`: Desktop layout with sidebar navigation
      - `AppShellMobile`: Mobile-optimized layout with different navigation patterns

12. **Layout Components**

    - `AppShell` (Desktop):
      - Persistent sidebar navigation
      - Floating panels for active forms
      - Paper container for form display
      - Form toolbar with view controls
    - `AppShellMobile`:
      - Mobile-optimized navigation
      - Simplified layout for smaller screens
      - Touch-friendly interface

13. **Routing**
    - Home page (`/`)
    - Form pages:
      - FLRA Form (`/flra`)
      - Hot Work Permit (to be added)
      - After Hours Work Permit (to be added)
    - Nested routing within shell components

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Dependencies

### Main Dependencies

- react: ^19.0.0
- react-dom: ^19.0.0
- react-router-dom: ^7.5.1

### Development Dependencies

- TypeScript: ~5.7.2
- Vite: ^6.2.0
- ESLint: ^9.21.0
- Various React and TypeScript type definitions

## Notes

- The application uses a modern React setup with Vite for fast development and building
- TypeScript is used throughout for type safety
- The project follows a modular structure for better maintainability
- Form system features:
  - Multiple form types supported
  - Three distinct filling modes (Guided, Quick Fill, Print View)
  - Persistent form state across mode changes
  - Consistent header module across all forms
  - Dynamic module loading and configuration
  - Flexible view modes
  - Smart Recall functionality for intelligent autofill
- Form lifecycle:
  - Active state during shift/task
  - Completion state at end of shift/task
  - PDF export and email submission
  - Archival in system
- Data management:
  - Current: Local storage for active forms
  - Future: Supabase backend integration
  - Planned features:
    - 5 active forms limit per user
    - Daily form archival process
    - User authentication and role management
    - Smart form history analysis
- User features:
  - Personal profiles and preferences
  - Custom form settings
  - Company logo upload
  - Branded PDF exports
  - User-specific form templates
- Future mobile app:
  - Separate codebase for Android/iOS
  - Native mobile experience
  - Offline capabilities
  - Camera integration
  - Location services
