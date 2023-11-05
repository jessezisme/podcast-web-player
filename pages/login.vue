<template>
  <section class="py-12">
    <div class="container">
      <h1 class="text-center">Login</h1>

      <button @click="loginGithub">Github Signin</button>

      <div class="max-w-full w-[600px] m-auto p-8 bg-slate-50">
        <UForm :validate="validate" :state="state" @submit="onSubmit" class="flex flex-col gap-8">
          <UFormGroup label="Email" name="email"> <UInput v-model="state.email" /> </UFormGroup>
          <UFormGroup label="Password" name="password"> <UInput v-model="state.password" type="password" /> </UFormGroup>
          <div class="text-center">
            <button type="submit" class="btn btn-primary btn--lg">Submit</button>
          </div>
        </UForm>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const state = reactive({
  email: '',
  password: '',
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: 'email', message: 'Email is required.' });
  if (!state.password) errors.push({ path: 'password', message: 'Password is required.' });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  login();
}

const login = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'demo-user',
    password: 'password',
  });
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();
};

const loginGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  });
};
</script>
