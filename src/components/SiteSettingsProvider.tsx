"use client";

import { createContext, useContext, type ReactNode } from "react";
import { fallbackSiteContact, type SiteContact } from "@/content/site";

const SiteContactContext = createContext<SiteContact>(fallbackSiteContact);

export function SiteSettingsProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: SiteContact;
}) {
  return (
    <SiteContactContext.Provider value={value}>
      {children}
    </SiteContactContext.Provider>
  );
}

export function useSiteContact() {
  return useContext(SiteContactContext);
}
