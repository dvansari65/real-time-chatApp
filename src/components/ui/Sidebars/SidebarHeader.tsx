import SearchBar from '@/components/SearchBar';
import QuickActions from '../QuickActions';

interface SidebarHeaderProps {
  onNewGroup: () => void;
}

export function SidebarHeader({ onNewGroup }: SidebarHeaderProps) {
  return (
    <>
      <SearchBar />
      <QuickActions setSelectUserModal={onNewGroup} />
    </>
  );
}