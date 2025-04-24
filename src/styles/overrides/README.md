# CSS Overrides

This directory contains module-specific CSS overrides. Only create override files when a module requires styles that significantly deviate from the base styles.

## When to Create an Override

Create an override file when a module needs:

1. Special layout requirements that don't fit the standard grid
2. Custom responsive behavior
3. Unique field arrangements
4. Special view mode handling

## Naming Convention

Name override files using the following format:

```
{module-name}.css
```

Example:

```
ppe-inspection.css
risk-assessment.css
```

## File Structure

Each override file should:

1. Start with a comment explaining why the override is needed
2. Only include the necessary overrides
3. Use the same CSS variable system as base styles
4. Include responsive styles if needed

Example:

```css
/* 
 * PPE Inspection Module Override
 * This override is needed because the PPE checklist requires a custom grid layout
 * that differs from the standard two-column layout.
 */

.module-container[data-module-type="ppe-inspection"] {
  /* Custom styles here */
}
```

## Documentation Requirements

Each override file must include:

1. Purpose of the override
2. Description of changes from base styles
3. Example usage
4. Responsive considerations
5. Any dependencies on other styles

## Testing Requirements

Before committing an override:

1. Test in all view modes (Print, Quick Fill, Guided)
2. Test on all screen sizes
3. Verify it doesn't affect other modules
4. Check accessibility
5. Validate against base styles

## Example Override

```css
/* 
 * Special Module Override
 * Purpose: Handle complex multi-column layout for large screens
 */

.module-container[data-module-type="special"] {
  /* Desktop Layout */
  @media (min-width: var(--desktop-breakpoint)) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
  }

  /* Tablet Layout */
  @media (min-width: var(--tablet-breakpoint)) and (max-width: var(--desktop-breakpoint)) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  /* Mobile Layout */
  @media (max-width: var(--mobile-breakpoint)) {
    display: flex;
    flex-direction: column;
  }
}
```

## Best Practices

1. **Minimize Overrides**

   - Only override what's necessary
   - Reuse base styles when possible
   - Consider updating base styles if multiple modules need similar changes

2. **Maintain Consistency**

   - Use CSS variables from base styles
   - Follow the same naming conventions
   - Keep similar structure to base styles

3. **Document Everything**

   - Explain why the override is needed
   - Document any special considerations
   - Include examples of usage

4. **Test Thoroughly**
   - Test all view modes
   - Test all screen sizes
   - Verify accessibility
   - Check for conflicts
