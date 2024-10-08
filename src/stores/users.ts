import { defineStore } from 'pinia';
import { addNewUser, deleteUser, getUsers, updateUser } from 'src/api';
import { User } from 'src/utils/types';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
  }),
  getters: {},
  actions: {
    async fetchUsersData() {
      const response = await getUsers();

      this.users = response.data;
    },
    async addUser(data: { name: string; age: number }) {
      const response = await addNewUser(data);

      if (response.data) {
        this.fetchUsersData();
      }
    },
    async updateUser(user: User) {
      const response = await updateUser(user);

      if (response.data) {
        this.fetchUsersData();
      }
    },
    async removeUser(id: string) {
      const response = await deleteUser(id);

      if (response.data) {
        this.fetchUsersData();
      }
    },
  },
});
