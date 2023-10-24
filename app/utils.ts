import { C4Content } from "@/types";

export const createProxyUrls = (sites: C4Content[]) => {
    return sites.map(site => {
        return { ...site, proxyUrl: `https://corsproxy.io/?${encodeURIComponent(site.url)}` };
    });
};
