import {
  AlertTriangle,
  ArmchairIcon,
  CalendarCheck,
  Home,
  Inbox,
  Newspaper,
  ShieldCheck,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { NavigatorItemProps } from "./types";

export const navigators: NavigatorItemProps[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Matches",
    url: "/matches",
    icon: Trophy,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: ShieldCheck,
  },
  {
    title: "Dugout",
    url: "/headlines",
    icon: ArmchairIcon,
  },
];

export const dugoutNavigators: NavigatorItemProps[] = [
  {
    title: "Headlines",
    url: "/headlines",
    icon: Newspaper,
  },
  {
    title: "Rising Stars",
    url: "/rising-stars",
    icon: TrendingUp,
  },
  {
    title: "Transfer/Injury",
    url: "/news",
    icon: AlertTriangle,
  },
  {
    title: "Weekly Recap",
    url: "/weekly-recap",
    icon: CalendarCheck,
  },
];
