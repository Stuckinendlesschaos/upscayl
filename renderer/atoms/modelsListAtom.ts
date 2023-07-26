import { atom } from "jotai";

export type TModelsList = {
  label: string;
  value: string;
}[];

export const defaultModelsList = [
  { label: "通用", value: "realesrgan-x4plus" },
  { label: "人像/风景", value: "remacri" },
  { label: "色彩饱和", value: "ultramix_balanced" },
  { label: "边缘锐化", value: "ultrasharp" },
  { label: "数字艺术", value: "realesrgan-x4plus-anime" },
];

export const modelsListAtom = atom<TModelsList>(defaultModelsList);
