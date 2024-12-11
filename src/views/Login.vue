<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="login-container">
        <div class="login-box">
          <!-- Lado esquerdo - Imagem/Banner -->
          <div class="login-banner">
            <img src="./../../public/assets/img/appicon.svg" alt="Logo" class="small-logo" />
            <div class="banner-content">
              <h1>Bem-vindo de volta!</h1>
              <p>Visualize informações das suas doações de forma simples e rápida</p>
            </div>
          </div>

          <!-- Lado direito - Formulário -->
          <div class="login-form-container">
            <div class="form-header">
              <h2>Faça seu login</h2>
              <p>Entre com suas credenciais para acessar</p>
            </div>

            <form novalidate @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <ion-item :class="{ 'ion-invalid': validation.usernameError }">
                  <ion-input
                    label="CPF"
                    labelPlacement="floating"
                    v-model="form.username"
                    name="username"
                    type="text"
                    :spellcheck="false"
                    autocapitalize="off"
                    required
                    @ionInput="validateUsername"
                    :maxlength="14"
                  ></ion-input>
                  <ion-note slot="error">{{ validation.usernameError }}</ion-note>
                </ion-item>

                <ion-item :class="{ 'ion-invalid': validation.passwordError }">
                  <ion-input
                    label="Senha"
                    labelPlacement="floating"
                    v-model="form.password"
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    @ionInput="validatePassword"
                  >
                    <ion-icon
                      :icon="showPassword ? 'eye-off' : 'eye'"
                      slot="end"
                      class="password-toggle"
                      @click="showPassword = !showPassword"
                    ></ion-icon>
                  </ion-input>
                  <ion-note slot="error">{{ validation.passwordError }}</ion-note>
                </ion-item>
              </div>

              <div class="form-actions">
                <ion-button
                  type="submit"
                  expand="block"
                  class="login-button"
                  :class="{ 'button-loading': isLoading }"
                >
                  <ion-spinner v-if="isLoading"></ion-spinner>
                  <span v-else>Entrar</span>
                </ion-button>

                <div class="additional-actions">
                  <a href="#" class="forgot-password">Esqueceu sua senha?</a>
                  <a @click="onSignup" class="create-account">Criar conta</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :duration="2000"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import {
  IonPage,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonRow,
  IonCol,
  IonInput,
  IonToast,
} from '@ionic/vue';

const {
  form,
  validation,
  isLoading,
  showPassword,
  validateUsername,
  validatePassword,
  handleLogin,
  showToast,
  toastMessage
} = useAuth();

const onSignup = () => {
  // Implementar navegação para página de cadastro
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ion-color-light);
}

.login-box {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.login-banner {
  flex: 1;
  background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
}

.small-logo {
  width: 120px;
  margin-bottom: 20px;
}

.banner-content {
  margin-top: auto;
}

.banner-content h1 {
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 16px;
}

.banner-content p {
  font-size: 1.2em;
  opacity: 0.9;
}

.login-form-container {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.form-header {
  margin-bottom: 32px;
  text-align: center;
}

.form-header h2 {
  font-size: 1.8em;
  color: var(--ion-color-dark);
  margin-bottom: 8px;
}

.form-header p {
  color: var(--ion-color-medium);
}

.form-group {
  margin-bottom: 24px;
}

ion-item {
  --background: transparent;
  --border-color: var(--ion-color-medium);
  --border-radius: 8px;
  --border-width: 1px;
  --padding-start: 16px;
  margin-bottom: 16px;
}

ion-item.ion-invalid {
  --border-color: var(--ion-color-danger);
}

.password-toggle {
  cursor: pointer;
  opacity: 0.7;
}

.password-toggle:hover {
  opacity: 1;
}

.login-button {
  --background: var(--ion-color-primary);
  --border-radius: 8px;
  --box-shadow: none;
  margin-top: 24px;
  height: 48px;
  font-size: 1.1em;
}

.additional-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding: 0 8px;
}

.forgot-password,
.create-account {
  color: var(--ion-color-primary);
  text-decoration: none;
  font-size: 0.9em;
  cursor: pointer;
}

.forgot-password:hover,
.create-account:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-box {
    flex-direction: column;
    min-height: auto;
    margin: 16px;
  }

  .login-banner {
    padding: 24px;
    text-align: center;
  }

  .small-logo {
    margin: 0 auto 16px;
  }

  .banner-content {
    margin: 24px 0;
  }

  .banner-content h1 {
    font-size: 1.8em;
  }

  .login-form-container {
    padding: 24px;
  }
}

.button-loading {
  pointer-events: none;
  opacity: 0.8;
}
</style>
