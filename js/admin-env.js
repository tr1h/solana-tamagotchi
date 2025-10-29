// AdminEnv: lightweight ENV loader for static admin pages
// Sources priority: URL params > localStorage > defaults
(function () {
  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || undefined;
  }

  const defaults = {
    SUPABASE_URL: '',
    SUPABASE_KEY: '',
    TAMA_API_BASE: '',
    REF_API_BASE: ''
  };

  const cfg = {
    SUPABASE_URL: getParam('supabase_url') || localStorage.getItem('SUPABASE_URL') || defaults.SUPABASE_URL,
    SUPABASE_KEY: getParam('supabase_key') || localStorage.getItem('SUPABASE_KEY') || defaults.SUPABASE_KEY,
    TAMA_API_BASE: getParam('tama_api') || localStorage.getItem('TAMA_API_BASE') || defaults.TAMA_API_BASE,
    REF_API_BASE: getParam('ref_api') || localStorage.getItem('REF_API_BASE') || defaults.REF_API_BASE
  };

  // Persist params to localStorage for future loads
  Object.entries(cfg).forEach(([k, v]) => {
    if (v) localStorage.setItem(k, v);
  });

  window.AdminEnv = cfg;
})();


