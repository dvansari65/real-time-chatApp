import { useMemo } from 'react';
import { useGetAllChats } from '@/lib/api/useGetAllChats';
import { User } from '@/types/user';

export function useChatList() {
  const { data: allChatsData, isLoading, error } = useGetAllChats();

  const filteredUsers = useMemo<Partial<User>[]>(() => {
    if (!allChatsData?.chats) return [];

    const users = allChatsData.chats.flatMap(
      chat =>
        chat.members
          ?.map(member => member?.user)
          .filter((u): u is Partial<User> => !!u) || []
    );

    // Remove duplicates by user ID
    const uniqueUsers = users.filter(
      (user, index, self) =>
        index === self.findIndex(u => u.id === user.id)
    );

    return uniqueUsers;
  }, [allChatsData]);

  const hasChats = (allChatsData?.chats?.length ?? 0) > 0;

  return {
    chats: allChatsData?.chats ?? [],
    filteredUsers,
    hasChats,
    isLoading,
    error,
  };
}
