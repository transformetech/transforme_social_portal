<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ media?.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="media-container" v-if="media">
        <!-- Imagem -->
        <img
          v-if="media.type === 'photo'"
          :src="media.url"
          :alt="media.title"
          class="media-content photo"
          @click="toggleZoom"
          :class="{ 'zoomed': isZoomed }"
        >

        <!-- Vídeo do YouTube -->
        <iframe
          v-if="media.type === 'video'"
          class="media-content video"
          :src="media.url"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>

        <div class="media-info">
          <h3>{{ media.title }}</h3>
          <p>{{ media.description }}</p>
          <p class="media-date">{{ media.date }}</p>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { ref } from 'vue';

interface MediaItem {
  type: 'photo' | 'video';
  url: string;
  title: string;
  description?: string;
  date?: string;
}

interface Props {
  isOpen: boolean;
  media: MediaItem;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:isOpen']);

const closeModal = () => {
  emit('update:isOpen', false);
};

const isZoomed = ref(false);

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value;
};
</script>

<style scoped>
.media-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
}

.media-content {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.media-content.photo {
  cursor: zoom-in;
}

.media-content.photo.zoomed {
  transform: scale(1.5);
  cursor: zoom-out;
}

.media-content.video {
  width: 100%;
  aspect-ratio: 16/9;
}

.media-info {
  width: 100%;
  padding: 16px;
  text-align: left;
}

.media-date {
  color: var(--ion-color-medium);
  font-size: 0.9em;
}

@media (min-width: 768px) {
  .media-container {
    max-width: 80%;
  }
}
</style>
