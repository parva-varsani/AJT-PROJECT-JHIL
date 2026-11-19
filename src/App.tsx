import { useState } from 'react';
import { Download } from 'lucide-react';
import { TomcatVersion } from './data/javaFiles';
import { downloadNetBeansZip } from './data/netbeansProject';
import NetBeansExplorer from './components/NetBeansExplorer';
import LivePreview from './components/LivePreview';
import SetupGuide from './components/SetupGuide';

type ActiveTab = 'files' | 'preview' | 'setup';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('files');
  const [tomcatVersion, setTomcatVersion] = useState<TomcatVersion>('tomcat10');
  const [downloading, setDownloading] = useState(false);

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      await downloadNetBeansZip(tomcatVersion);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => setActiveTab('files')}
          className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          OpticalCare NetBeans
        </button>

        <nav className="flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'files'
                ? 'text-teal-800 font-semibold border-b-2 border-teal-700'
                : 'hover:text-slate-900'
            }`}
          >
            NetBeans Files
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'text-teal-800 font-semibold border-b-2 border-teal-700'
                : 'hover:text-slate-900'
            }`}
          >
            Live Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'setup'
                ? 'text-teal-800 font-semibold border-b-2 border-teal-700'
                : 'hover:text-slate-900'
            }`}
          >
            XAMPP Setup
          </button>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Preparing ZIP...' : 'Download Project ZIP'}</span>
          </button>
        </div>
      </header>

      <div className="flex-1">
        {activeTab === 'files' && (
          <NetBeansExplorer
            tomcatVersion={tomcatVersion}
            onTomcatChange={setTomcatVersion}
          />
        )}
        {activeTab === 'preview' && <LivePreview />}
        {activeTab === 'setup' && (
          <SetupGuide
            tomcatVersion={tomcatVersion}
            onTomcatChange={setTomcatVersion}
            onDownloadZip={handleDownloadZip}
          />
        )}
      </div>
    </div>
  );
}
