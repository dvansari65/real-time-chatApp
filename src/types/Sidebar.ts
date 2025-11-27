

export interface SidebarLink {
    label: string;
    href: string;
    icon?:React.ReactNode; 
    authRequired?: boolean; 
  }
  

  export interface SidebarState {
    selectUserModal: boolean;
    giveNameToNewGroupModal: boolean;
    groupName: string;
    description: string;
    avatar: File | null;
  }
  