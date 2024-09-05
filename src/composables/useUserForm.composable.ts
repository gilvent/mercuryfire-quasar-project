import { ValidationRule } from 'quasar';
import { useUsersStore } from 'src/stores/users';
import { User } from 'src/utils/types';
import { computed, ref } from 'vue';

enum FormMode {
  Edit = 'edit',
  Add = 'add',
}

type UserForm = {
  id: string | null;
  name: string | null;
  age: string | null;
};

export default function useUserForm() {
  const usersStore = useUsersStore();
  const userForm = ref<UserForm>({
    id: null,
    name: null,
    age: null,
  });
  const formMode = ref<FormMode>(FormMode.Add);
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

  function enterEditMode(user: User) {
    formMode.value = FormMode.Edit;
    userForm.value.name = user.name;
    userForm.value.age = user.age.toString();
    userForm.value.id = user.id;
  }

  function onSubmitButtonClick() {
    nameInputRef.value.validate();
    ageInputRef.value.validate();

    if (nameInputRef.value.hasError || ageInputRef.value.hasError) {
      return;
    }

    submit();
  }

  function reset() {
    userForm.value.name = null;
    userForm.value.age = null;
    userForm.value.id = null;

    nameInputRef.value.resetValidation();
    ageInputRef.value.resetValidation();
  }

  function submit() {
    if (formMode.value === FormMode.Edit) {
      usersStore.updateUser({
        id: userForm.value.id as string,
        name: userForm.value.name as string,
        age: parseInt(userForm.value.age as string, 10),
      });
    } else {
      usersStore.addUser({
        name: userForm.value.name as string,
        age: parseInt(userForm.value.age as string, 10),
      });
    }

    reset();
  }

  const formButtonText = computed(() => {
    if (formMode.value === FormMode.Edit) {
      return '更新';
    }

    return '新增';
  });

  return {
    userForm,
    formButtonText,
    nameInputRef,
    ageInputRef,
    nameInputRules,
    ageInputRules,
    enterEditMode,
    onSubmitButtonClick,
  };
}
