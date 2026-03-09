const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; }
    .mono { font-family: 'DM Mono', monospace; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.4s ease both; }
    .d0 { animation-delay: 0ms; }
    .d1 { animation-delay: 60ms; }
    .d2 { animation-delay: 120ms; }
    .d3 { animation-delay: 180ms; }
    .d4 { animation-delay: 240ms; }

    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; border-radius: 10px;
      font-size: 13.5px; font-weight: 500;
      cursor: pointer; transition: all 0.15s ease;
      color: #94a3b8; border: none; background: none; width: 100%;
    }
    .nav-item:hover { color: #e2e8f0; background: rgba(255,255,255,0.06); }
    .nav-item.active { color: #fff; background: rgba(99,102,241,0.25); }
    .nav-item.active .nav-dot { opacity: 1; }
    .nav-dot { width: 6px; height: 6px; border-radius: 50%; background: #6366f1; opacity: 0; transition: opacity 0.2s; flex-shrink: 0; }

    .row-hover:hover td { background: #f8f9ff !important; }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 8px 16px; border-radius: 10px; font-size: 13px;
      font-weight: 600; cursor: pointer; border: none;
      background: #6366f1; color: #fff; transition: all 0.15s;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-primary:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,102,241,0.35); }

    .btn-secondary {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 8px 16px; border-radius: 10px; font-size: 13px;
      font-weight: 500; cursor: pointer;
      border: 1px solid #e5e7eb; background: #fff; color: #374151;
      transition: all 0.15s; font-family: 'DM Sans', sans-serif;
    }
    .btn-secondary:hover { background: #f9fafb; }

    input, textarea, select { font-family: 'DM Sans', sans-serif; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }

    .modal-backdrop {
      position: fixed; inset: 0; z-index: 50;
      background: rgba(15,23,42,0.5); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
    }
  `}</style>
);

export default FontLink;
