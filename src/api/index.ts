import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import { User } from 'src/utils/types';

export async function getUsers(): Promise<AxiosResponse<User[]>> {
  return api.get('/CRUDTest/a');
}

export async function addNewUser(
  data: Omit<User, 'id'>
): Promise<AxiosResponse<boolean>> {
  return api.post('/CRUDTest', data);
}

export async function updateUser(data: User) {
  return api.patch('/CRUDTest', data);
}

export async function deleteUser(id: User['id']) {
  return api.delete(`/CRUDTest/${id}`);
}
