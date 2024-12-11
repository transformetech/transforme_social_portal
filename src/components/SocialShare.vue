<template>
  <div class="social-share">
    <ion-button fill="clear" @click="openShareModal">
      <ion-icon :icon="shareOutline" slot="icon-only" style="color: #FFF;"></ion-icon>
    </ion-button>

    <!-- Modal de Compartilhamento -->
    <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Compartilhar Doação</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">
              <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <!-- Preview da Postagem -->
        <div class="share-preview">
          <h3>Preview da Postagem</h3>
          <div class="preview-card">
            <img :src="organizationLogo" alt="Logo da Organização" class="org-logo">
            <div class="preview-content">
              <p class="share-text">{{ shareText }}</p>
              <div class="donation-info">
                <span class="project">{{ projectName }}</span>
                <span class="impact">Impactando {{ beneficiariesCount }} vidas</span>
              </div>
              <img :src="previewImage" alt="Imagem do Projeto" class="preview-image">
            </div>
          </div>
        </div>

        <!-- Opções de Redes Sociais -->
        <div class="social-options">
          <ion-button
            v-for="network in socialNetworks"
            :key="network.id"
            :color="network.color"
            expand="block"
            class="share-button"
            @click="shareToNetwork(network.id)"
          >
            <ion-icon :icon="network.icon" slot="start"></ion-icon>
            Compartilhar no {{ network.name }}
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonModal, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButtons, IonButton, IonIcon
} from '@ionic/vue';
import {
  shareOutline, closeOutline,
  logoFacebook, logoTwitter, logoLinkedin,
  logoWhatsapp, logoInstagram
} from 'ionicons/icons';
import { computed } from 'vue';

interface Props {
  donorName: string;
  projectName: string;
  beneficiariesCount: number;
  donationAmount?: string;
  organizationName: string;
  organizationLogo: string;
  previewImage: string;
}

const props = defineProps<Props>();

const isModalOpen = ref(false);
const selectedNetwork = ref('');

const socialNetworks = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: logoFacebook,
    color: 'facebook',
    shareUrl: 'https://www.facebook.com/sharer/sharer.php'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: logoTwitter,
    color: 'twitter',
    shareUrl: 'https://twitter.com/intent/tweet'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: logoLinkedin,
    color: 'linkedin',
    shareUrl: 'https://www.linkedin.com/shareArticle'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: logoWhatsapp,
    color: 'whatsapp',
    shareUrl: 'https://api.whatsapp.com/send'
  },
  {
    id: 'instagram',
    name: 'Instagram Stories',
    icon: logoInstagram,
    color: 'instagram',
    shareUrl: 'instagram-stories://share'
  }
];

const shareText = computed(() => {
  return `Acabei de apoiar o projeto ${props.projectName} da ${props.organizationName}!
          Juntos estamos impactando ${props.beneficiariesCount} vidas.
          Faça parte dessa transformação você também! 🌟`;
});

const openShareModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const shareToNetwork = async (networkId: string) => {
  const network = socialNetworks.find(n => n.id === networkId);
  if (!network) return;

  const shareData = {
    title: `Doação para ${props.organizationName}`,
    text: shareText.value,
    url: window.location.href
  };

  try {
    if (navigator.share && networkId === 'native') {
      await navigator.share(shareData);
    } else {
      const shareUrl = buildShareUrl(network, shareData);
      window.open(shareUrl, '_blank');
    }
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
  }

  closeModal();
};

const buildShareUrl = (network: any, data: any) => {
  switch (network.id) {
    case 'facebook':
      return `${network.shareUrl}?u=${encodeURIComponent(data.url)}`;
    case 'twitter':
      return `${network.shareUrl}?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`;
    case 'linkedin':
      return `${network.shareUrl}?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}`;
    case 'whatsapp':
      return `${network.shareUrl}?text=${encodeURIComponent(data.text + ' ' + data.url)}`;
    default:
      return '';
  }
};
</script>

<style scoped>
.social-share {
  display: inline-block;
}

.share-preview {
  margin-bottom: 2rem;
}

.preview-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.org-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.preview-content {
  font-size: 1.1rem;
  line-height: 1.5;
}

.share-text {
  margin-bottom: 1rem;
}

.donation-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.project {
  font-weight: 600;
  color: var(--ion-color-primary);
}

.impact {
  font-size: 0.9rem;
  color: var(--ion-color-success);
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 1rem;
}

.social-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.share-button {
  --padding-start: 1.5rem;
  --padding-end: 1.5rem;
}

/* Cores personalizadas para redes sociais */
:root {
  --ion-color-facebook: #1877f2;
  --ion-color-twitter: #1da1f2;
  --ion-color-linkedin: #0077b5;
  --ion-color-whatsapp: #25d366;
  --ion-color-instagram: #e4405f;
}

/* Animações */
.preview-card {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
