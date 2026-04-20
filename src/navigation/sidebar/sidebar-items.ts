import {
  ShoppingBag,
  Forklift,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  ReceiptText,
  Users,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Gauge,
  GraduationCap,
  type LucideIcon,
  Settings,
  Clapperboard,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  allowedRoles?: string[];
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Menu",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Organizer",
        url: "/dashboard/organizer",
        icon: Kanban,
      },
      {
        title: "Event",
        url: "/dashboard/event/event-list",
        icon: Clapperboard,
      },
      {
        title: "Participant",
        url: "/dashboard/participant",
        icon: Users,
      },
      {
        title: "Attendance",
        url: "/dashboard/attendance",
        icon: Fingerprint,
      },

      {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
      },
    ],
  },
  {
    id: 2,
    label: "Administration",
    items: [
      {
        title: "User Management",
        url: "/dashboard/admin/roles",
        icon: Lock,
        allowedRoles: ["SUPER_ADMIN"],
      },
    ],
  },
  {
    id: 3,
    label: "Pages",
    items: [
      {
        title: "CRM",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Gauge,
        comingSoon: true,
      },
      {
        title: "Invoice",
        url: "/invoice",
        icon: ReceiptText,
        comingSoon: true,
      },
    ],
  },
  {
    id: 4,
    label: "Settings",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        comingSoon: true,
      },
      {
        title: "Others",
        url: "/others",
        icon: SquareArrowUpRight,
        comingSoon: true,
      },
    ],
  },
];
