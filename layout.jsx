// app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "AI Ad Generator",
  description: "Generate consistent, on-brand ads instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-root">
          <div className="app-shell">
            {/* App Header */}
            <header className="app-header">
              <div className="app-header-left">
                <div className="logo-mark">A</div>
                <div>
                  <div className="logo-text-main">AI Ad Generator</div>
                  <div className="logo-text-sub">Campaign Consistency Engine</div>
                </div>
              </div>

              <div className="app-header-right">
                <div className="badge">MVP Beta</div>
                <div className="subtle-pill">No Login Required</div>
              </div>
            </header>

            {/* Page Content */}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
