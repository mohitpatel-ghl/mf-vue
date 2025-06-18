declare module 'hostApp/store-adapter' {
    import { Ref } from 'vue';
  
    interface User {
      id: number;
      [key: string]: any;
    }
  
    export interface HostStoreState {
      users: Ref<User[]>;
      isLoading: Ref<boolean>;
      error: Ref<string | null>;
      userCount: Ref<number>;
    }
  
    export interface HostStoreAPI extends HostStoreState {
      fetchUsers: () => Promise<void>;
      addUser: (userData: Partial<User>) => Promise<void>;
      updateUser: (payload: { id: number; userData: Partial<User> }) => Promise<void>;
      deleteUser: (userId: number) => Promise<void>;
    }
  
    const hostStore: HostStoreAPI;
  
    export default hostStore;
  }
  
  declare global {
    interface Window {
      hostStore?: any;
    }
  }