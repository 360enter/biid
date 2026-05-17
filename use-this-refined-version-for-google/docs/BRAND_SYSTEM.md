# Apex Strategic Holdings Brand and UI System

## Visual Identity

Apex Strategic Holdings should feel institutional, executive, and commercially mature. The interface avoids playful color flooding and relies on high-contrast information surfaces, restrained accent colors, strong hierarchy, and precise workflow controls.

## Color Palette

- Apex Navy `#0f172a`: primary brand authority
- Institutional Teal `#0f766e`: primary actions, success, progress
- Procurement Blue `#2563eb`: status, links, active information
- Ledger Gold `#b7791f`: premium access and commercial cues
- Slate `#334155`: secondary copy
- Mist Line `#dbe3ef`: borders and dividers
- Paper `#f8fafc`: page background
- Panel White `#ffffff`: cards, dialogs, tables

## Typography

- Use a system UI stack for speed and reliability.
- H1 is reserved for the landing hero and brand signal.
- H2 defines major product areas.
- H3 defines cards, panels, and modal sections.
- Labels use compact uppercase text for enterprise form scanning.

## Component Standards

- Cards: white panel, 1px border, 8px radius, soft shadow, subtle lift on hover.
- Buttons: primary teal, secondary neutral/transparent, tertiary quiet white.
- Tables: dense but readable, uppercase headers, visible row separators.
- Forms: clear labels, focus rings, validation using native browser constraints.
- Modals: `dialog` element, blurred backdrop, sticky close button, scroll-contained body.
- Toasts: bottom-right, dark panel, short confirmation copy.
- Loading states: skeleton shimmer blocks matching the eventual content footprint.

## Animation Language

- 160ms to 260ms for controls and card hovers.
- 1100ms count-up only for landing statistics.
- Avoid excessive looping motion.
- Prefer opacity, transform, and background-position animations.

## Responsive Behavior

- Desktop: directory grid plus sticky bid desk side panel.
- Tablet: filters stack, project grid remains two columns when space allows.
- Mobile: single-column cards, collapsible navigation, admin table scrolls horizontally.
