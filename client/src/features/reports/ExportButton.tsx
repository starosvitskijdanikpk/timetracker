import type { TimeEntry } from "../../types/index.js";

interface ExportButtonProps {
  entries: TimeEntry[];
}

export const ExportButton = ({ entries }: ExportButtonProps) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleExport = () => {
    // CSV headers
    const headers = ['Date', 'Project', 'Task', 'Start', 'End', 'Duration'];
    
    // CSV rows
    const rows = entries.map(entry => [
      formatDate(entry.startTime),
      entry.project?.name || 'Без проекту',
      entry.taskName,
      formatTime(entry.startTime),
      entry.endTime ? formatTime(entry.endTime) : '',
      entry.duration ? formatDuration(entry.duration) : ''
    ]);

    // Create CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `time-tracker-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="border border-amber/40 text-amber rounded-lg px-4 py-2 text-sm hover:bg-amber/10 flex items-center gap-2 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Експорт CSV
    </button>
  );
};
