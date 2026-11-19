import { TomcatVersion } from '../data/javaFiles';

interface SetupGuideProps {
  tomcatVersion: TomcatVersion;
  onTomcatChange: (v: TomcatVersion) => void;
  onDownloadZip: () => void;
}

export default function SetupGuide({
  tomcatVersion,
  onTomcatChange,
  onDownloadZip,
}: SetupGuideProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Apache NetBeans + XAMPP Setup Guide
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Simplified beginner Java Web project with plain JDBC, 6 Servlets, and 13 JSP pages. No DAO, Service, or complex framework code.
          </p>
        </div>
        <button
          type="button"
          onClick={onDownloadZip}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0"
        >
          Download Project ZIP
        </button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-base font-semibold text-slate-900">
            01. Choose Your Installed Tomcat Version
          </h2>
          <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => onTomcatChange('tomcat10')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                tomcatVersion === 'tomcat10'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tomcat 10 / 11 (jakarta.servlet)
            </button>
            <button
              type="button"
              onClick={() => onTomcatChange('tomcat9')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                tomcatVersion === 'tomcat9'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tomcat 9 (javax.servlet)
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Switching this option automatically updates all 6 Servlets and <code className="font-mono text-slate-800">web.xml</code> before you copy code or download the ZIP. If NetBeans shows red underlines on <code className="font-mono text-slate-800">jakarta.servlet</code>, switch to Tomcat 9 above and re-download.
        </p>
      </section>

      <section className="space-y-5 pt-6 border-t border-slate-200">
        <h2 className="text-base font-semibold text-slate-900">
          02. Import Database in XAMPP phpMyAdmin
        </h2>
        <ol className="space-y-3 text-sm text-slate-700 list-decimal pl-5 leading-relaxed">
          <li>Open <strong>XAMPP Control Panel</strong> and make sure <strong>Apache</strong> and <strong>MySQL</strong> are running.</li>
          <li>Open your browser and go to <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">http://localhost/phpmyadmin</code>.</li>
          <li>Click the <strong>SQL</strong> tab at the top, paste the full content of <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">optical_store.sql</code> (or use the <strong>Import</strong> tab to upload the file), and click <strong>Go</strong>.</li>
          <li>Verify the database <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">optical_store</code> appears with 5 tables: <code className="font-mono text-xs">customers</code>, <code className="font-mono text-xs">products</code>, <code className="font-mono text-xs">prescriptions</code>, <code className="font-mono text-xs">orders</code>, and <code className="font-mono text-xs">inventory</code>.</li>
        </ol>
      </section>

      <section className="space-y-5 pt-6 border-t border-slate-200">
        <h2 className="text-base font-semibold text-slate-900">
          03. Create & Run in Apache NetBeans
        </h2>
        <ol className="space-y-3 text-sm text-slate-700 list-decimal pl-5 leading-relaxed">
          <li>Open <strong>Apache NetBeans</strong> and click <strong>File &gt; New Project &gt; Java with Ant &gt; Java Web &gt; Web Application</strong>.</li>
          <li>Name the project <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">OpticalCare</code>, select your installed <strong>Apache Tomcat</strong> server, and click <strong>Finish</strong>.</li>
          <li>Unzip the downloaded ZIP file. Copy everything from <code className="font-mono text-xs">OpticalCare/web/</code> into your NetBeans project&apos;s <code className="font-mono text-xs">web/</code> folder, and copy <code className="font-mono text-xs">OpticalCare/src/java/opticalcare/</code> into your NetBeans <code className="font-mono text-xs">src/java/</code> folder.</li>
          <li>Right-click <strong>Libraries</strong> in the NetBeans Projects panel &gt; <strong>Add JAR/Folder</strong> &gt; select your <code className="font-mono text-xs">mysql-connector-j-8.x.x.jar</code> (or <code className="font-mono text-xs">mysql-connector-java.jar</code>).</li>
          <li>Right-click the project and click <strong>Clean and Build</strong>, then click <strong>Run</strong>. Browser opens at <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">http://localhost:8080/OpticalCare/</code>.</li>
        </ol>
      </section>

      <section className="space-y-4 pt-6 border-t border-slate-200">
        <h2 className="text-base font-semibold text-slate-900">
          04. Default Login Accounts & Project Structure
        </h2>
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-2.5 px-4 font-semibold">Role</th>
                <th className="py-2.5 px-4 font-semibold">Email / Username</th>
                <th className="py-2.5 px-4 font-semibold">Password</th>
                <th className="py-2.5 px-4 font-semibold">Landing Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="py-2.5 px-4 font-medium">Customer</td>
                <td className="py-2.5 px-4 font-mono text-xs">customer.a@example.com</td>
                <td className="py-2.5 px-4 font-mono text-xs">customer123</td>
                <td className="py-2.5 px-4 font-mono text-xs">customer-dashboard.jsp</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium">Admin</td>
                <td className="py-2.5 px-4 font-mono text-xs">admin</td>
                <td className="py-2.5 px-4 font-mono text-xs">admin123</td>
                <td className="py-2.5 px-4 font-mono text-xs">admin-dashboard.jsp</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-2.5 px-4 font-semibold">Java File</th>
                <th className="py-2.5 px-4 font-semibold">What It Does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="py-2.5 px-4 font-mono text-xs">DBConnection.java</td>
                <td className="py-2.5 px-4">Connects to XAMPP MySQL database <code className="font-mono text-xs">optical_store</code> using root with blank password.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono text-xs">LoginServlet.java</td>
                <td className="py-2.5 px-4">Checks admin or MySQL <code className="font-mono text-xs">customers</code> table and stores user in <code className="font-mono text-xs">HttpSession</code>.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono text-xs">LogoutServlet.java</td>
                <td className="py-2.5 px-4">Invalidates session and returns to <code className="font-mono text-xs">index.jsp</code>.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono text-xs">RegisterServlet.java</td>
                <td className="py-2.5 px-4">Inserts new customer into <code className="font-mono text-xs">customers</code> table via <code className="font-mono text-xs">PreparedStatement</code>.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono text-xs">PrescriptionServlet.java</td>
                <td className="py-2.5 px-4">Saves customer eye values into <code className="font-mono text-xs">prescriptions</code> and lets admin mark records Reviewed.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono text-xs">OrderServlet.java</td>
                <td className="py-2.5 px-4">Creates an order from product details, redirects to <code className="font-mono text-xs">billing.jsp</code>, and lets admin update status.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono text-xs">InventoryServlet.java</td>
                <td className="py-2.5 px-4">Inserts new stock items into the <code className="font-mono text-xs">inventory</code> table.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
