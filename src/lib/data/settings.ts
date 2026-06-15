import { siteContact } from "@/content/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

export type SiteSettings = Record<string, Json>;

function fallbackSettings(): SiteSettings {
  return {
    brand_name: siteContact.brand,
    company_name: siteContact.company,
    location: siteContact.location,
    shop_url: "https://shop.zorpro.hr",
    whatsapp_number: siteContact.whatsappNumber,
    contact_email: siteContact.email,
    phone: siteContact.phone,
  };
}

export async function getSiteSettings() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return fallbackSettings();
  }

  const { data, error } = await supabase.from("site_settings").select("key,value");

  if (error || !data) {
    return fallbackSettings();
  }

  return data.reduce<SiteSettings>((settings, item) => {
    settings[item.key] = item.value;
    return settings;
  }, fallbackSettings());
}

export async function getWhatsAppNumber() {
  const settings = await getSiteSettings();
  const value = settings.whatsapp_number;

  return typeof value === "string" && value ? value : siteContact.whatsappNumber;
}

export async function getShopUrl() {
  const settings = await getSiteSettings();
  const value = settings.shop_url;

  return typeof value === "string" && value ? value : "https://shop.zorpro.hr";
}
