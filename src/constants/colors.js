/**
 * Centralized Color Design Tokens
 * Single source of truth for all application theme colors across client components.
 */

export const COLORS = {
  // Brand & Accent Colors
  primary: {
    DEFAULT: '#F59E0B', // Amber 500 - Primary Brand Accent
    dark: '#D97706',    // Amber 600 - Hover / Active state
    light: '#FBBF24',   // Amber 400 - Highlights
    glow: 'rgba(245, 158, 11, 0.25)', // Primary glow shadow
  },

  // Dark Theme Background Palette
  background: {
    DEFAULT: '#000000', // Pure Black
    deep: '#030303',    // Ultra Dark (e.g. Navigation overlay)
    card: '#0A0A0A',    // Card surfaces
    surface: '#111111', // Panel surfaces
    elevated: '#12131C',// Modal / Popover backgrounds
    alt: '#0B0C10',     // Dark alternate base
  },

  // Status & Utility Colors
  status: {
    success: '#10B981', // Emerald - Active, Completed, In Stock
    warning: '#F59E0B', // Amber - Pending, In Progress
    danger: '#EF4444',  // Rose - Cancelled, Errors, Trash
    info: '#3B82F6',    // Blue - Informational, Processing
    purple: '#8B5CF6',  // Purple - Custom Accent
  },

  // Typography Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF', // Gray 400
    muted: '#6B7280',     // Gray 500
    darkText: '#0B0C10',  // Contrast text on bright backgrounds
  },

  // Glassmorphism & Border Utilities
  borders: {
    subtle: 'rgba(255, 255, 255, 0.1)',
    faint: 'rgba(255, 255, 255, 0.05)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
  },

  // Chart Series Palette for Analytics & Data Viz
  charts: {
    series: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'],
    grid: 'rgba(255, 255, 255, 0.04)',
    axisTick: '#9CA3AF',
    tooltipBg: '#1F2937',
    tooltipBorder: '#374151',
  },
};

export default COLORS;
