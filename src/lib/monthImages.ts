import januaryImg from "@/assets/months/january.jpg";
import aprilImg from "@/assets/months/april.jpg";
import julyImg from "@/assets/months/july.jpg";
import octoberImg from "@/assets/months/october.jpg";

const MONTH_IMAGES: Record<number, string> = {
  0: januaryImg,
  1: januaryImg,
  2: aprilImg,
  3: aprilImg,
  4: aprilImg,
  5: julyImg,
  6: julyImg,
  7: julyImg,
  8: octoberImg,
  9: octoberImg,
  10: januaryImg,
  11: januaryImg,
};

export function getMonthImage(month: number): string {
  return MONTH_IMAGES[month] ?? januaryImg;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
