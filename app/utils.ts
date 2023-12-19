import { C4Content } from "@/types";

export const createProxyUrls = (sites: C4Content[]) => {
    return sites.map(site => {
        return { ...site, proxyUrl: `https://corsproxy.io/?${encodeURIComponent(site.url)}` };
    });
};

export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const isValidUrl = (url: string) => {
    const regex = /^(https):\/\/(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?(?:\/?|[\/?]\S+)$/i;
    return regex.test(url);
}