/**
 * Utility functions to export JSON data to CSV files for download.
 */

export function exportEventsToCSV(events = [], filename = 'ulpf_normalized_events.csv') {
  if (!events || events.length === 0) {
    alert("No events available to export.");
    return;
  }

  // Headers
  const headers = [
    'Event ID',
    'Timestamp',
    'Event Type',
    'Source System',
    'User',
    'Source IP',
    'Severity',
    'Parser ID',
    'Raw Log Hash',
    'Processing Time (ms)',
    'Confidence Score'
  ];

  // Map rows
  const rows = events.map(ev => [
    escapeCSV(ev.event_id),
    escapeCSV(ev.timestamp),
    escapeCSV(ev.event_type),
    escapeCSV(ev.source),
    escapeCSV(ev.user || ''),
    escapeCSV(ev.source_ip || ''),
    escapeCSV(ev.severity),
    escapeCSV(ev.parser_id),
    escapeCSV(ev.raw_log_hash || ev.raw_event?.raw_log_hash || ''),
    escapeCSV(ev.processing_time_ms || ''),
    escapeCSV(ev.confidence || '')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Trigger Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(str) {
  if (str === null || str === undefined) return '""';
  const val = String(str).replace(/"/g, '""');
  return `"${val}"`;
}
