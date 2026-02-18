import type { ReportData } from "../../types/index.js";

interface ReportViewProps {
  reportData: ReportData | null;
  isLoading: boolean;
}

export const ReportView = ({ reportData, isLoading }: ReportViewProps) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-dim">Завантаження...</div>
      </div>
    );
  }

  if (!reportData || reportData.entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-dim">Немає записів за обраний період</div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary chips */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {reportData.totalByProject.map((item) => (
          <div
            key={item.project?.id || 'no-project'}
            className="flex items-center gap-2 bg-card border border-white/[0.06] rounded-full px-3 py-1.5"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.project?.color || '#6b7280' }}
            ></div>
            <span className="text-sm text-primary">
              {item.project?.name || 'Без проекту'}
            </span>
            <span className="font-mono text-sm text-secondary">
              {formatDuration(item.totalDuration)}
            </span>
          </div>
        ))}
      </div>

      {/* Report table */}
      <div className="bg-card rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="text-xs uppercase tracking-wider text-dim border-b border-white/[0.06]">
              <th className="text-left pb-2 px-4">Date</th>
              <th className="text-left pb-2 px-4">Project</th>
              <th className="text-left pb-2 px-4">Task</th>
              <th className="text-left pb-2 px-4">Start</th>
              <th className="text-left pb-2 px-4">End</th>
              <th className="text-left pb-2 px-4">Duration</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {reportData.entries.map((entry, index) => (
              <tr
                key={entry.id}
                className={`text-sm ${
                  index % 2 === 0 ? 'bg-card' : 'bg-surface'
                }`}
              >
                <td className="px-4 py-3 text-primary">
                  {formatDate(entry.startTime)}
                </td>
                <td className="px-4 py-3">
                  {entry.project ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: entry.project.color }}
                      ></div>
                      <span className="text-primary">{entry.project.name}</span>
                    </div>
                  ) : (
                    <span className="text-secondary">Без проекту</span>
                  )}
                </td>
                <td className="px-4 py-3 text-primary">
                  {entry.taskName}
                </td>
                <td className="px-4 py-3 text-secondary">
                  {formatTime(entry.startTime)}
                </td>
                <td className="px-4 py-3 text-secondary">
                  {entry.endTime ? formatTime(entry.endTime) : ''}
                </td>
                <td className="px-4 py-3">
                  {entry.duration ? (
                    <span className="font-mono text-secondary">
                      {formatDuration(entry.duration)}
                    </span>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Footer with grand total */}
          <tfoot>
            <tr className="border-t border-white/[0.06] bg-surface">
              <td colSpan={5} className="px-4 py-3 text-sm font-medium text-primary">
                Разом:
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-amber font-bold">
                  {formatDuration(reportData.grandTotal)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
