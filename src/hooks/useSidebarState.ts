import { SidebarState } from "@/types/Sidebar";
import { useCallback, useState } from "react";


export function useSidebarState() {
    const [state, setState] = useState<SidebarState>({
      selectUserModal: false,
      giveNameToNewGroupModal: false,
      groupName: '',
      description: '',
      avatar: null,
    });
  
    const openSelectUserModal = useCallback(() => {
      setState(prev => ({ ...prev, selectUserModal: true }));
    }, []);
  
    const closeSelectUserModal = useCallback(() => {
      setState(prev => ({ ...prev, selectUserModal: false }));
    }, []);
  
    const openGroupNameModal = useCallback(() => {
      setState(prev => ({
        ...prev,
        selectUserModal: false,
        giveNameToNewGroupModal: true,
      }));
    }, []);
  
    const closeGroupNameModal = useCallback(() => {
      setState(prev => ({ ...prev, giveNameToNewGroupModal: false }));
    }, []);
  
    const backToUserSelection = useCallback(() => {
      setState(prev => ({
        ...prev,
        selectUserModal: true,
        giveNameToNewGroupModal: false,
      }));
    }, []);
  
    const setGroupName = useCallback((groupName: string) => {
      setState(prev => ({ ...prev, groupName }));
    }, []);
  
    const setDescription = useCallback((description: string) => {
      setState(prev => ({ ...prev, description }));
    }, []);
  
    const setAvatar = useCallback((avatar: File | null) => {
      setState(prev => ({ ...prev, avatar }));
    }, []);
  
    const resetState = useCallback(() => {
      setState({
        selectUserModal: false,
        giveNameToNewGroupModal: false,
        groupName: '',
        description: '',
        avatar: null,
      });
    }, []);
  
    return {
      state,
      actions: {
        openSelectUserModal,
        closeSelectUserModal,
        openGroupNameModal,
        closeGroupNameModal,
        backToUserSelection,
        setGroupName,
        setDescription,
        setAvatar,
        resetState,
      },
    };
  }