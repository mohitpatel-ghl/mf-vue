declare module 'hostApp/store-adapter' {
  import type { User, RootState } from '@/types';

  export function initStoreBridge(store: {
    watch: (
      getter: (state: RootState) => any,
      callback: (value: any) => void,
      options?: { immediate?: boolean }
    ) => void;
    dispatch: (action: string, payload?: any) => Promise<any>;
  }): void;

  const storeAdapter: {
    users: User[];
    isLoading: boolean;
    error: string | null;
    userCount: number;
    fetchUsers: () => Promise<void>;
    fetchUserById: (id: number) => Promise<User>;
    updateUser: (payload: { id: number; userData: Partial<User> }) => Promise<void>;
    addUser: (userData: Omit<User, 'id'>) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
  };

  export default storeAdapter;
}
