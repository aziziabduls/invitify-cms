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
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
        comingSoon: true,
      },
      // {
      //   title: "Invoice",
      //   url: "/invoice",
      //   icon: ReceiptText,
      //   comingSoon: true,
      // },
      // {
      //   title: "Users",
      //   url: "/users",
      //   icon: Users,
      //   comingSoon: true,
      // },
      // {
      //   title: "Roles",
      //   url: "/roles",
      //   icon: Lock,
      //   comingSoon: true,
      // },


    ],
  },
  {
    id: 2,
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
      // {
      //   title: "E-commerce",
      //   url: "/dashboard/e-commerce",
      //   icon: ShoppingBag,
      //   comingSoon: true,
      // },
      // {
      //   title: "Academy",
      //   url: "/dashboard/academy",
      //   icon: GraduationCap,
      //   comingSoon: true,
      // },
      // {
      //   title: "Logistics",
      //   url: "/dashboard/logistics",
      //   icon: Forklift,
      //   comingSoon: true,
      // },

      // {
      //   title: "Email",
      //   url: "/mail",
      //   icon: Mail,
      //   comingSoon: true,
      // },
      // {
      //   title: "Chat",
      //   url: "/chat",
      //   icon: MessageSquare,
      //   comingSoon: true,
      // },
      // {
      //   title: "Calendar",
      //   url: "/calendar",
      //   icon: Calendar,
      //   comingSoon: true,
      // },
      // {
      //   title: "Kanban",
      //   url: "/kanban",
      //   icon: Kanban,
      //   comingSoon: true,
      // },
      {
        title: "Invoice",
        url: "/invoice",
        icon: ReceiptText,
        comingSoon: true,
      },
      // {
      //   title: "Users",
      //   url: "/users",
      //   icon: Users,
      //   comingSoon: true,
      // },
      {
        title: "Roles",
        url: "/roles",
        icon: Lock,
        comingSoon: true,
      },
      // {
      //   title: "Authentication",
      //   url: "/auth",
      //   icon: Fingerprint,
      //   subItems: [
      //     { title: "Login v1", url: "/auth/v1/login", newTab: true },
      //     { title: "Login v2", url: "/auth/v2/login", newTab: true },
      //     { title: "Register v1", url: "/auth/v1/register", newTab: true },
      //     { title: "Register v2", url: "/auth/v2/register", newTab: true },
      //   ],
      // },
    ],
  },
  {
    id: 3,
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
