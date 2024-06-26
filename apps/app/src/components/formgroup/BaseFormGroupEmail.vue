<template>
    <b-form-group :state="isEmailValid" :invalid-feedback="String(error)" class="mb-0" label-class="d-flex">
        <template #label>
            E-mail
            <b-spinner v-if="isLoadingResend" class="ms-auto" small variant="primary" />
            <b-link v-else class="ms-auto text-primary" @click="onClickResend">Re-send e-mail</b-link>
        </template>
        <template v-if="!isEmailVerified" #description>
            <span class="text-danger"> E-mail is not verified</span>
        </template>
        <b-input-group>
            <b-form-input
                v-model="value"
                :state="isEmailValid"
                placeholder="john@example.io"
                @input="onInput"
                @change="onChange"
            />
            <b-input-group-append v-if="isLoading">
                <b-button size="sm" variant="primary" class="px-3" :disabled="true">
                    <b-spinner small />
                </b-button>
            </b-input-group-append>
            <b-input-group-append v-if="!isEmailVerified">
                <b-button size="sm" variant="primary" class="px-3" @click="accountStore.getAccount()">
                    <i class="fas fa-redo-alt"></i>
                </b-button>
            </b-input-group-append>
        </b-input-group>
    </b-form-group>
</template>

<script lang="ts">
import { useAccountStore } from '../../stores/Account';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'BaseFormGroupUsername',
    data() {
        return {
            value: '',
            error: '',
            debounce: 0,
            isLoadingResend: false,
            isLoading: false,
        };
    },
    computed: {
        ...mapStores(useAccountStore),
        isInvalidInput() {
            return !this.value || !this.value.length || this.value.length < 3 || !this.value.includes('@');
        },
        isEmailValid() {
            if (this.isInvalidInput || this.error.length) return false;
            return;
        },
        isEmailVerified() {
            if (!this.accountStore.account) return false;
            if (!this.accountStore.account.email) return false;
            return this.accountStore.account.isEmailVerified;
        },
    },
    mounted() {
        this.value = this.accountStore.account ? this.accountStore.account.email : '';
    },
    methods: {
        reset() {
            this.isLoading = false;
            this.error = '';
        },
        onInput() {
            this.isLoading = true;
            clearTimeout(this.debounce);
            this.debounce = setTimeout(this.update, 1000) as any;
        },
        onChange() {
            if (this.isLoading) return;
            this.update();
        },
        async onClickResend() {
            this.isLoadingResend = true;
            await this.accountStore.update({ email: this.value });
            await this.accountStore.getAccount();
            this.isLoadingResend = false;
        },
        async update() {
            if (this.isInvalidInput) {
                this.reset();
                return;
            }

            try {
                await this.accountStore.update({ email: this.value });
                await this.accountStore.getAccount();

                this.error = '';
            } catch (error) {
                this.error = 'This email is in use already.';
            } finally {
                this.$emit('error', this.error);
                this.isLoading = false;
            }
        },
    },
});
</script>
