<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Minhas Doações</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Cards de Resumo Financeiro -->
      <div class="financial-summary">
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="4">
              <ion-card class="summary-card">
                <ion-card-content>
                  <div class="card-header">
                    <ion-icon :icon="walletOutline" color="primary"></ion-icon>
                    <h3>Total Doado</h3>
                  </div>
                  <div class="amount">R$ {{ totalDonated }}</div>
                  <div class="trend positive">
                    <ion-icon :icon="trendingUpOutline"></ion-icon>
                    +15% este mês
                  </div>
                </ion-card-content>
              </ion-card>
            </ion-col>

            <ion-col size="12" size-md="4">
              <ion-card class="summary-card">
                <ion-card-content>
                  <div class="card-header">
                    <ion-icon :icon="repeatOutline" color="success"></ion-icon>
                    <h3>Doação Recorrente</h3>
                  </div>
                  <div class="amount">R$ {{ monthlyDonation }}/mês</div>
                  <div class="status active">Ativa</div>
                </ion-card-content>
              </ion-card>
            </ion-col>

            <ion-col size="12" size-md="4">
              <ion-card class="summary-card">
                <ion-card-content>
                  <div class="card-header">
                    <ion-icon :icon="documentTextOutline" color="tertiary"></ion-icon>
                    <h3>Recibos Disponíveis</h3>
                  </div>
                  <div class="amount">{{ availableReceipts }}</div>
                  <ion-button fill="clear" size="small">Baixar todos</ion-button>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <!-- Filtros e Pesquisa -->
      <div class="filters-section">
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="6">
              <ion-item>
                <ion-label position="stacked">Período</ion-label>
                <ion-select v-model="selectedPeriod" interface="popover">
                  <ion-select-option value="30">Últimos 30 dias</ion-select-option>
                  <ion-select-option value="90">Últimos 3 meses</ion-select-option>
                  <ion-select-option value="180">Últimos 6 meses</ion-select-option>
                  <ion-select-option value="365">Último ano</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-col>
            <ion-col size="12" size-md="6">
              <ion-item>
                <ion-label position="stacked">Status</ion-label>
                <ion-select v-model="selectedStatus" interface="popover">
                  <ion-select-option value="all">Todos</ion-select-option>
                  <ion-select-option value="completed">Concluídas</ion-select-option>
                  <ion-select-option value="pending">Pendentes</ion-select-option>
                  <ion-select-option value="failed">Falhas</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <!-- Lista de Doações -->
      <div class="donations-list">
        <ion-list>
          <ion-item v-for="donation in filteredDonations" :key="donation.id" class="donation-item">
            <ion-label>
              <h2>{{ donation.description }}</h2>
              <p>{{ donation.date }}</p>
              <p class="donation-details">
                <ion-badge :color="getStatusColor(donation.status)">
                  {{ donation.status }}
                </ion-badge>
                <span class="donation-amount">R$ {{ donation.amount }}</span>
              </p>
            </ion-label>
            <ion-button slot="end" fill="clear" @click="downloadReceipt(donation.id)">
              <ion-icon :icon="downloadOutline" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-item>
        </ion-list>

        <!-- Paginação -->
        <div class="pagination">
          <ion-button fill="clear" :disabled="currentPage === 1" @click="prevPage">
            <ion-icon :icon="chevronBackOutline" slot="icon-only"></ion-icon>
          </ion-button>
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <ion-button fill="clear" :disabled="currentPage === totalPages" @click="nextPage">
            <ion-icon :icon="chevronForwardOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton, IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonIcon, IonButton, IonList,
  IonItem, IonLabel, IonBadge, IonSelect, IonSelectOption
} from '@ionic/vue';
import {
  walletOutline, repeatOutline, documentTextOutline,
  trendingUpOutline, downloadOutline, chevronBackOutline,
  chevronForwardOutline
} from 'ionicons/icons';

// Dados mockados
const totalDonated = ref('5.000,00');
const monthlyDonation = ref('100,00');
const availableReceipts = ref(12);
const selectedPeriod = ref('30');
const selectedStatus = ref('all');
const currentPage = ref(1);
const totalPages = ref(5);

// Lista mockada de doações
const donations = ref([
  {
    id: 1,
    description: 'Doação Mensal - Projeto Educação',
    date: '15/03/2024',
    amount: '100,00',
    status: 'Concluída'
  },
  {
    id: 2,
    description: 'Doação Extra - Campanha de Natal',
    date: '10/03/2024',
    amount: '250,00',
    status: 'Concluída'
  },
  {
    id: 3,
    description: 'Doação Mensal - Projeto Educação',
    date: '15/02/2024',
    amount: '100,00',
    status: 'Concluída'
  },
  // Adicione mais doações conforme necessário
]);

// Computed para filtrar doações
const filteredDonations = computed(() => {
  return donations.value.filter(donation => {
    if (selectedStatus.value === 'all') return true;
    return donation.status.toLowerCase() === selectedStatus.value;
  });
});

// Funções de utilidade
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'concluída':
      return 'success';
    case 'pendente':
      return 'warning';
    case 'falha':
      return 'danger';
    default:
      return 'medium';
  }
};

const downloadReceipt = (id: number) => {
  console.log(`Baixando recibo da doação ${id}`);
  // Implementar lógica de download
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script>

<style scoped>
.financial-summary {
  padding: 16px;
  background: var(--ion-color-light);
}

.summary-card {
  margin: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.card-header ion-icon {
  font-size: 24px;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--ion-color-medium);
}

.amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--ion-color-dark);
  margin-bottom: 8px;
}

.trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
}

.trend.positive {
  color: var(--ion-color-success);
}

.status {
  font-size: 0.9rem;
  color: var(--ion-color-success);
}

.filters-section {
  padding: 16px;
  background: white;
}

.donation-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
}

.donation-details {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.donation-amount {
  font-weight: bold;
  color: var(--ion-color-dark);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 16px;
}

@media (max-width: 768px) {
  .financial-summary ion-card {
    margin-bottom: 16px;
  }
}
</style>
