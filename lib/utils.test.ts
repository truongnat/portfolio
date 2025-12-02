import { describe, it, expect } from 'vitest';
import { cn, formatDate, calculateReadingTime, slugify } from './utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});

describe('formatDate', () => {
  it('formats Date object with default options', () => {
    const date = new Date('2024-01-15');
    const formatted = formatDate(date);
    expect(formatted).toMatch(/January 15, 2024/);
  });

  it('formats date string', () => {
    const formatted = formatDate('2024-01-15');
    expect(formatted).toMatch(/January 15, 2024/);
  });

  it('formats timestamp', () => {
    const timestamp = new Date('2024-01-15').getTime();
    const formatted = formatDate(timestamp);
    expect(formatted).toMatch(/January 15, 2024/);
  });

  it('formats with custom options', () => {
    const date = new Date('2024-01-15');
    const formatted = formatDate(date, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    expect(formatted).toMatch(/Jan 15, 2024/);
  });

  it('formats with different date formats', () => {
    const date = new Date('2024-12-25');
    const formatted = formatDate(date, { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    expect(formatted).toContain('December 25, 2024');
  });
});

describe('calculateReadingTime', () => {
  it('calculates reading time for average content (200 words)', () => {
    const content = 'word '.repeat(200);
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('calculates reading time for longer content (400 words)', () => {
    const content = 'word '.repeat(400);
    expect(calculateReadingTime(content)).toBe(2);
  });

  it('calculates reading time for short content (50 words)', () => {
    const content = 'word '.repeat(50);
    expect(calculateReadingTime(content)).toBe(1); // Rounds up
  });

  it('handles empty content', () => {
    expect(calculateReadingTime('')).toBe(0);
  });

  it('handles whitespace-only content', () => {
    expect(calculateReadingTime('   ')).toBe(0);
  });

  it('handles content with multiple spaces', () => {
    const content = 'word  word   word    word';
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('rounds up partial minutes', () => {
    const content = 'word '.repeat(250); // 250 words = 1.25 minutes
    expect(calculateReadingTime(content)).toBe(2);
  });

  it('calculates reading time for very long content', () => {
    const content = 'word '.repeat(1000);
    expect(calculateReadingTime(content)).toBe(5);
  });
});

describe('slugify', () => {
  it('converts text to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('This is a test')).toBe('this-is-a-test');
  });

  it('removes special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world');
  });

  it('handles multiple consecutive spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world');
  });

  it('handles leading and trailing spaces', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });

  it('handles leading and trailing hyphens', () => {
    expect(slugify('---Hello World---')).toBe('hello-world');
  });

  it('removes multiple consecutive hyphens', () => {
    expect(slugify('Hello---World')).toBe('hello-world');
  });

  it('handles special characters and accents', () => {
    expect(slugify('Café & Restaurant')).toBe('caf-restaurant');
  });

  it('handles numbers', () => {
    expect(slugify('Article 123')).toBe('article-123');
  });

  it('handles underscores', () => {
    expect(slugify('hello_world')).toBe('hello_world');
  });

  it('handles complex edge case', () => {
    expect(slugify('  !!!Hello@@@ ---World###  ')).toBe('hello-world');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles string with only special characters', () => {
    expect(slugify('!@#$%^&*()')).toBe('');
  });
});
