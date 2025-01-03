<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Portal do Doador - transforme.tech</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">
            <ion-icon :icon="logOutOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Header com informações do usuário -->
      <div class="user-header">
        <div class="user-info">
          <ion-avatar @click="navigateTo('profile')">
            <img alt="Avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </ion-avatar>
          <div class="user-details">
            <div class="user-header-row">
              <h2>Olá, {{ userName }}</h2>
              <!-- <SocialShare
                :donor-name="userName"
                :project-name="lastDonationProject"
                :beneficiaries-count="beneficiariesCount"
                :donation-amount="lastDonationAmount"
                :organization-name="organizationName"
                :organization-logo="organizationLogo"
                :preview-image="projectPreviewImage"
              /> -->
            </div>
            <p>Doador desde {{ donorSince }}</p>
          </div>
        </div>
        <div class="donation-summary">
          <div class="summary-card">
            <span class="amount">{{ beneficiariesCount }}</span>
            <span class="label">Pessoas Beneficiadas</span>
          </div>
          <div class="summary-card">
            <span class="amount">{{ totalDonations }}</span>
            <span class="label">Total Doado</span>
          </div>
          <div class="summary-card">
            <span class="amount">{{ donationsCount }}</span>
            <span class="label">Doações Realizadas</span>
          </div>
        </div>
      </div>

      <!-- Cards de Ações Rápidas -->
      <ion-grid class="quick-actions">
        <ion-row>
          <ion-col size="12" size-md="4">
            <ion-card @click="navigateTo('donations')">
              <ion-card-content>
                <ion-icon :icon="walletOutline" class="card-icon"></ion-icon>
                <h3>Minhas Doações</h3>
                <p>Acompanhe suas doações e recibos</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="12" size-md="4">
            <ion-card @click="navigateTo('events')">
              <ion-card-content>
                <ion-icon :icon="calendarOutline" class="card-icon"></ion-icon>
                <h3>Eventos</h3>
                <p>Confira os próximos eventos</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="12" size-md="4">
            <ion-card @click="navigateTo('impact')">
              <ion-card-content>
                <ion-icon :icon="heartOutline" class="card-icon"></ion-icon>
                <h3>Impacto Social</h3>
                <p>Veja o impacto de suas doações</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="12" size-md="4">
            <ion-card @click="navigateTo('documents')">
              <ion-card-content>
                <ion-icon :icon="documentsOutline" class="card-icon"></ion-icon>
                <h3>Documentos</h3>
                <p>Acesse documentos importantes</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="12" size-md="4">
            <ion-card @click="navigateTo('retrospective')">
              <ion-card-content>
                <ion-icon :icon="analyticsOutline" class="card-icon"></ion-icon>
                <h3>Minha Retrospectiva</h3>
                <p>Veja seu impacto em 2024</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Adicione após a seção quick-actions e antes da alerts-section -->
      <div class="featured-projects">
        <div class="section-header">
          <h2>
            <ion-icon :icon="starOutline" color="warning"></ion-icon>
            Projetos em Destaque
          </h2>
          <ion-button fill="clear" @click="navigateTo('impact')">
            Ver todos
            <ion-icon :icon="arrowForward" slot="end"></ion-icon>
          </ion-button>
        </div>

        <swiper
          :modules="[SwiperPagination, SwiperNavigation]"
          :slides-per-view="1.2"
          :space-between="20"
          :pagination="{ clickable: true }"
          :navigation="true"
          :breakpoints="{
            640: {
              slidesPerView: 2.2,
            },
            1024: {
              slidesPerView: 3.2,
            }
          }"
          class="projects-swiper"
        >
          <swiper-slide v-for="project in featuredProjects" :key="project.id">
            <ion-card class="project-card">
              <img :src="project.image" :alt="project.title" loading="lazy" />
              <ion-card-content>
                <div class="project-status">
                  <ion-badge :color="project.status.color">{{ project.status.label }}</ion-badge>
                  <span class="project-progress">{{ project.progress }}%</span>
                </div>
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
                <div class="project-meta">
                  <div class="meta-item">
                    <ion-icon :icon="peopleOutline"></ion-icon>
                    <span>{{ project.beneficiaries }} beneficiados</span>
                  </div>
                  <div class="meta-item">
                    <ion-icon :icon="walletOutline"></ion-icon>
                    <span>{{ project.goal }}</span>
                  </div>
                </div>
                <ion-progress-bar
                  :value="project.progress / 100"
                  :color="project.status.color"
                ></ion-progress-bar>
              </ion-card-content>
            </ion-card>
          </swiper-slide>
        </swiper>
      </div>

      <!-- Seção de Avisos Importantes -->
      <div class="alerts-section">
        <div class="section-header">
          <h2>
            <ion-icon :icon="warningOutline" color="warning"></ion-icon>
            Avisos Importantes
          </h2>
          <ion-button fill="clear" @click="navigateTo('alerts')">Ver todos</ion-button>
        </div>
        <ion-list>
          <ion-item v-for="alert in alerts" :key="alert.id" class="alert-item">
            <ion-icon :icon="alert.icon" slot="start" :color="alert.color"></ion-icon>
            <ion-label>
              <h3>{{ alert.title }}</h3>
              <p>{{ alert.description }}</p>
              <small>{{ alert.date }}</small>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- Galeria de Mídia -->
      <div class="media-gallery">
        <ion-segment v-model="selectedMedia" class="media-tabs">
          <ion-segment-button value="photos">
            <ion-label>Fotos</ion-label>
          </ion-segment-button>
          <ion-segment-button value="videos">
            <ion-label>Vídeos</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div v-if="selectedMedia === 'photos'" class="photos-grid">
          <ion-grid>
            <ion-row>
              <ion-col size="6" size-md="3" v-for="photo in recentPhotos" :key="photo.id">
                <div class="photo-item" @click="openMedia(photo)">
                  <img :src="photo.url" :alt="photo.title" />
                  <div class="photo-overlay">
                    <span>{{ photo.title }}</span>
                  </div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <div v-else class="videos-grid">
          <ion-grid>
            <ion-row>
              <ion-col size="12" size-md="6" v-for="video in recentVideos" :key="video.id">
                <div class="video-item" @click="openMedia(video)">
                  <img :src="video.thumbnail" :alt="video.title" />
                  <div class="video-overlay">
                    <ion-icon :icon="playCircleOutline"></ion-icon>
                    <span>{{ video.title }}</span>
                  </div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>

      <!-- Seção de Notícias -->
      <div class="news-section">
        <div class="section-header">
          <h2>
            <ion-icon :icon="newspaperOutline" color="primary"></ion-icon>
            Últimas Notícias
          </h2>
          <ion-button fill="clear" @click="navigateTo('news')">
            Ver todas
            <ion-icon :icon="arrowForward" slot="end"></ion-icon>
          </ion-button>
        </div>
        <div class="news-grid">
          <ion-grid>
            <ion-row>
              <!-- Notícia Principal -->
              <ion-col size="12" size-md="8">
                <div class="featured-news" @click="navigateTo(`news/${recentNews[0].id}`)">
                  <img :src="recentNews[0].image" :alt="recentNews[0].title" />
                  <div class="featured-news-content">
                    <span class="news-tag">Destaque</span>
                    <h3>{{ recentNews[0].title }}</h3>
                    <p>{{ recentNews[0].summary }}</p>
                    <div class="news-meta">
                      <span class="news-date">
                        <ion-icon :icon="calendarOutline"></ion-icon>
                        {{ recentNews[0].date }}
                      </span>
                      <span class="read-more">Ler mais</span>
                    </div>
                  </div>
                </div>
              </ion-col>
              <!-- Notícias Secundárias -->
              <ion-col size="12" size-md="4">
                <div class="secondary-news-list">
                  <div
                    v-for="news in recentNews.slice(1, 4)"
                    :key="news.id"
                    class="secondary-news-item"
                    @click="navigateTo(`news/${news.id}`)"
                  >
                    <img :src="news.image" :alt="news.title" />
                    <div class="news-content">
                      <h4>{{ news.title }}</h4>
                      <span class="news-date">{{ news.date }}</span>
                    </div>
                  </div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>

      <!-- Seções de Atividades e Eventos -->
      <div class="activities-events-container">
        <ion-grid>
          <ion-row>
            <!-- Atividades Recentes -->
            <ion-col size="12" size-md="6">
              <div class="activities-section">
                <div class="section-header">
                  <h2>
                    <ion-icon :icon="timeOutline" color="success"></ion-icon>
                    Atividades Recentes
                  </h2>
                </div>
                <div class="activities-timeline">
                  <div
                    v-for="activity in recentActivities"
                    :key="activity.id"
                    class="timeline-item"
                  >
                    <div class="timeline-icon">
                      <ion-icon :icon="activity.icon" color="primary"></ion-icon>
                    </div>
                    <div class="timeline-content">
                      <h3>{{ activity.title }}</h3>
                      <p>{{ activity.description }}</p>
                      <span class="timeline-date">{{ activity.date }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ion-col>

            <!-- Próximos Eventos -->
            <ion-col size="12" size-md="6">
              <div class="events-section">
                <div class="section-header">
                  <h2>
                    <ion-icon :icon="calendarOutline" color="tertiary"></ion-icon>
                    Próximos Eventos
                  </h2>
                  <ion-button fill="clear" @click="navigateTo('events')">
                    Ver todos
                    <ion-icon :icon="arrowForward" slot="end"></ion-icon>
                  </ion-button>
                </div>
                <div class="events-list">
                  <div
                    v-for="event in upcomingEvents"
                    :key="event.id"
                    class="event-card"
                    @click="navigateTo(`events/${event.id}`)"
                  >
                    <div class="event-date">
                      <span class="day">{{ formatEventDay(event.date) }}</span>
                      <span class="month">{{ formatEventMonth(event.date) }}</span>
                    </div>
                    <div class="event-details">
                      <h3>{{ event.title }}</h3>
                      <p>{{ event.description }}</p>
                      <div class="event-meta">
                        <span class="event-time">
                          <ion-icon :icon="timeOutline"></ion-icon>
                          {{ '14:00' }}
                        </span>
                        <span class="event-location">
                          <ion-icon :icon="locationOutline"></ion-icon>
                          {{ 'Auditório Principal' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

    </ion-content>

    <!-- Adicione o componente MediaViewer -->
    <MediaViewer
      v-model:isOpen="isMediaModalOpen"
      :media="selectedMedia"
    />
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton, IonButton, IonIcon,
  IonGrid, IonRow, IonCol, IonCard, IonCardContent,
  IonList, IonItem, IonLabel, IonicSlides,
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonAvatar,
  IonSegment, IonSegmentButton
} from '@ionic/vue';
import {
  walletOutline, calendarOutline, heartOutline,
  logOutOutline, ribbonOutline, peopleOutline,
  documentsOutline, warningOutline, newspaperOutline,
  playCircleOutline, imageOutline,
  timeOutline,
  locationOutline,
  arrowForward,
  starOutline,
  analyticsOutline,
} from 'ionicons/icons';
import SocialShare from '@/components/SocialShare.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { homeService } from '@/services/homeService';

const router = useRouter();
const { logout } = useAuth();

// Dados mockados do usuário
const userName = ref('');
const donorSince = ref('');
const totalDonations = ref('');
const donationsCount = ref('');

const loadDonorData = async () => {
  const data = await homeService.getDonorData();

  userName.value = data.pessoa.nome;
  donorSince.value = data.data_de_cadastro;
};

// Configurações do slider
const slideOpts = {
  slidesPerView: 1.2,
  spaceBetween: 20,
  breakpoints: {
    768: {
      slidesPerView: 2.2
    },
    1024: {
      slidesPerView: 3.2
    }
  }
};

// Dados mockados de atividades recentes
const recentActivities = ref([
  {
    id: 1,
    icon: ribbonOutline,
    title: 'Doação Realizada',
    description: 'Doação mensal para o projeto Educação para Todos',
    date: '15/03/2024'
  },
  {
    id: 2,
    icon: peopleOutline,
    title: 'Evento Participado',
    description: 'Encontro de Doadores - Prestação de Contas 2023',
    date: '10/03/2024'
  }
]);

// Dados mockados de eventos futuros
const upcomingEvents = ref([
  {
    id: 1,
    title: 'Prestação de Contas - 1º Trimestre',
    date: '15/04/2024',
    description: 'Apresentação dos resultados e impacto das doações do primeiro trimestre.',
    image: '/assets/img/event1.jpg'
  },
  {
    id: 2,
    title: 'Café com Doadores',
    date: '30/04/2024',
    description: 'Encontro informal para compartilhar experiências e conhecer outros doadores.',
    image: '/assets/img/event2.jpg'
  }
]);


const alerts = ref([
  {
    id: 1,
    title: 'Atualização de Cadastro',
    description: 'Por favor, atualize seus dados cadastrais até 30/04/2024',
    date: '20/03/2024',
    icon: warningOutline,
    color: 'warning'
  },
  // ... mais avisos
]);

// Atualize estes dados mockados com URLs reais
const recentPhotos = ref([
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433',
    title: 'Evento de Natal 2023',
    date: '25/12/2023',
    type: 'photo'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a',
    title: 'Campanha de Doação',
    date: '20/12/2023',
    type: 'photo'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b',
    title: 'Encontro de Doadores',
    date: '15/12/2023',
    type: 'photo'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a',
    title: 'Confraternização Anual',
    date: '10/12/2023',
    type: 'photo'
  }
]);

const recentVideos = ref([
  {
    id: 1,
    thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
    title: 'Retrospectiva 2023',
    url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    type: 'video'
  },
  {
    id: 2,
    thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    title: 'Nossa História',
    url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    type: 'video'
  }
]);

const recentNews = ref([
  {
    id: 1,
    title: 'Novo Projeto Social Iniciado',
    summary: 'Iniciamos um novo projeto de educação infantil que beneficiará mais de 100 crianças...',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
    date: '18/03/2024'
  },
  {
    id: 2,
    title: 'Resultados do Primeiro Trimestre',
    summary: 'Nossas doações impactaram positivamente mais de 500 famílias no primeiro trimestre...',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca',
    date: '15/03/2024'
  },
  {
    id: 3,
    title: 'Parceria com Empresas Locais',
    summary: 'Nova parceria permitirá ampliar nosso alcance em 50% até o final do ano...',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902',
    date: '10/03/2024'
  }
]);

const newsSlideOpts = {
  slidesPerView: 1.2,
  spaceBetween: 20,
  breakpoints: {
    768: {
      slidesPerView: 2.2
    },
    1024: {
      slidesPerView: 3.2
    }
  }
};

const navigateTo = (route: string) => {
  router.push(`/${route}`);
};

// Adicione esta função para abrir o modal de mídia
const isMediaModalOpen = ref(false);
const selectedMedia = ref<any>(null);

const openMedia = (media: any) => {
  selectedMedia.value = media;
  isMediaModalOpen.value = true;
};

// Funções auxiliares para formatação de data
const formatEventDay = (date: string) => {
  return new Date(date).getDate().toString().padStart(2, '0');
};

const formatEventMonth = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
};

// Dados adicionais para compartilhamento
const lastDonationProject = ref('Educação para Todos');
const beneficiariesCount = ref(150);
const lastDonationAmount = ref('R$ 100,00');
const organizationName = ref('ONG Exemplo');
const organizationLogo = ref('https://exemplo.com/logo.png');
const projectPreviewImage = ref('https://exemplo.com/projeto.jpg');

// Adicione os dados mockados dos projetos
const featuredProjects = ref([
  {
    id: 1,
    title: 'Educação para Todos',
    description: 'Projeto de apoio educacional para crianças em situação de vulnerabilidade',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
    status: { label: 'Em andamento', color: 'success' },
    progress: 75,
    beneficiaries: 150,
    goal: 'R$ 50.000,00'
  },
  {
    id: 2,
    title: 'Esporte é Vida',
    description: 'Incentivo ao esporte para jovens da comunidade',
    image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77',
    status: { label: 'Novo', color: 'primary' },
    progress: 30,
    beneficiaries: 80,
    goal: 'R$ 30.000,00'
  },
  {
    id: 3,
    title: 'Saúde para Todos',
    description: 'Atendimento médico gratuito para famílias carentes',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309',
    status: { label: 'Em andamento', color: 'success' },
    progress: 60,
    beneficiaries: 200,
    goal: 'R$ 75.000,00'
  },
  {
    id: 4,
    title: 'Arte e Cultura',
    description: 'Oficinas de arte e cultura para jovens',
    image: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af',
    status: { label: 'Novo', color: 'primary' },
    progress: 25,
    beneficiaries: 120,
    goal: 'R$ 35.000,00'
  },
  {
    id: 5,
    title: 'Alimentação Solidária',
    description: 'Distribuição de alimentos para famílias carentes',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c',
    status: { label: 'Em andamento', color: 'success' },
    progress: 85,
    beneficiaries: 300,
    goal: 'R$ 60.000,00'
  },
  {
    id: 6,
    title: 'Capacitação Profissional',
    description: 'Cursos profissionalizantes para jovens',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
    status: { label: 'Em andamento', color: 'success' },
    progress: 45,
    beneficiaries: 90,
    goal: 'R$ 40.000,00'
  },
  // ... mais projetos ...
]);

// Adicione os módulos do Swiper
const SwiperNavigation = Navigation;
const SwiperPagination = Pagination;

onMounted(() => {
  loadDonorData();
});
</script>

<style scoped>
/* Estilos base */
:root {
  --card-border-radius: 16px;
  --transition-speed: 0.3s;
}

/* Header do usuário */
.user-header {
  background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%);
  color: white;
  padding: 2.5rem;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.user-info ion-avatar {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-details h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.user-details p {
  margin: 4px 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.donation-summary {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.summary-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: var(--card-border-radius);
  flex: 1;
  backdrop-filter: blur(10px);
  transition: transform var(--transition-speed);
}

.summary-card:hover {
  transform: translateY(-5px);
}

.summary-card .amount {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: white;
}

.summary-card .label {
  font-size: 1rem;
  opacity: 0.9;
}

/* Cards de Ações Rápidas */
.quick-actions {
  padding: 1.5rem;
}

.quick-actions ion-card {
  margin: 0;
  border-radius: var(--card-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all var(--transition-speed);
  background: white;
  overflow: hidden;
}

.quick-actions ion-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.quick-actions ion-card-content {
  padding: 1.5rem;
}

.card-icon {
  font-size: 2.5rem;
  color: var(--ion-color-primary);
  margin-bottom: 1.2rem;
  transition: transform var(--transition-speed);
}

.quick-actions ion-card:hover .card-icon {
  transform: scale(1.1);
}

/* Seção de Avisos */
.alerts-section {
  padding: 1.5rem;
  background: var(--ion-color-light);
  margin: 1rem;
  border-radius: var(--card-border-radius);
}

.alert-item {
  --background: white;
  --border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform var(--transition-speed);
}

.alert-item:hover {
  transform: translateX(5px);
}

/* Galeria de Mídia */
.media-gallery {
  padding: 1.5rem;
}

.media-tabs {
  margin-bottom: 1.5rem;
  --background: var(--ion-color-light);
  border-radius: 99px;
  padding: 4px;
}

.photo-item,
.video-item {
  position: relative;
  border-radius: var(--card-border-radius);
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform var(--transition-speed);
}

.photo-item:hover,
.video-item:hover {
  transform: scale(1.03);
}

.photo-item img,
.video-item img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  transition: transform var(--transition-speed);
}

.photo-overlay,
.video-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.video-overlay ion-icon {
  font-size: 3rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.9;
  transition: all var(--transition-speed);
}

.video-item:hover .video-overlay ion-icon {
  transform: translate(-50%, -50%) scale(1.1);
  opacity: 1;
}

/* Seção de Notícias */
.news-section {
  padding: 2rem;
  background: var(--ion-color-light);
}

.featured-news {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  height: 400px;
  transition: transform 0.3s ease;
}

.featured-news:hover {
  transform: translateY(-5px);
}

.featured-news img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-news-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: white;
}

.news-tag {
  background: var(--ion-color-primary);
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 600;
}

.featured-news-content h3 {
  font-size: 1.8rem;
  margin: 1rem 0;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.news-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  opacity: 0.8;
}

.read-more {
  color: var(--ion-color-primary-contrast);
  font-weight: 500;
}

.secondary-news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.secondary-news-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-news-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.secondary-news-item img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.news-content h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: var(--ion-color-dark);
}

/* Atividades e Eventos */
.activities-events-container {
  padding: 2rem;
}

.activities-timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;
  padding-left: 1rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 24px;
  bottom: 0;
  width: 2px;
  background: var(--ion-color-light);
}

.timeline-icon {
  position: absolute;
  left: -2.5rem;
  background: white;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-content {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.timeline-content h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: var(--ion-color-dark);
}

.timeline-date {
  display: block;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  margin-top: 8px;
}

.event-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 8px;
  background: var(--ion-color-primary);
  color: white;
  border-radius: 8px;
  text-align: center;
}

.event-date .day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.event-date .month {
  font-size: 0.8rem;
  text-transform: uppercase;
}

.event-details {
  flex: 1;
}

.event-details h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: var(--ion-color-dark);
}

.event-meta {
  display: flex;
  gap: 1rem;
  margin-top: 8px;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
}

.event-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .featured-news {
    height: 300px;
  }

  .featured-news-content h3 {
    font-size: 1.4rem;
  }

  .activities-events-container {
    padding: 1rem;
  }

  .event-meta {
    flex-direction: column;
    gap: 4px;
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .user-header {
    padding: 1.5rem;
    border-radius: 0 0 16px 16px;
  }

  .donation-summary {
    flex-direction: column;
    gap: 1rem;
  }

  .user-info ion-avatar {
    width: 60px;
    height: 60px;
  }

  .user-details h2 {
    font-size: 1.5rem;
  }

  .photo-item img,
  .video-item img {
    height: 180px;
  }

  .news-card img {
    height: 180px;
  }

  .section-header h2 {
    font-size: 1.2rem;
  }
}

/* Animações */
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

.quick-actions ion-card,
.alert-item,
.photo-item,
.video-item,
.news-card {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Customização do Scroll */
ion-content::part(scroll) {
  scroll-behavior: smooth;
}

/* Efeitos de Hover nos Botões */
ion-button::part(native) {
  transition: all var(--transition-speed);
}

ion-button:hover::part(native) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--ion-color-primary-rgb), 0.3);
}

.user-header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Estilos para a seção de Projetos em Destaque */
.featured-projects {
  padding: 2rem;
  background: var(--ion-color-light);
  margin: 1.5rem;
  border-radius: var(--card-border-radius);
}

.project-card {
  margin: 0;
  border-radius: var(--card-border-radius);
  overflow: hidden;
  transition: transform var(--transition-speed);
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.project-progress {
  font-weight: 600;
  color: var(--ion-color-medium);
}

.project-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0.5rem 0;
  color: var(--ion-color-dark);
}

.project-meta {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  color: var(--ion-color-medium);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.meta-item ion-icon {
  font-size: 1.2rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .featured-projects {
    padding: 1rem;
    margin: 1rem;
  }
}

/* Adicione estes estilos se usar a opção do Slider */
.swiper {
  padding: 1rem;
}

.swiper-slide {
  height: auto;
}

/* Estilos atualizados para o Swiper */
.projects-swiper {
  padding: 1rem 0.5rem 3rem 0.5rem; /* Aumentado padding inferior para acomodar a paginação */
}

:deep(.swiper-pagination) {
  bottom: 0;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: var(--ion-color-primary);
  scale: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--ion-color-primary);
}

/* Ajuste para mobile */
@media (max-width: 768px) {
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}
</style>
