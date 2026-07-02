import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/plan', label: '7-Day Plan' },
  { to: '/topics', label: 'Topics' },
  { to: '/practice/builder', label: 'Answer Builder' },
  { to: '/practice/speaking', label: 'Speaking' },
  { to: '/practice/flashcards', label: 'Flashcards' },
  { to: '/questions', label: 'Questions' },
  { to: '/mock', label: 'Mock Exam' },
  { to: '/mistakes', label: 'Mistakes' },
  { to: '/readiness', label: 'Readiness' },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-accent">DevSecOps Prep</p>
            <h1 className="text-lg font-semibold">Cybersecurity Assessment Trainer</h1>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="rounded border border-border px-2 py-1 font-mono text-xs text-muted">
              D-M-B-R-E-C
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <nav
          className="hidden w-52 shrink-0 lg:block"
          aria-label="Main navigation"
        >
          <ul className="sticky top-20 space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-accent/20 font-medium text-blue-200'
                        : 'text-muted hover:bg-surface-raised hover:text-slate-200'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-raised lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex overflow-x-auto">
            {navItems.slice(0, 6).map((item) => (
              <li key={item.to} className="shrink-0">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `block px-3 py-3 text-xs ${
                      isActive ? 'text-accent' : 'text-muted'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main id="main-content" className="min-w-0 flex-1 pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
