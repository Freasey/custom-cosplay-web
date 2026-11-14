import type { ServiceKey } from "@/config/site";

export type Service = {
  key: ServiceKey;
  name: string;
  description: string;
};

export const services: Service[] = [
  {
    key: "kain",
    name: "Kostum kain",
    description: "Seragam, gaun, jubah, dan pakaian karakter.",
  },
  {
    key: "armor",
    name: "Armor",
    description: "Pelindung badan, helm, dan bagian keras lainnya.",
  },
  {
    key: "props",
    name: "Props",
    description: "Senjata tiruan, aksesori, dan perlengkapan.",
  },
];
