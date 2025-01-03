<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Minha Retrospectiva 2024</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="shareRetrospective">
            <ion-icon :icon="shareOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="retrospective-container">
        <!-- Card Principal -->
        <div class="highlight-card">
          <h1>Seu Ano em Doações</h1>
          <p class="highlight-text">Em 2024, você impactou</p>
          <div class="highlight-number">{{ totalBeneficiaries }}</div>
          <p class="highlight-subtext">vidas com suas doações</p>
        </div>

        <!-- Gráfico de Doações por Mês -->
        <div class="chart-card">
          <h2>Suas Doações ao Longo do Ano</h2>
          <canvas ref="monthlyDonationsChart"></canvas>
        </div>

        <!-- Top Causas -->
        <div class="chart-card">
          <h2>Suas Principais Causas</h2>
          <canvas ref="causesChart"></canvas>
        </div>

        <!-- Estatísticas em Cards -->
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="6">
              <div class="stat-card">
                <ion-icon :icon="trendingUpOutline" color="success"></ion-icon>
                <div class="stat-content">
                  <h3>Maior Doação</h3>
                  <p class="stat-value">R$ {{ biggestDonation }}</p>
                  <p class="stat-detail">{{ biggestDonationProject }}</p>
                </div>
              </div>
            </ion-col>
            <ion-col size="12" size-md="6">
              <div class="stat-card">
                <ion-icon :icon="repeatOutline" color="primary"></ion-icon>
                <div class="stat-content">
                  <h3>Doações Recorrentes</h3>
                  <p class="stat-value">{{ recurringDonations }}</p>
                  <p class="stat-detail">projetos apoiados mensalmente</p>
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- Impacto Social -->
        <div class="impact-section">
          <h2>Seu Impacto Social</h2>
          <div class="impact-grid">
            <div class="impact-item" v-for="impact in impactMetrics" :key="impact.id">
              <ion-icon :icon="impact.icon" :color="impact.color"></ion-icon>
              <div class="impact-number">{{ impact.value }}</div>
              <div class="impact-label">{{ impact.label }}</div>
            </div>
          </div>
        </div>

        <!-- Comparativo com Ano Anterior -->
        <div class="comparison-card">
          <h2>Comparado com 2023</h2>
          <div class="comparison-stats">
            <div class="comparison-item">
              <ion-icon :icon="arrowUpOutline" color="success"></ion-icon>
              <span class="percentage">+{{ donationIncrease }}%</span>
              <p>em doações</p>
            </div>
            <div class="comparison-item">
              <ion-icon :icon="arrowUpOutline" color="success"></ion-icon>
              <span class="percentage">+{{ impactIncrease }}%</span>
              <p>em impacto social</p>
            </div>
          </div>
        </div>

        <!-- Botão de Compartilhar -->
        <ion-button expand="block" class="share-button" @click="shareRetrospective">
          <ion-icon :icon="shareOutline" slot="start"></ion-icon>
          Compartilhar Minha Retrospectiva
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonButton, IonIcon,
  IonGrid, IonRow, IonCol
} from '@ionic/vue';
import {
  shareOutline, trendingUpOutline, repeatOutline,
  arrowUpOutline, bookOutline, heartOutline,
  peopleOutline, schoolOutline
} from 'ionicons/icons';

// Dados mockados
const totalBeneficiaries = ref('1.547');
const biggestDonation = ref('5.000,00');
const biggestDonationProject = ref('Projeto Educação para Todos');
const recurringDonations = ref('3');
const donationIncrease = ref('35');
const impactIncrease = ref('45');

const impactMetrics = ref([
  {
    id: 1,
    icon: schoolOutline,
    value: '250',
    label: 'Crianças na escola',
    color: 'primary'
  },
  {
    id: 2,
    icon: heartOutline,
    value: '120',
    label: 'Atendimentos médicos',
    color: 'danger'
  },
  {
    id: 3,
    icon: peopleOutline,
    value: '450',
    label: 'Famílias assistidas',
    color: 'success'
  },
  {
    id: 4,
    icon: bookOutline,
    value: '800',
    label: 'Livros doados',
    color: 'warning'
  }
]);

// Referências para os gráficos
const monthlyDonationsChart = ref(null);
const causesChart = ref(null);

onMounted(() => {
  // Gráfico de doações mensais
  new Chart(monthlyDonationsChart.value, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      datasets: [{
        label: 'Valor Doado (R$)',
        data: [1000, 1200, 1000, 1500, 1300, 1800, 1600, 2000, 1900, 2200, 2500, 3000],
        borderColor: '#3880ff',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  // Gráfico de causas atualizado
  new Chart(causesChart.value, {
    type: 'doughnut',
    data: {
      labels: ['Educação', 'Saúde', 'Alimentação', 'Esporte', 'Cultura'],
      datasets: [{
        data: [35, 25, 20, 10, 10],
        backgroundColor: [
          '#3880ff',
          '#3dc2ff',
          '#5260ff',
          '#2dd36f',
          '#ffc409'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            boxWidth: 12,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
});

// Função para compartilhar
const shareRetrospective = async () => {
  try {
    await navigator.share({
      title: 'Minha Retrospectiva 2024 - Portal do Doador',
      text: `Em 2024, impactei ${totalBeneficiaries.value} vidas com minhas doações!`,
      url: window.location.href
    });
  } catch (err) {
    console.error('Erro ao compartilhar:', err);
  }
};
</script>

<style scoped>
.retrospective-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.highlight-card {
  background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%);
  color: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 2rem;
}

.highlight-card h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.highlight-text {
  font-size: 1.2rem;
  opacity: 0.9;
}

.highlight-number {
  font-size: 4rem;
  font-weight: bold;
  margin: 1rem 0;
}

.highlight-subtext {
  font-size: 1.2rem;
  opacity: 0.9;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-card h2 {
  margin-bottom: 1.5rem;
  color: var(--ion-color-dark);
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card ion-icon {
  font-size: 2rem;
}

.stat-content h3 {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 1rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: var(--ion-color-dark);
}

.stat-detail {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.impact-section {
  margin: 2rem 0;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.impact-item {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.impact-item ion-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.impact-number {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: var(--ion-color-dark);
}

.impact-label {
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.comparison-card {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  margin: 2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comparison-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.comparison-item {
  text-align: center;
}

.comparison-item ion-icon {
  font-size: 1.5rem;
}

.percentage {
  font-size: 2rem;
  font-weight: bold;
  color: var(--ion-color-success);
  display: block;
  margin: 0.5rem 0;
}

.share-button {
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .highlight-card h1 {
    font-size: 1.5rem;
  }

  .highlight-number {
    font-size: 3rem;
  }

  .comparison-stats {
    flex-direction: column;
    gap: 1rem;
  }
}

.chart-card:nth-child(3) canvas {
  max-height: 300px;
}
</style> 