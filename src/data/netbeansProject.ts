import JSZip from 'jszip';
import { getJavaFiles, ProjectFile, TomcatVersion } from './javaFiles';
import { getJspFiles } from './jspFiles';
import { getStaticFiles } from './staticFiles';

export function getAllProjectFiles(tomcatVersion: TomcatVersion): ProjectFile[] {
  return [
    ...getJavaFiles(tomcatVersion),
    ...getJspFiles(),
    ...getStaticFiles(tomcatVersion),
  ];
}

export async function downloadNetBeansZip(tomcatVersion: TomcatVersion): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder('OpticalCare');
  if (!root) return;

  const files = getAllProjectFiles(tomcatVersion);
  for (const file of files) {
    root.file(file.path, file.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `OpticalCare_NetBeans_${tomcatVersion === 'tomcat10' ? 'Tomcat10' : 'Tomcat9'}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
