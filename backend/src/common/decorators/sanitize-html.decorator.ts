import { Transform } from 'class-transformer';
import sanitizeHtml from 'sanitize-html';

/**
 * Decorator to sanitize HTML content from user input
 * Removes all HTML tags by default to prevent XSS attacks
 */
export function SanitizeHtml() {
  return Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value !== 'string') return value;

    return sanitizeHtml(value, {
      allowedTags: [], // No HTML tags allowed
      allowedAttributes: {},
      disallowedTagsMode: 'recursiveEscape',
    });
  });
}
