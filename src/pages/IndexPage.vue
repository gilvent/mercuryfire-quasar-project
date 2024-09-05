<template>
  <q-page class="row q-pt-xl">
    <div class="full-width q-px-xl">
      <div class="q-mb-xl">
        <q-input
          ref="nameInputRef"
          v-model="addUserForm.name"
          label="姓名"
          :rules="nameInputRules"
        />
        <q-input
          ref="ageInputRef"
          label="年齡"
          v-model="addUserForm.age"
          :rules="ageInputRules"
        />
        <q-btn color="primary" class="q-mt-md" @click="onAddClick">新增</q-btn>
      </div>

      <q-table
        flat
        bordered
        ref="tableRef"
        :rows="usersStore.users"
        :columns="(tableConfig as QTableProps['columns'])"
        row-key="id"
        hide-pagination
        separator="cell"
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th></q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              style="min-width: 120px"
            >
              <div>{{ col.value }}</div>
            </q-td>
            <q-td class="text-right" auto-width v-if="tableButtons.length > 0">
              <q-btn
                @click="handleClickOption(btn, props.row)"
                v-for="(btn, index) in tableButtons"
                :key="index"
                size="sm"
                color="grey-6"
                round
                dense
                :icon="btn.icon"
                class="q-ml-md"
                padding="5px 5px"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  {{ btn.label }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:no-data="{ icon }">
          <div
            class="full-width row flex-center items-center text-primary q-gutter-sm"
            style="font-size: 18px"
          >
            <q-icon size="2em" :name="icon" />
            <span> 無相關資料 </span>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps, ValidationRule } from 'quasar';
import { useUsersStore } from 'src/stores/users';
import { User } from 'src/utils/types';
import { onMounted, ref } from 'vue';

interface ButtonType {
  label: string;
  icon: string;
  status: string;
}

const usersStore = useUsersStore();

const tableConfig = ref([
  {
    label: '姓名',
    name: 'name',
    field: 'name',
    align: 'left',
  },
  {
    label: '年齡',
    name: 'age',
    field: 'age',
    align: 'left',
  },
]);

const tableButtons = ref([
  {
    label: '編輯',
    icon: 'edit',
    status: 'edit',
  },
  {
    label: '刪除',
    icon: 'delete',
    status: 'delete',
  },
]);

const addUserForm = ref({
  name: '',
  age: '',
});

const nameInputRef = ref();
const ageInputRef = ref();

const nameInputRules = [isNotEmptyRule] as ValidationRule[];
const ageInputRules = [isNotEmptyRule, isNumericRule] as ValidationRule[];

function isNotEmptyRule(value: string): boolean | string {
  return value !== '' || '不得空白';
}

function isNumericRule(value: string): boolean | string {
  return !!value.match(/^\d+$/) || '限輸入數字';
}

function handleClickOption(btn: ButtonType, user: User) {
  const actionsByStatus: Record<ButtonType['status'], (user: User) => void> = {
    delete: deleteUser,
    edit: enterEditMode,
  };

  actionsByStatus[btn.status](user);
}

function enterEditMode(user: User) {
  // TODO handle edit feature
}

function deleteUser(user: User) {
  usersStore.removeUser(user.id);
}

function onAddClick() {
  nameInputRef.value.validate();
  ageInputRef.value.validate();

  if (nameInputRef.value.hasError || ageInputRef.value.hasError) {
    return;
  }

  usersStore.addUser({
    name: addUserForm.value.name,
    age: parseInt(addUserForm.value.age, 10),
  });
}

onMounted(() => {
  usersStore.fetchUsersData();
});
</script>

<style lang="scss" scoped>
.q-table th {
  font-size: 20px;
  font-weight: bold;
}

.q-table tbody td {
  font-size: 18px;
}
</style>
