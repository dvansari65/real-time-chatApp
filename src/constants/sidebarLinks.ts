
import { MessageCircle , Users2} from "lucide-react";

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
    },
    {
        name:"Users",
        path:"/Users",
        icon:Users2
    }
]