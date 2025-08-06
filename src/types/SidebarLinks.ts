import { LucideIcon } from "lucide-react";
import { JSX } from "react";


export interface SidebarLink {
    label: string;
    href: string;
    icon?:React.ReactNode; 
    authRequired?: boolean; 
  }
  