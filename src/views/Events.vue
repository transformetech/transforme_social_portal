<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Eventos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="events-container">
        <!-- Cabeçalho com Estatísticas -->
        <div class="events-header">
          <ion-grid>
            <ion-row>
              <ion-col size="12" size-md="4">
                <div class="stat-card">
                  <ion-icon :icon="calendarOutline" color="primary"></ion-icon>
                  <div class="stat-content">
                    <h3>{{ upcomingEventsCount }}</h3>
                    <p>Eventos Futuros</p>
                  </div>
                </div>
              </ion-col>
              <ion-col size="12" size-md="4">
                <div class="stat-card">
                  <ion-icon :icon="peopleOutline" color="success"></ion-icon>
                  <div class="stat-content">
                    <h3>{{ participantsCount }}</h3>
                    <p>Participantes</p>
                  </div>
                </div>
              </ion-col>
              <ion-col size="12" size-md="4">
                <div class="stat-card">
                  <ion-icon :icon="checkmarkCircleOutline" color="tertiary"></ion-icon>
                  <div class="stat-content">
                    <h3>{{ completedEventsCount }}</h3>
                    <p>Eventos Realizados</p>
                  </div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <!-- Calendário e Lista de Eventos -->
        <div class="calendar-events-container">
          <ion-grid>
            <ion-row>
              <!-- Calendário -->
              <ion-col size="12" size-md="7">
                <div class="calendar-container">
                  <div class="calendar-header">
                    <h2>Calendário de Eventos</h2>
                    <div class="calendar-nav">
                      <ion-button fill="clear" @click="previousMonth">
                        <ion-icon :icon="chevronBackOutline"></ion-icon>
                      </ion-button>
                      <span class="current-month">{{ currentMonthYear }}</span>
                      <ion-button fill="clear" @click="nextMonth">
                        <ion-icon :icon="chevronForwardOutline"></ion-icon>
                      </ion-button>
                    </div>
                  </div>

                  <!-- Dias da Semana -->
                  <div class="calendar-weekdays">
                    <div v-for="day in weekDays" :key="day">{{ day }}</div>
                  </div>

                  <!-- Dias do Mês -->
                  <div class="calendar-days">
                    <div
                      v-for="day in calendarDays"
                      :key="day.date"
                      class="calendar-day"
                      :class="{
                        'other-month': !day.isCurrentMonth,
                        'has-event': day.hasEvent,
                        'selected': isSelectedDate(day.date)
                      }"
                      @click="selectDate(day)"
                    >
                      <span class="day-number">{{ day.dayNumber }}</span>
                      <div v-if="day.hasEvent" class="event-indicator"></div>
                    </div>
                  </div>
                </div>
              </ion-col>

              <!-- Lista de Eventos -->
              <ion-col size="12" size-md="5">
                <div class="events-list">
                  <h2>
                    {{ selectedDate ? formatDate(selectedDate) : 'Próximos Eventos' }}
                  </h2>
                  <ion-list>
                    <ion-item
                      v-for="event in filteredEvents"
                      :key="event.id"
                      button
                      @click="showEventDetails(event)"
                      class="event-item"
                    >
                      <div class="event-time">
                        <span class="time">{{ formatTime(event.startTime) }}</span>
                        <div class="duration">{{ event.duration }}</div>
                      </div>
                      <ion-label>
                        <h3>{{ event.title }}</h3>
                        <p>{{ event.description }}</p>
                        <div class="event-meta">
                          <span class="location">
                            <ion-icon :icon="locationOutline"></ion-icon>
                            {{ event.location }}
                          </span>
                          <span class="participants">
                            <ion-icon :icon="peopleOutline"></ion-icon>
                            {{ event.participants }} participantes
                          </span>
                        </div>
                      </ion-label>
                    </ion-item>
                  </ion-list>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>

      <!-- Modal de Detalhes do Evento -->
      <ion-modal :is-open="showModal" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Detalhes do Evento</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">
                <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding" v-if="selectedEvent">
          <div class="event-details">
            <img :src="selectedEvent.image" :alt="selectedEvent.title" class="event-image">
            <h2>{{ selectedEvent.title }}</h2>
            <div class="event-info">
              <p class="date-time">
                <ion-icon :icon="calendarOutline"></ion-icon>
                {{ formatDate(selectedEvent.date) }} às {{ formatTime(selectedEvent.startTime) }}
              </p>
              <p class="location">
                <ion-icon :icon="locationOutline"></ion-icon>
                {{ selectedEvent.location }}
              </p>
              <p class="participants">
                <ion-icon :icon="peopleOutline"></ion-icon>
                {{ selectedEvent.participants }} participantes
              </p>
            </div>
            <div class="event-description">
              <h3>Sobre o Evento</h3>
              <p>{{ selectedEvent.description }}</p>
            </div>
            <ion-button expand="block" @click="registerForEvent">
              Confirmar Presença
            </ion-button>
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
  IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel,
  IonModal
} from '@ionic/vue';
import {
  calendarOutline, peopleOutline, checkmarkCircleOutline,
  chevronBackOutline, chevronForwardOutline, locationOutline,
  closeOutline
} from 'ionicons/icons';

// Dados mockados
const upcomingEventsCount = ref(8);
const participantsCount = ref(245);
const completedEventsCount = ref(12);

// Estado do calendário
const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(null);
const showModal = ref(false);
const selectedEvent = ref<any>(null);

// Dados dos eventos (mock)
const events = ref([
  {
    id: 1,
    title: 'Prestação de Contas - 1º Trimestre',
    description: 'Apresentação dos resultados e impacto das doações do primeiro trimestre.',
    date: '2024-04-15',
    startTime: '14:00',
    duration: '2h',
    location: 'Auditório Principal',
    participants: 50,
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093'
  },
  {
    id: 2,
    title: 'Café com Doadores',
    description: 'Encontro informal para compartilhar experiências e conhecer outros doadores.',
    date: '2024-04-30',
    startTime: '09:00',
    duration: '1h30',
    location: 'Espaço Café',
    participants: 30,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205'
  },
  // Adicione mais eventos conforme necessário
]);

// Funções do calendário
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Dias do mês anterior
  const firstDayWeekday = firstDay.getDay();
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({
      date: date.toISOString().split('T')[0],
      dayNumber: date.getDate(),
      isCurrentMonth: false,
      hasEvent: hasEventOnDate(date)
    });
  }

  // Dias do mês atual
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date: date.toISOString().split('T')[0],
      dayNumber: i,
      isCurrentMonth: true,
      hasEvent: hasEventOnDate(date)
    });
  }

  // Dias do próximo mês
  const remainingDays = 42 - days.length; // 6 semanas x 7 dias
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date: date.toISOString().split('T')[0],
      dayNumber: i,
      isCurrentMonth: false,
      hasEvent: hasEventOnDate(date)
    });
  }

  return days;
});

const filteredEvents = computed(() => {
  if (!selectedDate.value) {
    return events.value;
  }
  const dateStr = selectedDate.value.toISOString().split('T')[0];
  return events.value.filter(event => event.date === dateStr);
});

// Funções auxiliares
const hasEventOnDate = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0];
  return events.value.some(event => event.date === dateStr);
};

const formatDate = (date: string | Date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (time: string) => {
  return time;
};

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const selectDate = (day: any) => {
  selectedDate.value = new Date(day.date);
};

const isSelectedDate = (date: string) => {
  if (!selectedDate.value) return false;
  return date === selectedDate.value.toISOString().split('T')[0];
};

const showEventDetails = (event: any) => {
  selectedEvent.value = event;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedEvent.value = null;
};

const registerForEvent = () => {
  // Implementar lógica de registro no evento
  console.log('Registrado no evento:', selectedEvent.value);
  closeModal();
};
</script>

<style scoped>
.events-container {
  padding: 1rem;
}

.events-header {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card ion-icon {
  font-size: 2rem;
}

.stat-content h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-content p {
  margin: 0;
  color: var(--ion-color-medium);
}

.calendar-container {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-month {
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: capitalize;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  color: var(--ion-color-medium);
  margin-bottom: 0.5rem;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.calendar-day:hover {
  background: var(--ion-color-light);
}

.calendar-day.other-month {
  color: var(--ion-color-medium);
  opacity: 0.5;
}

.calendar-day.has-event {
  font-weight: 600;
}

.calendar-day.selected {
  background: var(--ion-color-primary);
  color: white;
}

.event-indicator {
  width: 6px;
  height: 6px;
  background: var(--ion-color-primary);
  border-radius: 50%;
  position: absolute;
  bottom: 4px;
}

.events-list {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.event-item {
  --padding-start: 1rem;
  --padding-end: 1rem;
  --padding-top: 1rem;
  --padding-bottom: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
}

.event-time {
  margin-right: 1rem;
  text-align: center;
  min-width: 80px;
}

.event-time .time {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.event-time .duration {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
}

.event-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
}

.event-meta ion-icon {
  margin-right: 4px;
  vertical-align: middle;
}

.event-details {
  max-width: 600px;
  margin: 0 auto;
}

.event-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 1rem;
}

.event-info {
  margin: 1rem 0;
}

.event-info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  color: var(--ion-color-medium);
}

.event-description {
  margin: 1.5rem 0;
}

@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 1rem;
  }

  .calendar-container,
  .events-list {
    margin-bottom: 1rem;
  }
}
</style>
