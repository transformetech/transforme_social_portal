<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Impacto Social</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Header com Métricas Principais -->
      <div class="impact-header">
        <h1>Seu Impacto na Comunidade</h1>
        <p class="impact-subtitle">Veja como suas doações estão transformando vidas</p>

        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="4">
              <div class="metric-card">
                <div class="metric-icon">
                  <ion-icon :icon="peopleOutline" color="primary"></ion-icon>
                </div>
                <div class="metric-content">
                  <h3>{{ metrics.peopleHelped }}</h3>
                  <p>Pessoas Beneficiadas</p>
                </div>
                <div class="metric-trend positive">
                  <ion-icon :icon="trendingUpOutline"></ion-icon>
                  +{{ metrics.growthRate }}% este mês
                </div>
              </div>
            </ion-col>

            <ion-col size="12" size-md="4">
              <div class="metric-card">
                <div class="metric-icon">
                  <ion-icon :icon="schoolOutline" color="success"></ion-icon>
                </div>
                <div class="metric-content">
                  <h3>{{ metrics.projectsSupported }}</h3>
                  <p>Projetos Apoiados</p>
                </div>
                <div class="metric-projects">
                  <ion-progress-bar
                    :value="metrics.projectProgress"
                    color="success"
                  ></ion-progress-bar>
                  <span>{{ Math.round(metrics.projectProgress * 100) }}% da meta anual</span>
                </div>
              </div>
            </ion-col>

            <ion-col size="12" size-md="4">
              <div class="metric-card">
                <div class="metric-icon">
                  <ion-icon :icon="locationOutline" color="tertiary"></ion-icon>
                </div>
                <div class="metric-content">
                  <h3>{{ metrics.communitiesReached }}</h3>
                  <p>Comunidades Alcançadas</p>
                </div>
                <div class="metric-map">
                  <small>Em {{ metrics.citiesCount }} cidades</small>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <!-- Seção de Projetos em Destaque -->
      <div class="featured-projects">
        <div class="section-header">
          <h2>Projetos em Destaque</h2>
          <div class="project-filters">
            <ion-segment v-model="selectedCategory">
              <ion-segment-button value="all">Todos</ion-segment-button>
              <ion-segment-button value="education">Educação</ion-segment-button>
              <ion-segment-button value="health">Saúde</ion-segment-button>
              <ion-segment-button value="culture">Cultura</ion-segment-button>
            </ion-segment>
          </div>
        </div>

        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="6" v-for="project in filteredProjects" :key="project.id">
              <div class="project-card">
                <div class="project-image">
                  <img :src="project.image" :alt="project.title" />
                  <div class="project-category" :class="project.category">
                    {{ getCategoryLabel(project.category) }}
                  </div>
                </div>
                <div class="project-content">
                  <h3>{{ project.title }}</h3>
                  <p>{{ project.description }}</p>
                  <div class="project-progress">
                    <div class="progress-info">
                      <span>Meta: R$ {{ project.goal }}</span>
                      <span>{{ Math.round(project.progress * 100) }}%</span>
                    </div>
                    <ion-progress-bar
                      :value="project.progress"
                      :color="getProgressColor(project.progress)"
                    ></ion-progress-bar>
                  </div>
                  <div class="project-stats">
                    <div class="stat">
                      <ion-icon :icon="peopleOutline"></ion-icon>
                      <span>{{ project.beneficiaries }} beneficiados</span>
                    </div>
                    <div class="stat">
                      <ion-icon :icon="timeOutline"></ion-icon>
                      <span>{{ project.duration }}</span>
                    </div>
                  </div>
                  <ion-button expand="block" @click="showProjectDetails(project)">
                    Ver Detalhes
                  </ion-button>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <!-- Seção de Depoimentos -->
      <div class="testimonials">
        <h2>Histórias de Impacto</h2>
        <ion-slides :options="slideOpts" class="testimonial-slides">
          <ion-slide v-for="testimonial in testimonials" :key="testimonial.id">
            <div class="testimonial-card">
              <div class="testimonial-image">
                <img :src="testimonial.image" :alt="testimonial.name" />
              </div>
              <div class="testimonial-content">
                <p class="testimonial-text">"{{ testimonial.text }}"</p>
                <h4>{{ testimonial.name }}</h4>
                <p class="testimonial-role">{{ testimonial.role }}</p>
              </div>
            </div>
          </ion-slide>
        </ion-slides>
      </div>

      <!-- Modal de Detalhes do Projeto -->
      <ion-modal :is-open="showModal" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Detalhes do Projeto</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">
                <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding" v-if="selectedProject">
          <div class="project-details">
            <img :src="selectedProject.image" :alt="selectedProject.title" class="project-detail-image">
            <h2>{{ selectedProject.title }}</h2>
            <div class="project-detail-content">
              <p>{{ selectedProject.description }}</p>
              <div class="project-detail-stats">
                <div class="detail-stat">
                  <ion-icon :icon="peopleOutline"></ion-icon>
                  <div>
                    <h4>Beneficiários</h4>
                    <p>{{ selectedProject.beneficiaries }} pessoas</p>
                  </div>
                </div>
                <div class="detail-stat">
                  <ion-icon :icon="timeOutline"></ion-icon>
                  <div>
                    <h4>Duração</h4>
                    <p>{{ selectedProject.duration }}</p>
                  </div>
                </div>
                <div class="detail-stat">
                  <ion-icon :icon="walletOutline"></ion-icon>
                  <div>
                    <h4>Meta</h4>
                    <p>R$ {{ selectedProject.goal }}</p>
                  </div>
                </div>
              </div>
              <ion-button expand="block" @click="supportProject">
                Apoiar este Projeto
              </ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton, IonButton, IonIcon,
  IonGrid, IonRow, IonCol, IonProgressBar,
  IonSegment, IonSegmentButton, IonicSlides,
  IonModal
} from '@ionic/vue';
import {
  peopleOutline, schoolOutline, locationOutline,
  trendingUpOutline, timeOutline, walletOutline,
  closeOutline
} from 'ionicons/icons';

// Métricas mockadas
const metrics = ref({
  peopleHelped: '1.234',
  growthRate: 15,
  projectsSupported: 8,
  projectProgress: 0.75,
  communitiesReached: 12,
  citiesCount: 5
});

// Estado do componente
const selectedCategory = ref('all');
const showModal = ref(false);
const selectedProject = ref(null);

// Configurações do slider
const slideOpts = {
  slidesPerView: 1,
  spaceBetween: 20,
  breakpoints: {
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 3
    }
  }
};

// Dados mockados dos projetos
const projects = ref([
  {
    id: 1,
    title: 'Educação para Todos',
    description: 'Projeto focado em levar educação de qualidade para comunidades carentes.',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
    goal: '50.000',
    progress: 0.8,
    beneficiaries: 150,
    duration: '12 meses'
  },
  // Adicione mais projetos...
]);

// Depoimentos mockados
const testimonials = ref([
  {
    id: 1,
    name: 'Maria Silva',
    role: 'Beneficiária do Projeto Educação',
    text: 'Graças ao projeto, meus filhos têm acesso a uma educação de qualidade.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
  },
  // Adicione mais depoimentos...
]);

// Computed properties
const filteredProjects = computed(() => {
  if (selectedCategory.value === 'all') return projects.value;
  return projects.value.filter(project => project.category === selectedCategory.value);
});

// Funções auxiliares
const getCategoryLabel = (category: string) => {
  const labels = {
    education: 'Educação',
    health: 'Saúde',
    culture: 'Cultura'
  };
  return labels[category] || category;
};

const getProgressColor = (progress: number) => {
  if (progress >= 0.8) return 'success';
  if (progress >= 0.5) return 'warning';
  return 'danger';
};

const showProjectDetails = (project: any) => {
  selectedProject.value = project;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProject.value = null;
};

const supportProject = () => {
  // Implementar lógica de apoio ao projeto
  console.log('Apoiando projeto:', selectedProject.value);
  closeModal();
};
</script>

<style scoped>
.impact-header {
  background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.impact-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.impact-subtitle {
  opacity: 0.9;
  margin-bottom: 2rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 16px;
  height: 100%;
}

.metric-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.metric-content h3 {
  font-size: 2rem;
  margin: 0;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.metric-trend.positive {
  color: var(--ion-color-success);
}

.metric-projects,
.metric-map {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.featured-projects {
  padding: 2rem;
}

.section-header {
  margin-bottom: 2rem;
}

.project-filters {
  margin: 1rem 0;
}

.project-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.project-image {
  position: relative;
  height: 200px;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

.project-content {
  padding: 1.5rem;
}

.project-progress {
  margin: 1rem 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.project-stats {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
}

.testimonials {
  padding: 2rem;
  background: var(--ion-color-light);
}

.testimonial-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin: 1rem;
  text-align: center;
}

.testimonial-image img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.testimonial-text {
  font-style: italic;
  margin: 1rem 0;
}

.project-detail-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 16px;
}

.project-detail-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.detail-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .metric-card {
    margin-bottom: 1rem;
  }

  .project-detail-stats {
    grid-template-columns: 1fr;
  }
}
</style>
