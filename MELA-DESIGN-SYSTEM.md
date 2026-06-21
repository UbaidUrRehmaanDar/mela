# MELA - Neobrutalism Design System
## Centralized University Event Discovery Platform

---

# 1. Visual Theme & Atmosphere for MELA

MELA embraces **bold, unapologetic neobrutalism** to reflect the platform's core mission: make opportunities **unmissable, loud, and directly accessible** to students. The design rejects subtle interfaces in favor of **graphic bluntness and expressive structure** that commands attention and celebrates the mechanics of event discovery.

The visual language conveys:
- **Accessibility**: High-contrast, clear hierarchy means no student misses an opportunity
- **Energy & Community**: Bold colors and sharp edges reflect the vibrant university ecosystem
- **Trustworthiness**: Visible structure and exposed mechanics signal reliability
- **Urgency**: Design elements emphasize time-sensitive event registrations and deadlines

**Key Visual Characteristics**
- Thick, solid borders (3px minimum) with sharp square corners
- Bold, high-contrast typography in weights 700–800
- Flat, unblurred shadows with hard offsets (5px–8px hard drops)
- High-saturation accent colors against neutral blacks and whites
- Zero border radius; strictly rectangular forms
- Exposed structure: borders, outlines, and grids visible throughout
- Deliberate visual weight emphasizing event cards, registration CTAs, and time-sensitive information

---

# 2. MELA Color Palette & Semantic Roles

### Primary Brand Colors

- **Brand Yellow** (`#FFD23F`): 
  - **Primary CTA color** for "Register Now," "Apply as Organizer," and key call-to-action buttons
  - Used to highlight event deadlines, limited spots, and urgent actions
  - Draws immediate attention to registration deadlines
  - Background for event "Featured" badges and "Trending" indicators

- **Primary Black** (`#000000`): 
  - Dominant neutral for borders, text, shadows, and structural elements
  - Navigation backgrounds, primary text, and card borders
  - Creates sharp contrast against white surfaces

### Accent Colors (Event-Focused)

- **Event Red** (`#FF6B6B`): 
  - Secondary CTA for high-priority actions (urgently filling spots, event cancellations)
  - Error states and warning notifications
  - Used for "Last 5 Spots Left" or similar critical alerts

- **Event Cyan** (`#7FDBDA`): 
  - Interactive states and hover effects
  - "Featured Event" badges
  - Highlight category tags (Technology, AI, etc.)

- **Event Blue** (`#74B9FF`): 
  - Informational highlights and event categories (Workshops, Seminars)
  - Secondary interactive states
  - Calendar date highlights

- **Event Green** (`#88D498`): 
  - Positive confirmation states (Registration successful, event attended)
  - "Registered" badges on student profiles
  - Attendance confirmations

- **Event Orange** (`#FFA552`): 
  - Secondary CTAs and organizer action buttons
  - "Event Creator" badges
  - Community engagement highlights

### Interactive & Status Colors

- **Warning** (`#FFD23F`): Event deadline alerts, registration reminders
- **Error/Danger** (`#FF4444`): Failed registrations, cancellations, blocking errors
- **Success** (`#88D498`): Registration confirmations, attendance verified
- **Info** (`#74B9FF`): Event details, tips, helpful notifications

### Neutral Scale

- **White** (`#FFFFFF`): Primary surface for cards, modals, and content areas
- **Off-White** (`#F5F0E8`): Subtle background variation for secondary sections, wishlists
- **Light Gray** (`#DDDDDD`): Borders, dividers, and secondary card borders
- **Medium Gray** (`#777777`): Secondary text (organizer names, event dates in list view)
- **Dark Gray** (`#666666`): Tertiary text and muted metadata

### MELA-Specific Semantic Colors

| Element | Color | Usage |
|---------|-------|-------|
| Event Card Background | `#FFFFFF` | Primary event container |
| Event Card Border | `#000000` (3px) | Structure and visual weight |
| Category Badge - Tech | `#7FDBDA` (Cyan) | Technology, AI, Software Dev |
| Category Badge - Business | `#FFD23F` (Yellow) | Business, Entrepreneurship |
| Category Badge - Arts | `#FF6B6B` (Red) | Arts, Design, Media |
| Category Badge - Sports | `#74B9FF` (Blue) | Sports and recreation |
| Category Badge - Science | `#88D498` (Green) | Medical, Research, Engineering |
| Registration Button | `#FFD23F` (Yellow) | Primary call-to-action |
| Wishlist (Saved) | `#FF6B6B` (Red) | Heart icon, wishlist indicators |
| Registered Status | `#88D498` (Green) | Badge for already-registered events |
| Organizer Verified Badge | `#7FDBDA` (Cyan) | Verification checkmark |
| Limited Spots Alert | `#FF4444` (Error Red) | < 5 spots remaining |
| Event Ends Soon | `#FFA552` (Orange) | Registration deadline < 24 hours |

---

# 3. Typography System

### Font Stack

**Primary Display: Syne** (Bold, Geometric)
- Fallback: `Syne, 'Courier New', monospace`
- Usage: Page heroes, event titles on detail pages, major headings
- Personality: Bold, commanding, unmissable

**Secondary UI: Space Grotesk** (Geometric Sans)
- Fallback: `'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Usage: Button text, card titles, event cards, labels
- Personality: Technical, structured, approachable

**Body: Inter** (Humanist Sans)
- Fallback: `Inter, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif`
- Usage: Event descriptions, organizer details, comments, notifications
- Personality: Readable, friendly, contemporary

**Code: Space Mono** (Monospace)
- Fallback: `'Space Mono', 'Courier New', monospace`
- Usage: Event codes, verification tokens, registration IDs
- Personality: Mechanical, precise, machine-like

### MELA Typography Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | MELA Usage |
|------|------|------|--------|-------------|----------------|-----------|
| Hero / Page Title | Syne | 144px | 800 | 129.6px | -0.02em | "Discover Your Next Opportunity" on homepage |
| Main Section | Space Grotesk | 56px | 700 | 64.4px | -0.01em | "Featured Events," "Your Registrations" |
| Section Title | Space Grotesk | 32px | 700 | 36.8px | 0em | "Workshops," "Hackathons," event category headers |
| Card Title | Space Grotesk | 20px | 700 | 24px | 0em | Event titles in cards, organizer names |
| Label/Metadata | Syne | 20.8px | 800 | 23.92px | 0em | Category tags, verified badges |
| Body/Description | Inter | 18px | 400 | 30.6px | 0em | Event descriptions, organizer bios, comments |
| Body Large | Inter | 28px | 500 | 39.2px | 0em | Event date/time emphasis, featured highlights |
| Button Text | Space Grotesk | 16px | 700 | 16px | 0em | "Register Now," "Save Event," "Apply" |
| Link Text | Space Grotesk | 18px | 700 | 30.6px | 0em | "View Organizer," "Share Event" |
| Caption/Small | Space Grotesk | 14px | 700 | 23.8px | 0em | Registration count, deadline countdown |
| Badge/Tag | Space Grotesk | 12.8px | 500 | 21.76px | 0em | Category badges, event type pills |
| Monospace | Space Mono | 15.3px | 400 | 26.01px | 0em | Event registration code, venue room number |

### Typography Principles for MELA

- **Weight emphasis over size**: UI text defaults to weight 700–800; body content uses 400
- **Line height generosity**: Ensures readability of long event descriptions and bios (1.5x minimum)
- **All-caps for categories**: Category labels use `text-transform: uppercase` to signal "structured information"
- **Monospace for codes**: Registration codes and event IDs use Space Mono for perceived accuracy
- **Contrast clarity**: Dark text on light backgrounds (min 4.5:1 WCAG AA ratio)

---

# 4. Component Styling for MELA

## 4.1 Buttons

### Primary Button (Register Now - Yellow CTA)
**Used for**: Main registration, event sign-up, primary organizer actions
```
Background: #FFD23F (Brand Yellow)
Text Color: #000000
Font: Space Grotesk, 16px, weight 700
Padding: 12px 24px
Border: 3px solid #000000
Border Radius: 0px
Box Shadow: #000000 5px 5px 0px 0px
Height: auto (min 57px)
Width: auto (min 180px)
Hover: Shadow to 6px 6px, scale 1.02
Active: Shadow to 3px 3px, scale 0.98
Focus: Outline 2px solid #FFD23F (visible ring)
```

### Secondary Button (Black - Alternative Action)
**Used for**: Cancel, delete, secondary actions, filters
```
Background: #000000
Text Color: #FFFFFF
Font: Space Grotesk, 16px, weight 700
Padding: 12px 24px
Border: 3px solid #000000
Border Radius: 0px
Box Shadow: #000000 5px 5px 0px 0px
Height: auto (min 57px)
Width: auto (min 180px)
Hover: Shadow to 6px 6px, scale 1.02
Active: Shadow to 3px 3px, scale 0.98
Focus: Outline 2px solid #FFD23F
```

### Tertiary Button (Outlined)
**Used for**: Optional actions, filters, "Learn More"
```
Background: #FFFFFF
Text Color: #000000
Font: Space Grotesk, 16px, weight 700
Padding: 12px 24px
Border: 3px solid #000000
Border Radius: 0px
Box Shadow: none
Height: auto (min 57px)
Width: auto (min 180px)
Hover: Box Shadow 5px 5px 0px 0px #000000, background #F5F0E8
Active: Box Shadow 3px 3px 0px 0px #000000
Focus: Outline 2px solid #FFD23F
```

### Danger Button (Delete Event, Cancel Registration)
**Used for**: Destructive actions
```
Background: #FF4444 (Error Red)
Text Color: #FFFFFF
Font: Space Grotesk, 16px, weight 700
Padding: 12px 24px
Border: 3px solid #000000
Border Radius: 0px
Box Shadow: #000000 5px 5px 0px 0px
Height: auto (min 57px)
Width: auto (min 180px)
Hover: Shadow to 6px 6px
Active: Shadow to 3px 3px
Focus: Outline 2px solid #FFD23F
```

### Icon Button (Wishlist Heart, Share, More Options)
**Used for**: Compact actions, inline interactions
```
Background: #FFFFFF
Border: 2px solid #000000
Width: 48px (desktop) / 44px (mobile)
Height: 48px / 44px
Box Shadow: #000000 3px 3px 0px 0px
Border Radius: 0px
Icon Size: 24px
Icon Color: #000000 (or #FF6B6B for active wishlist)
Hover: Shadow to 4px 4px, scale 1.05
Active: Shadow to 2px 2px, icon color changes
Focus: Outline 2px solid #FFD23F
```

### Small Button / Pill Button (Category filters, event type)
**Used for**: Inline actions, filter toggles
```
Background: #F5F0E8 (default) or category color (active)
Text Color: #000000 (default) or white (active)
Font: Space Grotesk, 12.8px, weight 500
Padding: 6px 12px
Border: 2px solid #000000
Border Radius: 0px
Box Shadow: #000000 2px 2px 0px 0px
Height: auto (min 36px)
Width: auto
Hover: Background shifts, shadow to 3px 3px
Active: Background = category color, Text = white
Focus: Outline 2px solid #FFD23F
```

---

## 4.2 Event Cards

### Event Discovery Card (Primary Card in Grid)
**Used for**: Event listing pages, homepage event grid
```
Background: #FFFFFF
Border: 3px solid #000000
Border Radius: 0px
Padding: 16px
Box Shadow: #000000 8px 8px 0px 0px
Width: Responsive (see breakpoints)
Height: auto
Gap (internal): 8px
Hover: Shadow to 9px 9px 0px 0px, scale 1.02
Elements:
  - Event Image: 100% width, 200px height, 2px black border
  - Title: Space Grotesk, 20px, weight 700
  - Organizer: Inter, 14px, weight 400, color #777777
  - Category Badge: Pill button (see above)
  - Date/Time: Space Grotesk, 14px, weight 700, with calendar icon
  - Venue: Inter, 14px, weight 400
  - Description: Inter, 16px, weight 400, line-clamp 2 lines
  - Participant Count: "342 registered" in Space Grotesk, 12.8px
  - Action Buttons: Row of "Register Now" (yellow), Wishlist (heart icon), Share (icon)
```

### Event Detail Card (Full Event Page)
**Used for**: Event detail view
```
Background: #FFFFFF
Border: 3px solid #000000
Border Radius: 0px
Padding: 24px
Box Shadow: #000000 8px 8px 0px 0px
Max-Width: 800px
Gap (sections): 16px
Internal structure:
  - Hero Image: Full width, 400px height, 2px border
  - Title: Syne, 56px, weight 800
  - Organizer Section: Cyan (#7FDBDA) badge + name + verified checkmark
  - Metadata Row: Date, Time, Venue, Category (all with icons)
  - Description: Inter, 18px, weight 400
  - Key Details: Grid with Location, Spots, Deadline (each with icon)
  - Registration Status: Green success badge if registered
  - CTA Buttons: "Register Now" (yellow), "Add to Wishlist" (heart), Share
```

### Organizer Card (Profile / Verification Badge)
**Used for**: Organizer profiles, event organizer information
```
Background: #FFFFFF
Border: 3px solid #000000
Padding: 16px
Box Shadow: #000000 5px 5px 0px 0px
Elements:
  - Avatar: 96px × 96px, 2px black border, square (no radius)
  - Name: Space Grotesk, 20px, weight 700
  - Verification Badge: Cyan (#7FDBDA) checkmark pill
  - Organization: Inter, 14px, weight 400
  - Bio: Inter, 16px, weight 400
  - Contact Buttons: Row of icon buttons (email, WhatsApp, LinkedIn, Instagram)
  - Events Count: "Created 12 events" in Space Grotesk, 14px
```

### Registration Status Card (Dashboard)
**Used for**: Student registrations, "My Events" page
```
Background: #FFFFFF (or #FFF3C4 if registration upcoming)
Border: 3px solid #000000
Padding: 16px
Box Shadow: #000000 5px 5px 0px 0px
Status Badge: Green (#88D498) "Registered", Orange (#FFA552) "Upcoming", Red (#FF4444) "Cancelled"
Elements:
  - Event Title: Space Grotesk, 20px, weight 700
  - Organizer: Inter, 14px
  - Event Date/Time: Bold, with countdown if < 24 hours
  - Status Badge: Pill shape
  - Actions: "View Details", "Unregister" buttons
```

---

## 4.3 Form Elements

### Text Input (Search, Event Filter)
```
Background: #FFFFFF
Text Color: #000000
Font: Inter, 16px, weight 400
Padding: 12px 16px
Border: 3px solid #000000
Border Radius: 0px
Box Shadow: #000000 3px 3px 0px 0px
Height: 50px (min)
Width: 100% (responsive)
Placeholder Color: #777777
Focus: Outline 2px solid #FFD23F, shadow to 4px 4px
Focus State: Border remains 3px black, outline added
Hover: Shadow to 4px 4px 0px 0px
```

### Textarea (Event Description, Comments)
```
Background: #FFFFFF
Text Color: #000000
Font: Inter, 16px, weight 400
Padding: 12px 16px
Border: 3px solid #000000
Border Radius: 0px
Box Shadow: #000000 3px 3px 0px 0px
Min-Height: 120px
Width: 100%
Line-Height: 1.5
Focus: Outline 2px solid #FFD23F
Resize: vertical only
```

### Checkbox (Interest Selection, Event Filters)
```
Width: 24px
Height: 24px
Border: 3px solid #000000
Background: #FFFFFF (unchecked) / #FFD23F (checked)
Border Radius: 0px
Cursor: pointer
Checkmark Color: #000000
Hover: Background #F5F0E8 (unchecked), shadow 2px 2px
Focus: Outline 2px solid #FFD23F around checkbox
Label Font: Space Grotesk, 14px, weight 700, positioned 8px right of checkbox
```

### Radio Button (Event Type Selection, Attendance Method)
```
Width: 24px
Height: 24px
Border: 3px solid #000000
Background: #FFFFFF (unchecked) / #FFD23F (checked)
Border Radius: 0px (stays square, not circular - brutalism rule)
Inner Dot: #000000, 12px diameter if checked
Cursor: pointer
Hover: Shadow 2px 2px
Focus: Outline 2px solid #FFD23F
Label Font: Space Grotesk, 14px, weight 700
```

### Dropdown / Select
```
Background: #FFFFFF
Text Color: #000000
Font: Space Grotesk, 14px, weight 700
Padding: 12px 16px
Border: 3px solid #000000
Border Radius: 0px
Box Shadow: #000000 3px 3px 0px 0px
Height: 50px
Width: 100%
Dropdown Arrow: Black, right-aligned, 16px icon
Focus: Outline 2px solid #FFD23F
Hover: Shadow to 4px 4px 0px 0px
Option Background: #FFFFFF (default) / #FFD23F (hover)
Option Text: #000000, Space Grotesk 14px weight 700
```

### Toggle Switch (Notification Preferences, Dark Mode)
```
Width: 60px
Height: 36px
Background: #FFFFFF (off) / #FFD23F (on)
Border: 3px solid #000000
Border Radius: 0px (stays square)
Box Shadow: #000000 3px 3px 0px 0px
Toggle Circle: 30px × 30px, #000000, positioned left (off) / right (on)
Transition: None (hard switch, no animation - brutalism style)
Hover: Shadow to 4px 4px
Focus: Outline 2px solid #FFD23F around toggle
```

### Date Picker (Event Registration Deadline)
```
Input Field: Same as Text Input above
Calendar Popup: 
  - Background: #FFFFFF
  - Border: 3px solid #000000
  - Box Shadow: #000000 8px 8px 0px 0px
  - Day Numbers: Space Grotesk, 14px, weight 700
  - Selected Date: #FFD23F background, #000000 text
  - Today Highlight: #7FDBDA (cyan) border around date
  - Navigation Arrows: 24px black, clickable
```

---

## 4.4 Navigation & Header

### Main Header
```
Background: #FFFFFF
Border-Bottom: 3px solid #000000
Box Shadow: 0px 4px 0px 0px #000000
Padding: 16px 24px (desktop) / 12px 16px (mobile)
Height: auto (min 64px desktop, 56px mobile)
Display: Flex, justify-content: space-between, align-items: center
Sticky: position sticky, top 0, z-index 1000
```

### Logo / Branding
```
Font: Syne, 28px, weight 800
Color: #000000
Text: "MELA"
Margin-Right: 48px
Cursor: pointer
Hover: Text shadow 2px 2px 0px #FFD23F
```

### Navigation Links (Desktop)
```
Font: Space Grotesk, 18px, weight 700
Color: #000000
Link Items: "Discover," "My Events," "Communities," "Apply as Organizer"
Spacing: 24px between links
Hover: Background #FFD23F, padding 8px 12px, box-shadow 2px 2px 0px #000000
Active Link: #FFD23F background, kept permanently
Focus: Outline 2px solid #FFD23F
```

### Search Bar (In Header)
```
Width: 300px (desktop) / 100% (mobile)
Padding: 10px 14px
Border: 3px solid #000000
Background: #FFFFFF
Font: Inter, 14px, weight 400
Placeholder: "Search events, organizers..."
Box Shadow: #000000 2px 2px 0px 0px
Focus: Outline 2px solid #FFD23F, shadow to 3px 3px
Search Icon: 20px, positioned right, color #000000
```

### Mobile Hamburger Menu
```
Icon: Three horizontal lines, 28px wide, 3px stroke, #000000
Position: Right side of header
Hover: Box shadow 2px 2px, scale 1.05
Menu Overlay:
  - Background: #FFFFFF
  - Border: 3px solid #000000
  - Position: Fixed, top 64px (below header), right 0, width 280px
  - Padding: 16px
  - Links: Stacked vertically, Space Grotesk 16px weight 700
  - Gap: 12px between links
  - Link Hover: #FFD23F background, padding 8px 12px
  - Box Shadow: #000000 8px 8px 0px 0px on left side
```

### User Profile Dropdown
```
Avatar: 44px × 44px, 2px black border
Username: Space Grotesk, 14px, weight 700, positioned left of avatar
Hover: Box shadow 2px 2px
Click to Expand:
  - Dropdown Menu: #FFFFFF background, 3px black border, 8px 8px shadow
  - Items: "Profile," "My Registrations," "Wishlist," "Settings," "Logout"
  - Font: Space Grotesk, 16px, weight 700
  - Item Hover: #FFD23F background
  - Separator: 2px solid #DDDDDD
```

---

## 4.5 Modal & Overlay

### Registration Modal
```
Overlay: Transparent #000000, opacity 0.3
Modal Box:
  - Background: #FFFFFF
  - Border: 3px solid #000000
  - Border Radius: 0px
  - Box Shadow: #000000 9px 9px 0px 0px
  - Padding: 32px
  - Width: 90% (mobile) / 500px (desktop)
  - Max-Height: 80vh
  - Overflow: auto
Header:
  - Title: Syne, 32px, weight 800
  - Close Button: 32px × 32px, X icon, positioned top-right
Content:
  - Event Title, Date, Time, Venue: Displayed clearly
  - Registration Form: (see form elements section)
  - CTA: "Confirm Registration" (yellow button)
  - Cancel: "Close" (black button)
Footer:
  - Legal/Disclaimer: Inter, 12px, weight 400, color #777777
```

### Notification Toast
```
Position: Fixed, bottom-right, 24px from edges
Width: 360px (desktop) / 90vw (mobile)
Background: Depends on type:
  - Success: #E8F5E9 (light green) with #88D498 border
  - Error: #FFE0E0 (light red) with #FF4444 border
  - Info: #E3F2FD (light blue) with #74B9FF border
  - Warning: #FFF3C4 (light yellow) with #FFD23F border
Border: 3px solid (color as above)
Border Radius: 0px
Box Shadow: #000000 5px 5px 0px 0px
Padding: 16px
Auto-dismiss: 5 seconds (slide out from right)
Content:
  - Icon: 24px, positioned left
  - Message: Inter, 16px, weight 400, color #000000
  - Close Button (X): 20px icon, right side
```

### Confirmation Dialog
```
Similar to Registration Modal but smaller:
- Width: 400px (desktop) / 90vw (mobile)
- Padding: 24px
- Title: Space Grotesk, 24px, weight 700
- Message: Inter, 16px, weight 400
- Buttons: "Confirm" (yellow), "Cancel" (black), stacked or side-by-side
- Z-index: 2000 (above other modals)
```

---

## 4.6 Cards & Containers

### University Card (University Listing)
```
Background: #FFFFFF
Border: 3px solid #000000
Border Radius: 0px
Padding: 20px
Box Shadow: #000000 8px 8px 0px 0px
Width: Responsive
Height: auto
Elements:
  - Logo: 80px × 80px, 2px black border
  - Name: Space Grotesk, 24px, weight 700
  - Location: Inter, 14px, weight 400, with location icon
  - Event Count: "42 Active Events" in Space Grotesk, 14px, weight 700
  - Description: Inter, 16px, weight 400, line-clamp 2
  - Button: "View University" (tertiary outline)
Hover: Shadow to 9px 9px, scale 1.02
```

### Comment/Review Card (Event Comments)
```
Background: #F5F0E8 (off-white)
Border: 2px solid #DDDDDD (light gray)
Border Radius: 0px
Padding: 16px
Box Shadow: none (lightweight)
Elements:
  - User Avatar: 36px × 36px, 2px black border
  - User Name: Space Grotesk, 14px, weight 700
  - Timestamp: Inter, 12px, weight 400, color #777777
  - Comment Text: Inter, 16px, weight 400
  - Like Count: "24 likes" in Space Grotesk, 12px
  - Actions: Like (heart icon), Reply buttons
Hover: Background #FFFFFF, border 2px solid #000000
```

### Category Badge / Tag Card
```
Background: Category-specific color (cyan, yellow, blue, green, orange)
Text Color: #000000 (or #FFFFFF if dark background)
Font: Space Grotesk, 12.8px, weight 500, uppercase
Padding: 6px 12px
Border: 2px solid #000000
Border Radius: 0px
Box Shadow: #000000 2px 2px 0px 0px
Width: auto
Height: 36px (min)
Cursor: pointer (if clickable filter)
Hover: Scale 1.05, shadow to 3px 3px
Active: Double border width or darker shade
```

### Notification Card (In Notification Center)
```
Background: #FFFFFF
Border: 3px solid #000000
Border Radius: 0px
Padding: 16px
Box Shadow: #000000 5px 5px 0px 0px
Elements:
  - Icon: 32px, positioned left
  - Title: Space Grotesk, 16px, weight 700
  - Message: Inter, 14px, weight 400
  - Timestamp: Inter, 12px, weight 400, color #777777
  - Action Link: Space Grotesk, 14px, weight 700, color #FFD23F (underlined)
Read/Unread:
  - Unread: Left 4px colored border (category color)
  - Read: Faded opacity 0.7
```

---

# 5. Shadows & Depth System for MELA

### Shadow Scale
```
Small:     #000000 3px 3px 0px 0px    | Icon buttons, compact elements
Medium:    #000000 5px 5px 0px 0px    | Buttons, form inputs, standard cards
Large:     #000000 8px 8px 0px 0px    | Event cards, modals, major sections
XL:        #000000 9px 9px 0px 0px    | Full-page overlays, featured cards, hover states
```

### Interactive Shadow Behavior

**Default → Hover → Active Pattern**
- **Buttons**: `5px 5px` → `6px 6px` → `3px 3px` (pressed effect)
- **Cards**: `8px 8px` → `9px 9px` (lift on hover) → `8px 8px` (return)
- **Inputs**: `3px 3px` → `4px 4px` (on focus)
- **Icon Buttons**: `3px 3px` → `4px 4px` → `2px 2px`

### Shadow Philosophy
Neobrutalism's shadow treatment is **mechanical and tactile**. Shadows are hard-edged **offset drops** that mimic stacked paper with a fixed offset. No blur, no transparency, no soft diffusion—only solid black at an exact pixel offset. This creates a **pseudo-3D, paper-cutout aesthetic** that feels tangible and intentional.

---

# 6. Layout & Spacing System

### Grid & Spacing Scale
All spacing aligns to a **4px base unit**:
```
4px    (micro spacing, gaps)
8px    (tight spacing, small components)
12px   (comfortable spacing, mobile padding)
16px   (standard spacing, cards, sections)
20px   (breathing room, group separation)
24px   (generous spacing, major sections)
32px   (section padding, containers)
48px   (large vertical spacing, major breaks)
64px   (hero padding, page sections)
96px   (max padding, spacious layouts)
```

### Container Max-Width
- **Mobile**: Full width, 12px horizontal padding
- **Tablet**: 100%, 16px padding
- **Desktop**: 1200px max, centered with auto margins
- **Desktop+**: 1440px max (if ultra-wide screens)

### Card Grid Layouts

**Desktop (1200px+)**
- 4 columns of event cards
- 16px gap between cards and rows
- Card width: `calc(25% - 12px)`

**Tablet (768px–1199px)**
- 2 columns of event cards
- 16px gap
- Card width: `calc(50% - 8px)`

**Mobile (320px–767px)**
- 1 column, full width
- 12px horizontal margin
- Card width: `calc(100vw - 24px)`
- 12px vertical gap between cards

### Padding Standards
- **Card Internal**: 16px (mobile 12px)
- **Section Padding**: 24px top/bottom, 32px left/right (mobile: 12px)
- **Hero Padding**: 64px top/bottom (mobile: 32px)
- **Component Gap**: 8px (tight) / 16px (comfortable)

---

# 7. MELA-Specific Page Layouts

## 7.1 Homepage Layout

**Header**
- Fixed/sticky, white background, 3px black bottom border
- Logo (MELA), centered search bar, navigation links (desktop), hamburger (mobile)

**Hero Section**
- Background: #FFFFFF with 3px black border bottom
- Content: Syne 144px "Discover Your Next Opportunity" (144px, scaled down on mobile)
- Subtext: Inter 18px "Connect with events across universities"
- CTA Button: "Explore Events" (yellow button)
- Hero Image/Illustration: Large event placeholder with thick borders

**Featured Events Section**
- Title: "Featured This Week" (Space Grotesk 56px, weight 700)
- Layout: 4-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Cards: Event Discovery Cards with images, titles, organizers, CTAs
- "View All" link at bottom

**Categories Section**
- Title: "Browse by Interest"
- Layout: 6 category pills in a row (scrollable on mobile)
- Categories: Tech (cyan), Business (yellow), Arts (red), Sports (blue), Science (green), Other (orange)
- Each pill: `#category-color` background, bold text, 2px black border
- On click: Filter event grid by category

**Upcoming Events Section**
- Title: "Don't Miss These" (events with < 7 days until deadline)
- Red badge: "⏰ Ending Soon"
- 4-column grid
- Highlight with slightly larger shadow (9px 9px)

**Universities Section**
- Title: "Your Universities"
- Layout: 3-column grid (desktop)
- University Cards with logos, names, event counts

**Footer**
- Background: #000000
- Text Color: #FFFFFF
- Links: Space Grotesk, 14px, weight 700
- Copyright: Inter, 12px
- Sections: About MELA, For Students, For Organizers, Contact
- Social Icons: 36px × 36px, outlined, white borders

---

## 7.2 Event Discovery / Browse Page

**Header + Sidebar Filter**
- Fixed header (as above)
- **Filter Sidebar** (Desktop):
  - Position: Fixed left, width 280px, background #FFFFFF, border-right 3px black
  - Title: "Filters" (Space Grotesk 20px, weight 700)
  - Filter Sections:
    - **By Category**: Checkboxes (Tech, Business, Arts, Sports, Science)
    - **By Date**: Date range picker
    - **By Event Type**: Checkboxes (Workshops, Seminars, Competitions, etc.)
    - **By University**: Scrollable checkbox list
    - **By Status**: Checkboxes (Open, Closing Soon, Full)
  - Apply Button: Yellow CTA
  - Reset Button: Black outline
  - Sticky: Scroll with content

- **Mobile Filter**:
  - Filter button in header (funnel icon, 32px)
  - Opens modal overlay with all filters
  - Apply/Close buttons in modal footer

**Event Grid**
- Main content area (right of sidebar on desktop)
- 4-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Event Discovery Cards
- Sorting dropdown: "Newest," "Trending," "Ending Soon," "Most Popular"
- Pagination: 12 events per page, prev/next buttons (or infinite scroll)

**Search Bar**
- Position: Top of grid on mobile, inline with sort dropdown
- Placeholder: "Search events by name..."
- Focus: Yellow border outline
- Results: Live filtering

---

## 7.3 Event Detail Page

**Header** (as standard)

**Hero Section**
- Full-width event poster image (16:9 aspect ratio, 2px black border)
- Overlay gradient (optional): Semi-transparent black on bottom
- Breadcrumb: "Home > [University] > [Category] > Event Title"

**Event Info Section (White Card)**
- Title: Syne, 56px, weight 800
- Organizer Badge: Cyan pill with checkmark, organization name, "Verified"
- Quick Stats Row:
  - 📅 Date & Time
  - 📍 Venue & University
  - 👥 "342 registered" / "500 spots"
  - ⏰ "Registration closes in 3 days"
- Action Buttons (Row):
  - "Register Now" (yellow, large)
  - Heart icon (wishlist toggle)
  - Share icon

**Description Section**
- Heading: "About This Event" (Space Grotesk 32px, weight 700)
- Body: Inter 18px, line height 1.6
- Full event description, eligibility, requirements

**Key Details Card**
- 2-column grid (desktop):
  - Left: Date, Time, Registration Deadline
  - Right: Venue, Spots Remaining, Event Type, Category
- Each detail with icon (calendar, clock, location, etc.)
- Cards with light border (#DDDDDD), no shadow

**Organizer Section (Card)**
- Heading: "Event Organizer"
- Avatar: 96px × 96px
- Name: Space Grotesk 20px, weight 700
- Organization: Inter 14px
- Bio: Inter 16px
- Verification Badge: Cyan pill with checkmark
- Contact Buttons: Email, WhatsApp, LinkedIn, Instagram (icon buttons)
- "View More Events" link

**Additional Resources Section** (if applicable)
- Heading: "Event Resources"
- Downloadable files in a list:
  - File icon, name, size
  - Links styled as Space Grotesk 16px, weight 700, #FFD23F, underlined

**Comments & Reviews Section**
- Heading: "What Others Are Saying"
- Comment Input: Textarea with yellow "Post Comment" button
- Comments List:
  - Comment Cards (as described in 4.6)
  - Newest first
  - Pagination if > 5 comments

**Related Events Section**
- Heading: "More From This Organizer" / "Similar Events"
- 4-column grid
- Event Discovery Cards

**Footer** (as standard)

---

## 7.4 Student Dashboard / My Events Page

**Header** (as standard)

**Tabs**
- "Registered Events," "Wishlist," "Past Events," "My Profile"
- Tab styling: Space Grotesk 16px, weight 700, clicked tab has yellow background

**Registered Events Tab**
- Sorted by date (upcoming first)
- Status indicators: Green "Registered," Orange "Upcoming," Red "Cancelled"
- Cards show: Event title, organizer, date/time, venue, status, "View Details" / "Unregister" buttons
- Countdown timer if < 24 hours

**Wishlist Tab**
- Same card layout as Registered Events
- Heart icon to remove
- "Register Now" button for each
- Empty state: "Your wishlist is empty. Start saving events!"

**Past Events Tab**
- Grayed-out cards (opacity 0.7)
- "View Certificate" button if available
- "Review Event" link
- "Attended" or "Did Not Attend" badge

**My Profile Tab**
- Profile card with:
  - Avatar upload (square, 120px, 2px border)
  - Name, email, university
  - Bio text area
  - Interest tags (selectable)
  - "Save Changes" (yellow button)
- Preferences section:
  - Notification toggles (Space Grotesk 14px labels)
  - Email frequency dropdown
  - "Save Preferences" button

---

## 7.5 Organizer Dashboard

**Header** (as standard)

**Tabs**
- "My Events," "Create Event," "Participants," "Analytics," "Settings"

**My Events Tab**
- Table or card view:
  - Event name, date, registration count, status (Active/Ended/Draft)
  - Action buttons: "Edit," "Delete," "View Details"
  - Status badges: Green "Active," Yellow "Draft," Gray "Ended"
- "Create New Event" button (yellow CTA, prominent)

**Create Event Tab**
- Form with fields:
  - Event Title (text input)
  - Description (textarea)
  - Date & Time (date/time pickers)
  - Venue (text input with location search)
  - Category (dropdown)
  - Event Type (radio buttons)
  - Registration Deadline (date picker)
  - Participant Limit (number input)
  - Event Poster (file upload, drag-drop area with thick border)
  - Contact Information (email, phone, social links)
- "Publish Event" (yellow button), "Save Draft" (black button)

**Participants Tab**
- Table:
  - Student name, university, registration date, attendance status
  - Filters: By status, by date
  - Export CSV button
  - Search bar at top

**Analytics Tab**
- Metrics cards:
  - Total Registrations (large number)
  - Event Views (large number)
  - Attendance Rate (percentage with progress bar)
  - Average Rating (if applicable)
- Charts (simplified):
  - Registration over time (line chart with black borders)
  - Attendance by event (bar chart)

---

## 7.6 Admin Dashboard (Simplified for This Doc)

**Header** (as standard)

**Overview Cards**
- Total Users, Total Events, Active Universities, Active Organizers
- Large numbers, yellow highlights

**Recent Activity Section**
- Timeline of recent organizer approvals, event submissions, reports
- Cards with status badges

**Organizer Applications Section**
- Pending applications table:
  - Applicant name, organization, submission date
  - "Approve" (green button), "Reject" (red button)
  - "View Documents" link

**Reports & Moderation**
- List of reported content
- Cards showing report reason, reported item, reporter name
- "Review" button opens content

---

# 8. Responsive Design Breakpoints for MELA

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | 320px–479px | 1-column event grid, hamburger menu, full-width forms, reduced padding (12px) |
| Mobile+ | 480px–767px | 1–2 column grids, adaptive card widths, bottom navigation bar option |
| Tablet | 768px–1023px | 2-column event grid, sidebar filters visible (collapsible), sticky header, reduced hero text |
| Tablet+ | 1024px–1199px | 3-column grid option, full filters sidebar, standard padding (16px) |
| Desktop | 1200px+ | 4-column event grid, dual-panel layout (sidebar + main), max-width container |
| Desktop+ | 1440px+ | Max-width 1440px, centered, symmetrical side margins |

### Responsive Component Changes

**Event Discovery Card**
- Desktop: 4 columns, full image, all metadata visible
- Tablet: 2 columns, slightly smaller images
- Mobile: 1 column, full-width, swipeable (if carousel), condensed info

**Navigation**
- Desktop: Horizontal links, search inline
- Mobile: Hamburger menu, search in header or collapsible

**Filter Sidebar**
- Desktop: Fixed left sidebar (280px)
- Tablet: Collapsible sidebar or bottom drawer
- Mobile: Modal overlay with full-screen filters

**Event Detail Page**
- Desktop: 2-column (image + details side-by-side) or stacked
- Mobile: Fully stacked, large image, scrollable details

**Buttons**
- Desktop: Paired inline buttons ("Register Now" + "Add to Wishlist")
- Mobile: Stacked vertically, full-width

**Typography**
- H1: 144px (desktop) → 80px (tablet) → 48px (mobile)
- H2: 56px (desktop) → 32px (tablet) → 28px (mobile)
- H3: 32px (desktop) → 24px (tablet) → 20px (mobile)
- Body: 18px (all) — maintain readability

**Padding**
- Cards: 16px (desktop) → 12px (mobile)
- Sections: 32px (desktop) → 16px (mobile)
- Margins: 24px (desktop) → 12px (mobile)

---

# 9. Accessibility & Focus States for MELA

### Color Contrast
- **Text on backgrounds**: Minimum 4.5:1 WCAG AA ratio (required)
- **UI components**: 3:1 ratio (minimum)
- **Black text on white**: 21:1 (exceeds standards)
- **White text on black**: 21:1 (exceeds standards)
- **Yellow on white**: ~3:1 (secondary text only, not critical)
- **Yellow on black**: 14:1 (excellent for CTAs)

### Focus States (All Interactive Elements)

**Default Focus Ring**
```
Outline: 2px solid #FFD23F
Outline Offset: 2px
Applies to: Links, buttons, form inputs, icon buttons, selectable elements
Never remove focus indicators
```

**Focus Examples**
- **Button Focus**: 2px yellow outline, 2px offset, shadow unchanged
- **Link Focus**: Yellow outline, underline maintained
- **Input Focus**: Yellow outline, border remains 3px black, shadow increases
- **Icon Button Focus**: Yellow outline around entire button

### Keyboard Navigation
- Tab order follows visual hierarchy (left-to-right, top-to-bottom)
- Skip links: Allow users to skip to main content
- Modal focus trap: Focus cannot escape modal until closed
- Arrow keys for tabs (left/right), dropdowns (up/down)

### Screen Reader Support
- All images have alt text: "Event poster for [event name]"
- Form labels explicitly connected: `<label for="input-id">`
- ARIA roles: `role="navigation"`, `role="main"`, `role="complementary"`
- Live regions for notifications: `aria-live="polite"` or "assertive"

---

# 10. Animation & Micro-Interactions (Subtle Neobrutalism Style)

### Animation Philosophy
Neobrutalism intentionally **avoids excessive animation**. Movement is **sharp, instant, and purposeful**—no slow eases, bounces, or organic curves. Interactions feel mechanical and direct.

### Allowed Animations

**Button Interactions (No CSS transition duration, instant visual feedback)**
- Hover: Shadow increases (hard jump), scale ±2%, no blur
- Active: Shadow decreases (hard jump), scale -2%, no blur
- Example: `box-shadow` switches from `5px 5px` to `6px 6px` instantly (0ms)

**Card Hover Lift**
- Shadow: `8px 8px` → `9px 9px` (hard offset increase)
- Scale: 1.02x
- Duration: Instant (0ms) or minimal (50ms) for legitimacy

**Modal Entrance**
- No fade-in or slide animation
- Modal appears instantly with full opacity and shadow
- Or: Brief 100ms scale from 0.95 → 1.0 (if scale is acceptable)

**Notification Toast**
- Slide in from right (100ms)
- Slide out on dismiss (100ms)
- No fade

**Loading States**
- Spinner: Simple rotating black circle (3px border, white background)
- Rotation: 1s duration, linear (mechanical feel)
- Text: "Loading..." or animated dots (not fade, but appearance of new dots)

### Disabled States
- Opacity: 0.5
- Cursor: not-allowed
- Shadow: Removed or reduced to `2px 2px`
- No hover effects
- Border: Remains 3px black (visible structure is maintained)

---

# 11. MELA-Specific Color Applications

### Event Type Color Coding

| Event Type | Color | Use Case |
|------------|-------|----------|
| Workshops | #74B9FF (Sky Blue) | Training, skill-building sessions |
| Seminars | #7FDBDA (Cyan) | Lectures, industry talks |
| Competitions | #FF6B6B (Red) | Hackathons, contests, challenges |
| Conferences | #FFD23F (Yellow) | Large multi-day professional events |
| Sports Events | #88D498 (Green) | Athletic activities |
| Cultural Events | #FFA552 (Orange) | Arts, performances, celebrations |
| Networking | #74B9FF (Blue) | Meetups, professional gatherings |
| Research | #7FDBDA (Cyan) | Academic seminars, research talks |
| Career Fairs | #FFD23F (Yellow) | Job recruitment, internship fairs |

### Status Color Codes

| Status | Color | Meaning |
|--------|-------|---------|
| Registered | #88D498 (Green) | User is registered for this event |
| Wishlist | #FF6B6B (Red) | User has saved this event |
| Closing Soon | #FFA552 (Orange) | Registration deadline < 48 hours |
| Full | #FF4444 (Error Red) | No spots remaining |
| Upcoming | #74B9FF (Blue) | Event happening within 7 days |
| Cancelled | #666666 (Dark Gray) | Event is cancelled |
| Attended | #88D498 (Green) | User attended and checked in |

---

# 12. MELA Design Quick Reference (Agent Prompt)

### Essential Rules (Copy-Paste for Developers)

1. **All corners are square**: `border-radius: 0px` (no exceptions)

2. **Shadows are hard offsets**: `box-shadow: #000000 {X}px {Y}px 0px 0px` (no blur)
   - Small: `3px 3px`
   - Medium: `5px 5px`
   - Large: `8px 8px`
   - XL: `9px 9px`

3. **Borders are thick and black**: `border: 3px solid #000000` (primary), `border: 2px solid #000000` (secondary)

4. **Typography is bold**: UI defaults to weight 700–800; body text only uses 400

5. **Spacing aligns to 4px grid**: Use `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `48px`, `64px`, `96px`

6. **Primary buttons are yellow CTAs**: `background: #FFD23F`, `color: #000000`, `border: 3px solid #000000`, `box-shadow: 5px 5px 0px 0px #000000`

7. **Secondary buttons are black**: `background: #000000`, `color: #FFFFFF`, `border: 3px solid #000000`, `box-shadow: 5px 5px 0px 0px #000000`

8. **Cards are white with black borders**: `background: #FFFFFF`, `border: 3px solid #000000`, `box-shadow: 8px 8px 0px 0px #000000`

9. **Form inputs are white with black borders**: `background: #FFFFFF`, `border: 3px solid #000000`, `padding: 12px 16px`, `box-shadow: 3px 3px 0px 0px #000000`

10. **Interactive states add shadow depth**: Hover increases shadow offset; active/pressed reduces it. Never remove shadows.

11. **High contrast is required**: Minimum 4.5:1 WCAG AA for text; use bold colors only on neutral backgrounds

12. **Font stack**:
    - Headings: Syne (weight 800)
    - UI: Space Grotesk (weight 700)
    - Body: Inter (weight 400)
    - Code: Space Mono (weight 400)

13. **Line heights are generous**: Headings 1.2–1.4x; body 1.5–1.7x for readability

14. **Navigation is sticky with black bottom border**: `background: #FFFFFF`, `border-bottom: 3px solid #000000`, links `18px` Space Grotesk weight 700

15. **Focus states are always visible**: `outline: 2px solid #FFD23F`, never remove; increase shadow offset if conflict

16. **No animations except instant shadow/scale**: Button hover shadow jumps, no ease; card lift 50ms max; loading spinner 1s linear rotation

17. **Category tags use semantic colors**: Tech = Cyan, Business = Yellow, Arts = Red, Sports = Blue, Science = Green, Other = Orange

18. **Event cards are the hero**: Large shadow (8px), high visibility, prominent registration CTA (yellow)

19. **Disabled states reduce opacity to 0.5**: Remove hover effects, reduce shadow, but keep 3px black border visible

20. **No transparency on text**: Backgrounds and text 100% opaque unless explicitly interactive (ghost buttons, overlays at 0.3)

---

# 13. MELA UI Component Checklist

Use this checklist to ensure consistency across all MELA pages and features:

### Pages to Design
- [ ] Homepage (hero + featured + categories + universities)
- [ ] Browse/Discover Events (with sidebar filters)
- [ ] Event Detail Page (full event information)
- [ ] Event Registration Modal
- [ ] Student Dashboard (my events, wishlist, profile)
- [ ] Organizer Dashboard (my events, create event, participants, analytics)
- [ ] Search Results Page
- [ ] University Profile Page
- [ ] Organizer Profile Page
- [ ] Settings / Preferences Page
- [ ] Notification Center
- [ ] Admin Dashboard (organizer approvals, event management)

### Components to Implement
- [ ] Navigation Header (with search, hamburger menu on mobile)
- [ ] Event Discovery Card (grid, hover effects)
- [ ] Event Detail Card (full-page layout)
- [ ] Organizer Card (profile, verified badge)
- [ ] Registration Modal
- [ ] Comment/Review Cards
- [ ] Category Badges/Tags
- [ ] Primary Button (yellow CTA)
- [ ] Secondary Button (black)
- [ ] Tertiary Button (outlined)
- [ ] Icon Buttons (heart, share, menu)
- [ ] Text Inputs (with focus states)
- [ ] Textareas
- [ ] Dropdowns
- [ ] Checkboxes & Radio Buttons
- [ ] Date Pickers
- [ ] Toggle Switches
- [ ] Notification Toasts
- [ ] Confirmation Dialogs
- [ ] Modal Overlays
- [ ] Footer
- [ ] Filter Sidebar
- [ ] Breadcrumbs
- [ ] Pagination
- [ ] Loading States
- [ ] Error States
- [ ] Empty States

---

# 14. Final Notes for MELA

This design system is **bold, intentional, and unapologetic**. Every pixel serves a purpose. Thick borders, hard shadows, and high-contrast colors aren't decorative—they're functional. They ensure that opportunities are **unmissable** and that the interface **celebrates student engagement**.

The neobrutalism aesthetic perfectly fits MELA's mission: to make event discovery **direct, accessible, and energetic**. The platform says, "Yes, there are events happening, and you should know about them—now."

Implement this system consistently, and MELA will be a standout digital hub for university communities.

---

**Design System Version**: 1.0  
**Last Updated**: June 2026  
**For**: MELA - Centralized University Event Discovery Platform
