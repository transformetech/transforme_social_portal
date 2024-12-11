<template>
  <div class="responsive-container" :class="{ 'is-mobile': isMobile }">
    <!-- Header Responsivo -->
    <div class="page-header">
      <h1>{{ title }}</h1>
      <div class="header-actions">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="main-content">
      <slot></slot>
    </div>

    <!-- FAB para Mobile -->
    <ion-fab v-if="isMobile" vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="top">
        <slot name="fab-actions"></slot>
      </ion-fab-list>
    </ion-fab>

    <!-- Bottom Sheet para Mobile -->
    <ion-modal
      :is-open="showBottomSheet"
      :breakpoints="[0, 0.25, 0.5, 0.75]"
      :initial-breakpoint="0.25"
      @didDismiss="closeBottomSheet"
    >
      <ion-content>
        <slot name="bottom-sheet"></slot>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonModal, IonContent } from '@ionic/vue';
import { addOutline } from 'ionicons/icons';

const props = defineProps<{
  title: string;
}>();

const isMobile = ref(window.innerWidth < 768);
const showBottomSheet = ref(false);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const closeBottomSheet = () => {
  showBottomSheet.value = false;
};
</script>

<style scoped>
.responsive-container {
  padding: var(--content-padding, 1rem);
  max-width: var(--content-max-width, 1400px);
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.main-content {
  position: relative;
}

/* Mobile Styles */
.is-mobile .page-header {
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.is-mobile .header-actions {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

/* Animations */
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.bottom-sheet-enter-active {
  animation: slideUp 0.3s ease-out;
}

.bottom-sheet-leave-active {
  animation: slideUp 0.3s ease-out reverse;
}
</style>
