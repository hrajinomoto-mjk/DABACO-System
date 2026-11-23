import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Language, translateTextToEnglish, translateTextToIndonesian } from '../utils/i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  locale: 'id-ID' | 'en-US';
  tr: (idText: string, enText: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'dabaco_language';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'NOSCRIPT']);

const shouldSkipElement = (el: Element | null): boolean => {
  let curr: Element | null = el;
  while (curr) {
    if (SKIP_TAGS.has(curr.tagName)) return true;
    if (
      curr.getAttribute('data-no-translate') === 'true' ||
      curr.getAttribute('data-i18n-native') === 'true'
    ) {
      return true;
    }
    curr = curr.parentElement;
  }
  return false;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'id') return saved;
    } catch {
      // Ignore storage access errors
    }
    return 'id';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === 'id' ? 'en' : 'id';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const locale: 'id-ID' | 'en-US' = language === 'en' ? 'en-US' : 'id-ID';

  const tr = useCallback(
    (idText: string, enText: string) => (language === 'en' ? enText : idText),
    [language]
  );

  // Sync <html lang="..."> and document title
  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === 'en'
        ? 'DABACO — Enterprise Budget Control System | PT Ajinomoto Indonesia'
        : 'DABACO — Sistem Pengendalian Anggaran | PT Ajinomoto Indonesia';
  }, [language]);

  // Layer 2: React-safe bidirectional enterprise DOM synchronizer for deep operational views, charts & modals
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const globalStore = window as unknown as {
      __dabacoI18nTextOrig?: WeakMap<Text, string>;
      __dabacoI18nTextWritten?: WeakMap<Text, string>;
      __dabacoI18nAttrOrig?: WeakMap<Element, Record<string, string>>;
      __dabacoI18nAttrWritten?: WeakMap<Element, Record<string, string>>;
    };

    if (!globalStore.__dabacoI18nTextOrig) globalStore.__dabacoI18nTextOrig = new WeakMap();
    if (!globalStore.__dabacoI18nTextWritten) globalStore.__dabacoI18nTextWritten = new WeakMap();
    if (!globalStore.__dabacoI18nAttrOrig) globalStore.__dabacoI18nAttrOrig = new WeakMap();
    if (!globalStore.__dabacoI18nAttrWritten) globalStore.__dabacoI18nAttrWritten = new WeakMap();

    const textOrig = globalStore.__dabacoI18nTextOrig;
    const textWritten = globalStore.__dabacoI18nTextWritten;
    const attrOrig = globalStore.__dabacoI18nAttrOrig;
    const attrWritten = globalStore.__dabacoI18nAttrWritten;

    const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'aria-label'];
    let isMutating = false;

    const translateForTarget = (source: string, targetLang: Language): string => {
      return targetLang === 'en'
        ? translateTextToEnglish(source)
        : translateTextToIndonesian(source);
    };

    const processElementAttrs = (el: Element, targetLang: Language) => {
      if (shouldSkipElement(el)) return;
      for (const attr of TRANSLATABLE_ATTRS) {
        const currentVal = el.getAttribute(attr);
        if (!currentVal) continue;

        let origRecord = attrOrig.get(el);
        let writtenRecord = attrWritten.get(el);

        if (!origRecord) {
          origRecord = {};
          attrOrig.set(el, origRecord);
        }
        if (!writtenRecord) {
          writtenRecord = {};
          attrWritten.set(el, writtenRecord);
        }

        // If React updated the attribute directly, capture the fresh canonical source
        if (writtenRecord[attr] !== currentVal) {
          origRecord[attr] = currentVal;
        }

        const canonical = origRecord[attr] ?? currentVal;
        const translated = translateForTarget(canonical, targetLang);

        if (translated !== currentVal) {
          writtenRecord[attr] = translated;
          el.setAttribute(attr, translated);
        } else if (translated === canonical && writtenRecord[attr] !== undefined) {
          delete writtenRecord[attr];
        }
      }
    };

    const processTextNode = (node: Text, targetLang: Language) => {
      if (shouldSkipElement(node.parentElement)) return;
      const currentVal = node.nodeValue || '';
      if (!currentVal.trim()) return;

      const lastWritten = textWritten.get(node);
      // If React updated the text node directly, record the fresh canonical source
      if (lastWritten !== currentVal) {
        textOrig.set(node, currentVal);
      }

      const canonical = textOrig.get(node) ?? currentVal;
      const translated = translateForTarget(canonical, targetLang);

      if (translated !== currentVal) {
        textWritten.set(node, translated);
        node.nodeValue = translated;
      } else if (translated === canonical && textWritten.has(node)) {
        textWritten.delete(node);
      }
    };

    const walkAndSync = (container: Node, targetLang: Language) => {
      if (isMutating) return;
      isMutating = true;
      try {
        if (container.nodeType === Node.TEXT_NODE) {
          processTextNode(container as Text, targetLang);
        } else if (container.nodeType === Node.ELEMENT_NODE) {
          const el = container as Element;
          if (!shouldSkipElement(el)) {
            processElementAttrs(el, targetLang);
            const walker = document.createTreeWalker(
              el,
              NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
            );
            let current = walker.nextNode();
            while (current) {
              if (current.nodeType === Node.TEXT_NODE) {
                processTextNode(current as Text, targetLang);
              } else if (current.nodeType === Node.ELEMENT_NODE) {
                processElementAttrs(current as Element, targetLang);
              }
              current = walker.nextNode();
            }
          }
        }
      } finally {
        isMutating = false;
      }
    };

    // Immediate sync pass + delayed sweep for async chart/modal renders
    walkAndSync(root, language);
    const settleTimer = window.setTimeout(() => {
      if (document.contains(root)) {
        walkAndSync(root, language);
      }
    }, 120);

    // Observe dynamic route/tab/modal/attribute/chart updates in BOTH ID and EN modes
    let rafId: number | null = null;
    const pendingNodes = new Set<Node>();

    const flush = () => {
      rafId = null;
      const nodes = Array.from(pendingNodes);
      pendingNodes.clear();
      for (const n of nodes) {
        if (document.contains(n)) {
          walkAndSync(n, language);
        }
      }
    };

    const observer = new MutationObserver((mutations) => {
      if (isMutating) return;
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => pendingNodes.add(node));
        } else if (m.type === 'characterData' || m.type === 'attributes') {
          pendingNodes.add(m.target);
        }
      }
      if (pendingNodes.size > 0 && rafId === null) {
        rafId = window.requestAnimationFrame(flush);
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRS
    });

    return () => {
      window.clearTimeout(settleTimer);
      observer.disconnect();
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, locale, tr }),
    [language, setLanguage, toggleLanguage, locale, tr]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
