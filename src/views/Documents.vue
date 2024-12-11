<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Documentos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Barra de Pesquisa e Filtros -->
      <div class="search-filters">
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Buscar documentos..."
          @ionInput="filterDocuments"
        ></ion-searchbar>
        <div class="filter-buttons">
          <ion-chip
            v-for="category in categories"
            :key="category.id"
            :color="selectedCategory === category.id ? 'primary' : 'medium'"
            @click="selectCategory(category.id)"
            :outline="selectedCategory !== category.id"
          >
            <ion-icon :icon="category.icon"></ion-icon>
            <ion-label>{{ category.name }}</ion-label>
          </ion-chip>
        </div>
      </div>

      <!-- Grid de Documentos -->
      <div class="documents-grid">
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="6" size-lg="4" v-for="doc in filteredDocuments" :key="doc.id">
              <div class="document-card" :class="{ 'new': doc.isNew }">
                <div class="document-icon" :class="doc.type">
                  <ion-icon :icon="getDocumentIcon(doc.type)"></ion-icon>
                </div>
                <div class="document-info">
                  <h3>{{ doc.title }}</h3>
                  <p>{{ doc.description }}</p>
                  <div class="document-meta">
                    <span class="document-date">
                      <ion-icon :icon="calendarOutline"></ion-icon>
                      {{ doc.date }}
                    </span>
                    <span class="document-size">
                      <ion-icon :icon="documentOutline"></ion-icon>
                      {{ doc.size }}
                    </span>
                  </div>
                  <div class="document-actions">
                    <ion-button fill="clear" @click="previewDocument(doc)">
                      <ion-icon slot="start" :icon="eyeOutline"></ion-icon>
                      Visualizar
                    </ion-button>
                    <ion-button fill="clear" @click="downloadDocument(doc)">
                      <ion-icon slot="start" :icon="downloadOutline"></ion-icon>
                      Baixar
                    </ion-button>
                  </div>
                </div>
                <div v-if="doc.isNew" class="new-badge">Novo</div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <!-- Modal de Visualização -->
      <ion-modal :is-open="showPreview" @didDismiss="closePreview">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ selectedDocument?.title }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closePreview">
                <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div class="preview-container" v-if="selectedDocument">
            <iframe
              v-if="selectedDocument.previewUrl"
              :src="selectedDocument.previewUrl"
              frameborder="0"
              class="document-preview"
            ></iframe>
            <div v-else class="preview-fallback">
              <ion-icon :icon="documentTextOutline"></ion-icon>
              <p>Visualização não disponível</p>
              <ion-button @click="downloadDocument(selectedDocument)">
                Baixar Documento
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
  IonGrid, IonRow, IonCol, IonSearchbar, IonChip,
  IonLabel, IonModal
} from '@ionic/vue';
import {
  documentOutline, downloadOutline, eyeOutline,
  calendarOutline, closeOutline, documentTextOutline,
  receiptOutline, newspaperOutline, createOutline
} from 'ionicons/icons';

// Categorias de documentos
const categories = [
  { id: 'all', name: 'Todos', icon: documentOutline },
  { id: 'receipts', name: 'Recibos', icon: receiptOutline },
  { id: 'reports', name: 'Relatórios', icon: newspaperOutline },
  { id: 'certificates', name: 'Certificados', icon: createOutline }
];

// Estado do componente
const searchQuery = ref('');
const selectedCategory = ref('all');
const showPreview = ref(false);
const selectedDocument = ref<any>(null);

// Dados mockados de documentos
const documents = ref([
  {
    id: 1,
    title: 'Recibo de Doação - Janeiro 2024',
    description: 'Comprovante de doação mensal',
    type: 'receipt',
    date: '31/01/2024',
    size: '156 KB',
    category: 'receipts',
    isNew: true,
    previewUrl: 'https://docs.google.com/document/d/e/2PACX-sample/pub?embedded=true'
  },
  {
    id: 2,
    title: 'Relatório de Impacto 2023',
    description: 'Relatório anual de impacto social',
    type: 'report',
    date: '15/01/2024',
    size: '2.4 MB',
    category: 'reports',
    isNew: false,
    previewUrl: 'https://docs.google.com/document/d/e/2PACX-sample/pub?embedded=true'
  },
  {
    id: 3,
    title: 'Certificado de Doador 2023',
    description: 'Certificado de reconhecimento',
    type: 'certificate',
    date: '31/12/2023',
    size: '789 KB',
    category: 'certificates',
    isNew: false,
    previewUrl: null
  }
]);

// Computed properties
const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'all' || doc.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

// Funções auxiliares
const getDocumentIcon = (type: string) => {
  const icons = {
    receipt: receiptOutline,
    report: newspaperOutline,
    certificate: createOutline
  };
  return icons[type] || documentOutline;
};

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId;
};

const filterDocuments = (event: any) => {
  searchQuery.value = event.target.value;
};

const previewDocument = (doc: any) => {
  selectedDocument.value = doc;
  showPreview.value = true;
};

const closePreview = () => {
  showPreview.value = false;
  selectedDocument.value = null;
};

const downloadDocument = (doc: any) => {
  // Implementar lógica de download
  console.log('Baixando documento:', doc.title);
};
</script>

<style scoped>
.search-filters {
  padding: 1rem;
  background: var(--ion-color-light);
  position: sticky;
  top: 0;
  z-index: 100;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.documents-grid {
  padding: 1rem;
}

.document-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
  position: relative;
  transition: all 0.3s ease;
}

.document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.document-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.document-icon.receipt {
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  color: var(--ion-color-primary);
}

.document-icon.report {
  background: rgba(var(--ion-color-success-rgb), 0.1);
  color: var(--ion-color-success);
}

.document-icon.certificate {
  background: rgba(var(--ion-color-warning-rgb), 0.1);
  color: var(--ion-color-warning);
}

.document-info {
  flex: 1;
}

.document-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--ion-color-dark);
}

.document-info p {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.document-meta {
  display: flex;
  gap: 1rem;
  margin: 0.8rem 0;
  font-size: 0.85rem;
  color: var(--ion-color-medium);
}

.document-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.document-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.new-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--ion-color-success);
  color: white;
  padding: 4px 8px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 500;
}

.preview-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.document-preview {
  width: 100%;
  height: 100%;
  border: none;
}

.preview-fallback {
  text-align: center;
  padding: 2rem;
}

.preview-fallback ion-icon {
  font-size: 4rem;
  color: var(--ion-color-medium);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .document-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .document-meta {
    justify-content: center;
  }

  .document-actions {
    justify-content: center;
  }
}
</style>
