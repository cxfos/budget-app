# Design Audit Checklist for Budget App

## 1. Responsiveness
- [ ] Ensure all layouts adapt to mobile, tablet, and desktop.
- [ ] Use CSS grid/flexbox for fluid resizing.
- [ ] Test all forms and buttons for tap targets on mobile.

## 2. Consistency
- [ ] Use a single color palette and font family throughout.
- [ ] Standardize button, input, and card styles.
- [ ] Align paddings, margins, and font sizes for all components.

## 3. Modern Look
- [ ] Use cards, soft shadows, and rounded corners for sections.
- [ ] Add subtle gradients or accent backgrounds where appropriate.
- [ ] Use modern iconography (e.g., Heroicons, Feather).

## 4. Professionalism
- [ ] Use clean, readable typography (Inter, Roboto, or system sans-serif).
- [ ] Ensure all text is left-aligned and buttons are consistently styled.
- [ ] Add whitespace between sections for clarity.

## 5. Accessibility
- [ ] Ensure color contrast meets WCAG AA standards.
- [ ] All interactive elements are keyboard accessible.
- [ ] Use aria-labels for important buttons and forms.

## 6. Feedback
- [ ] Add loading spinners or skeletons for async actions.
- [ ] Show clear error and success messages.
- [ ] Animate add/edit/delete actions with fade or slide transitions.

## 7. Branding
- [ ] Use the defined color palette and logo.
- [ ] Add a favicon and app title.

---

# Actionable Design Improvements

1. **Navigation Bar**
   - Add a top nav bar with logo and logout/profile button.
   - Use a sticky nav for mobile.

2. **Dashboard**
   - Place total spent this month in a prominent card.
   - Add a floating or prominent "Add Expense" button.
   - Use cards for summary sections (e.g., category breakdown).

3. **Expenses List**
   - Use a card or table layout with clear columns: Date, Category, Description, Amount, Actions.
   - Add hover/focus effects to rows/cards.
   - Use icons for edit/delete.

4. **Forms (Add/Edit Expense, Login, Register)**
   - Use card layout for forms with clear section titles.
   - Add input focus/active states.
   - Use large, full-width buttons for actions.
   - Add subtle box-shadow to form cards.

5. **Mobile Responsiveness**
   - Stack filters and form fields vertically on small screens.
   - Use a drawer or bottom sheet for mobile nav/actions if needed.
   - Ensure all tap targets are at least 44x44px.

6. **Visual Polish**
   - Add soft background color or gradient to main app background.
   - Use accent color for primary actions and highlights.
   - Add subtle transitions for modal open/close and list updates.

7. **Accessibility & Feedback**
   - Add aria-labels to all buttons and forms.
   - Use toast/snackbar for success/error feedback.
   - Ensure all text is readable and not clipped on any device.

---

# Next Steps
- Review each page/component against this checklist.
- Prioritize improvements that impact usability and clarity first.
- Reference the design instructions in `.ai-docs/design-instructions.md` for color, font, and layout guidance. 