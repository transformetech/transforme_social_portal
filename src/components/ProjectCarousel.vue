<template>
  <div class="project-carousel">
    <div class="section-header">
      <h2>
        <ion-icon :icon="heartOutline" color="primary"></ion-icon>
        Outros Projetos e Campanhas
      </h2>
      <ion-button fill="clear" @click="navigateTo('projects')">
        Ver todos
        <ion-icon :icon="arrowForward" slot="end"></ion-icon>
      </ion-button>
    </div>

    <!-- Carrossel para Desktop -->
    <swiper
      :modules="[Autoplay, Pagination, Navigation]"
      :slides-per-view="slidesPerView"
      :space-between="20"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :navigation="true"
      class="project-swiper hide-on-mobile"
    >
      <swiper-slide v-for="project in projects" :key="project.id">
        <div class="project-card" @click="openProjectDetails(project)">
          <div class="project-image">
            <img :src="project.image" :alt="project.title">
            <div class="project-category" :class="project.category">
              {{ project.categoryName }}
            </div>
          </div>
          <div class="project-content">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-stats">
              <div class="stat">
                <ion-icon :icon="peopleOutline"></ion-icon>
                {{ project.beneficiaries }} beneficiados
              </div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${project.progress}%` }"></div>
              </div>
              <div class="goal">
                {{ project.progress }}% da meta
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Carrossel para Mobile -->
    <div class="mobile-carousel show-on-mobile">
      <ion-slides :options="slideOpts">
        <ion-slide v-for="project in projects" :key="project.id">
          <div class="project-card-mobile" @click="openProjectDetails(project)">
            <img :src="project.image" :alt="project.title">
            <div class="project-content">
              <div class="project-category" :class="project.category">
                {{ project.categoryName }}
              </div>
              <h3>{{ project.title }}</h3>
              <div class="project-progress">
                <div class="progress-bar">
                  <div class="progress" :style="{ width: `${project.progress}%` }"></div>
                </div>
                <span>{{ project.progress }}%</span>
              </div>
            </div>
          </div>
        </ion-slide>
      </ion-slides>
    </div>

    <!-- Modal de Detalhes do Projeto -->
    <ion-modal :is-open="showModal" @didDismiss="closeModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ selectedProject?.title }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">
              <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="project-details" v-if="selectedProject">
          <img :src="selectedProject.image" :alt="selectedProject.title" class="detail-image">
          <h2>{{ selectedProject.title }}</h2>
          <div class="category-badge" :class="selectedProject.category">
            {{ selectedProject.categoryName }}
          </div>
          <p class="description">{{ selectedProject.description }}</p>
          <div class="stats-grid">
            <div class="stat-item">
              <ion-icon :icon="peopleOutline"></ion-icon>
              <div class="stat-content">
                <span class="stat-value">{{ selectedProject.beneficiaries }}</span>
                <span class="stat-label">Beneficiados</span>
              </div>
            </div>
            <div class="stat-item">
              <ion-icon :icon="timeOutline"></ion-icon>
              <div class="stat-content">
                <span class="stat-value">{{ selectedProject.duration }}</span>
                <span class="stat-label">Duração</span>
              </div>
            </div>
            <div class="stat-item">
              <ion-icon :icon="walletOutline"></ion-icon>
              <div class="stat-content">
                <span class="stat-value">R$ {{ selectedProject.goal }}</span>
                <span class="stat-label">Meta</span>
              </div>
            </div>
          </div>
          <ion-button expand="block" @click="supportProject(selectedProject)">
            Apoiar este Projeto
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  heartOutline, arrowForward, peopleOutline,
  timeOutline, walletOutline, closeOutline
} from 'ionicons/icons';
import { useResponsive } from '@/composables/useResponsive';

const router = useRouter();
const { isMobile } = useResponsive();

// Estado do componente
const showModal = ref(false);
const selectedProject = ref(null);

// Configurações do Swiper
const slidesPerView = computed(() => {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1200) return 2;
  return 3;
});

// Dados mockados de projetos
const projects = [
  {
    id: 1,
    title: 'Educação para Todos',
    description: 'Projeto focado em levar educação de qualidade para comunidades carentes.',
    image: 'https://source.unsplash.com/random/800x600?education',
    category: 'education',
    categoryName: 'Educação',
    beneficiaries: 150,
    progress: 75,
    duration: '12 meses',
    goal: '50.000'
  },
  {
    id: 2,
    title: 'Saúde Comunitária',
    description: 'Atendimento médico e prevenção de doenças em áreas vulneráveis.',
    image: 'https://source.unsplash.com/random/800x600?health',
    category: 'health',
    categoryName: 'Saúde',
    beneficiaries: 300,
    progress: 60,
    duration: '6 meses',
    goal: '75.000'
  },
  {
    id: 3,
    title: 'Arte e Cultura',
    description: 'Oficinas culturais e artísticas para jovens e adolescentes.',
    image: 'https://source.unsplash.com/random/800x600?art',
    category: 'culture',
    categoryName: 'Cultura',
    beneficiaries: 200,
    progress: 40,
    duration: '8 meses',
    goal: '30.000'
  }
];

// Funções
const openProjectDetails = (project: any) => {
  selectedProject.value = project;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProject.value = null;
};

const supportProject = (project: any) => {
  router.push(`/donate/${project.id}`);
};

const navigateTo = (route: string) => {
  router.push(`/${route}`);
};
</script>

<style scoped lang="scss">
@import '@/styles/responsive.scss';

.project-carousel {
  padding: 2rem;
  background: var(--ion-color-light);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1.4rem;
  }
}

.project-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
}

.project-image {
  position: relative;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.project-category {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);

  &.education {
    color: var(--ion-color-primary);
  }

  &.health {
    color: var(--ion-color-success);
  }

  &.culture {
    color: var(--ion-color-tertiary);
  }
}

.project-content {
  padding: 1.5rem;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }

  p {
    color: var(--ion-color-medium);
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.project-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--ion-color-light);
  border-radius: 3px;
  overflow: hidden;

  .progress {
    height: 100%;
    background: var(--ion-color-primary);
    transition: width 0.3s ease;
  }
}

.goal {
  text-align: right;
  font-size: 0.9rem;
  color: var(--ion-color-dark);
  font-weight: 500;
}

// Mobile Styles
.project-card-mobile {
  width: 280px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
}

// Modal Styles
.project-details {
  .detail-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 1.5rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-weight: 600;
    color: var(--ion-color-dark);
  }

  .stat-label {
    font-size: 0.8rem;
    color: var(--ion-color-medium);
  }
}

@media (max-width: 768px) {
  .project-carousel {
    padding: 1rem;
  }

  .section-header h2 {
    font-size: 1.2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
