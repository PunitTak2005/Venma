/**
 * Reusable Chart Tooltip Content Styler for Recharts.
 * Ensures chart hover cards render in crisp white with dark slate text
 * in both light and dark modes.
 */
export const chartTooltipStyles = {
  contentStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    color: '#0F172A',
    fontSize: '12px',
    fontWeight: 600,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
    padding: '8px 12px',
  },
  itemStyle: {
    color: '#1E293B',
    fontSize: '11px',
    fontWeight: 500,
  },
  labelStyle: {
    color: '#64748B',
    fontWeight: 700,
    marginBottom: '4px',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
};
