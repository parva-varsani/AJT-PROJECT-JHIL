import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Database,
  Download,
  FileCode2,
  FolderOpen,
  Search,
  Settings,
} from 'lucide-react';
import { ProjectFile, TomcatVersion } from '../data/javaFiles';
import { getAllProjectFiles } from '../data/netbeansProject';

interface NetBeansExplorerProps {
  tomcatVersion: TomcatVersion;
  onTomcatChange: (v: TomcatVersion) => void;
}

const FOLDER_ORDER: ProjectFile['folder'][] = [
  'Source Packages',
  'Web Pages',
  'Configuration Files',
  'Database SQL',
];

export default function NetBeansExplorer({
  tomcatVersion,
  onTomcatChange,
}: NetBeansExplorerProps) {
  const files = useMemo(() => getAllProjectFiles(tomcatVersion), [tomcatVersion]);
  const [selectedPath, setSelectedPath] = useState<string>('src/java/opticalcare/DBConnection.java');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredFiles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return files;
    return files.filter(
      (f) =>
        f.path.toLowerCase().includes(q) ||
        f.folder.toLowerCase().includes(q)
    );
  }, [files, search]);

  const activeFile = useMemo(() => {
    return files.find((f) => f.path === selectedPath) || files[0];
  }, [files, selectedPath]);

  const lines = useMemo(() => activeFile.content.split('\n'), [activeFile]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = activeFile.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleDownloadSingle = () => {
    const fileName = activeFile.path.split('/').pop() || 'file.txt';
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFolderIcon = (folder: ProjectFile['folder']) => {
    if (folder === 'Database SQL') return <Database className="w-4 h-4 text-teal-700 shrink-0" />;
    if (folder === 'Configuration Files') return <Settings className="w-4 h-4 text-slate-600 shrink-0" />;
    return <FolderOpen className="w-4 h-4 text-amber-600 shrink-0" />;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)] bg-white">
      <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/70 flex flex-col">
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Tomcat Servlet API</p>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                onClick={() => onTomcatChange('tomcat10')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  tomcatVersion === 'tomcat10'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tomcat 10 / 11
              </button>
              <button
                type="button"
                onClick={() => onTomcatChange('tomcat9')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  tomcatVersion === 'tomcat9'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tomcat 9
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Uses <code className="font-mono text-slate-700">{tomcatVersion === 'tomcat10' ? 'jakarta.servlet.*' : 'javax.servlet.*'}</code> imports
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter files..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>

        <div className="p-3 overflow-y-auto flex-1 space-y-4">
          {FOLDER_ORDER.map((folder) => {
            const folderFiles = filteredFiles.filter((f) => f.folder === folder);
            if (folderFiles.length === 0) return null;
            return (
              <div key={folder}>
                <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-slate-700">
                  {getFolderIcon(folder)}
                  <span>{folder}</span>
                  <span className="ml-auto text-[11px] font-normal text-slate-400 tabular-nums">
                    {folderFiles.length}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 pl-2">
                  {folderFiles.map((file) => {
                    const displayName = file.path
                      .replace('src/java/opticalcare/', 'opticalcare/')
                      .replace('web/WEB-INF/', 'WEB-INF/')
                      .replace('web/', '');
                    const isSelected = activeFile.path === file.path;
                    return (
                      <button
                        key={file.path}
                        type="button"
                        onClick={() => setSelectedPath(file.path)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-teal-700 text-white font-medium'
                            : 'text-slate-700 hover:bg-slate-200/70'
                        }`}
                      >
                        <FileCode2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-teal-100' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate font-mono text-[12px]">{displayName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <section className="flex-1 min-w-0 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 font-mono truncate">
              OpticalCare / {activeFile.path}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 tabular-nums">
              <span>{activeFile.folder}</span>
              <span aria-hidden="true">·</span>
              <span>{activeFile.language.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span>{lines.length} lines</span>
              <span aria-hidden="true">·</span>
              <span>Comment-free beginner code</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadSingle}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save File</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[#0f172a] text-slate-100 p-5">
          <div className="font-mono text-[13px] leading-6 min-w-max">
            {lines.map((line, idx) => (
              <div key={idx} className="flex hover:bg-slate-800/50 rounded-xs">
                <span className="select-none w-11 pr-4 text-right text-slate-500 tabular-nums shrink-0">
                  {idx + 1}
                </span>
                <span className="whitespace-pre text-slate-100">{line || ' '}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
