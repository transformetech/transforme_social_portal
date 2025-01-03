<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Meu Perfil</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="saveProfile" :disabled="!isFormChanged">
            <ion-icon :icon="saveOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="profile-container">
        <!-- Avatar Section -->
        <div class="avatar-section">
          <ion-avatar class="profile-avatar" @click="selectImage">
            <img :src="userData.avatar" alt="Avatar" />
            <div class="avatar-overlay">
              <ion-icon :icon="cameraOutline"></ion-icon>
            </div>
          </ion-avatar>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="onImageSelected"
          />
        </div>

        <!-- Form Section -->
        <div class="form-section">
          <ion-list>
            <ion-item>
              <ion-label position="stacked">Nome Completo</ion-label>
              <ion-input
                v-model="userData.name"
                type="text"
                placeholder="Digite seu nome completo"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">E-mail</ion-label>
              <ion-input
                v-model="userData.email"
                type="email"
                placeholder="Digite seu e-mail"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Telefone</ion-label>
              <ion-input
                v-model="userData.phone"
                type="tel"
                placeholder="(00) 00000-0000"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">CPF</ion-label>
              <ion-input
                v-model="userData.cpf"
                type="text"
                placeholder="000.000.000-00"
                disabled
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Data de Nascimento</ion-label>
              <ion-input
                v-model="userData.birthDate"
                type="date"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Endereço</ion-label>
              <ion-input
                v-model="userData.address"
                type="text"
                placeholder="Digite seu endereço"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Cidade</ion-label>
              <ion-input
                v-model="userData.city"
                type="text"
                placeholder="Digite sua cidade"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Estado</ion-label>
              <ion-select v-model="userData.state" placeholder="Selecione o estado">
                <ion-select-option value="SP">São Paulo</ion-select-option>
                <ion-select-option value="RJ">Rio de Janeiro</ion-select-option>
                <!-- Adicione mais estados conforme necessário -->
              </ion-select>
            </ion-item>
          </ion-list>

          <!-- Preferências de Notificação -->
          <div class="preferences-section">
            <h3>Preferências de Notificação</h3>
            <ion-list>
              <ion-item>
                <ion-label>Notificações por E-mail</ion-label>
                <ion-toggle v-model="userData.emailNotifications"></ion-toggle>
              </ion-item>
              <ion-item>
                <ion-label>Notificações por WhatsApp</ion-label>
                <ion-toggle v-model="userData.whatsappNotifications"></ion-toggle>
              </ion-item>
            </ion-list>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonInput, IonSelect,
  IonSelectOption, IonToggle, IonAvatar, IonToast
} from '@ionic/vue';
import {
  saveOutline, cameraOutline
} from 'ionicons/icons';

const fileInput = ref(null);
const originalUserData = {
  avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '(11) 98765-4321',
  cpf: '123.456.789-00',
  birthDate: '1990-01-01',
  address: 'Rua Exemplo, 123',
  city: 'São Paulo',
  state: 'SP',
  emailNotifications: true,
  whatsappNotifications: true
};

const userData = ref({ ...originalUserData });

const isFormChanged = computed(() => {
  return JSON.stringify(userData.value) !== JSON.stringify(originalUserData);
});

const selectImage = () => {
  fileInput.value.click();
};

const onImageSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      userData.value.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('success');

const saveProfile = async () => {
  try {
    // Aqui você implementaria a lógica para salvar no backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulando uma requisição
    
    toastMessage.value = 'Perfil atualizado com sucesso!';
    toastColor.value = 'success';
    showToast.value = true;
  } catch (error) {
    toastMessage.value = 'Erro ao atualizar perfil. Tente novamente.';
    toastColor.value = 'danger';
    showToast.value = true;
  }
};
</script>

<style scoped>
.profile-container {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  position: relative;
  cursor: pointer;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-overlay ion-icon {
  font-size: 2rem;
  color: white;
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --background: transparent;
}

ion-input, ion-select {
  --padding-start: 0;
  margin-top: 4px;
}

.preferences-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--ion-color-light);
}

.preferences-section h3 {
  color: var(--ion-color-medium);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
}
</style> 