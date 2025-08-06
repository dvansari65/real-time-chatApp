
import { MessageCircle } from "lucide-react";

// Define the type for your link items
export type LinkItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  subLinks?: LinkItem[];
};
export const SIDEBAR_LINKS:LinkItem[] = [
    {
        name:"Chat",
        path:"/chat",
        icon:MessageCircle
    }
]