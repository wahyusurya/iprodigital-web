import { db } from "@/api/db";

import { useState, useEffect } from 'react';

let cache = null;
let fetchPromise = null;

export function clearSiteSettingsCache() {
  cache = null;
  fetchPromise = null;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(cache);

  useEffect(() => {
    if (cache) {
      setSettings(cache);
      return;
    }
    if (!fetchPromise) {
      fetchPromise = db.entities.SiteSettings
        .list(1)
        .then((items) => {
          cache = items.length > 0 ? items[0] : {};
        })
        .catch(() => {
          cache = {};
        })
        .finally(() => {
          fetchPromise = null;
        });
    }
    fetchPromise.then(() => setSettings(cache));
  }, []);

  return settings;
}