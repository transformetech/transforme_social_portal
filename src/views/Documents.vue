<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Documentos</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openUploadModal">
            <ion-icon :icon="addOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="documents-container">
        <!-- Seção de Upload Rápido -->
        <div class="upload-section">
          <div class="upload-area" @click="openUploadModal" @dragover.prevent @drop="handleDrop">
            <ion-icon :icon="cloudUploadOutline"></ion-icon>
            <h3>Arraste arquivos aqui</h3>
            <p>ou clique para fazer upload</p>
          </div>
        </div>

        <!-- Filtros e Busca -->
        <div class="filters-section">
          <ion-searchbar
            v-model="searchQuery"
            placeholder="Buscar documentos"
            :debounce="500"
          ></ion-searchbar>
          <ion-segment v-model="selectedCategory" class="category-filter">
            <ion-segment-button value="all">Todos</ion-segment-button>
            <ion-segment-button value="receipts">Recibos</ion-segment-button>
            <ion-segment-button value="contracts">Contratos</ion-segment-button>
            <ion-segment-button value="reports">Relatórios</ion-segment-button>
          </ion-segment>
        </div>

        <!-- Lista de Documentos -->
        <div class="documents-grid">
          <ion-card v-for="doc in filteredDocuments" :key="doc.id" class="document-card">
            <div class="document-icon" :class="doc.type">
              <ion-icon :icon="getDocumentIcon(doc.type)"></ion-icon>
            </div>
            <ion-card-content>
              <div class="document-info">
                <h3>{{ doc.name }}</h3>
                <p>{{ doc.date }}</p>
                <span class="document-size">{{ formatFileSize(doc.size) }}</span>
              </div>
              <div class="document-actions">
                <ion-button fill="clear" @click="downloadDocument(doc)">
                  <ion-icon :icon="downloadOutline" slot="icon-only"></ion-icon>
                </ion-button>
                <ion-button fill="clear" @click="shareDocument(doc)">
                  <ion-icon :icon="shareOutline" slot="icon-only"></ion-icon>
                </ion-button>
                <ion-button fill="clear" color="danger" @click="confirmDelete(doc)">
                  <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>

    <!-- Modal de Upload -->
    <ion-modal :is-open="isUploadModalOpen" @didDismiss="isUploadModalOpen = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Novo Documento</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="isUploadModalOpen = false">
              <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="upload-form">
          <ion-list>
            <ion-item>
              <ion-label position="stacked">Tipo de Documento</ion-label>
              <ion-select v-model="newDocument.type" placeholder="Selecione o tipo">
                <ion-select-option value="receipt">Recibo</ion-select-option>
                <ion-select-option value="contract">Contrato</ion-select-option>
                <ion-select-option value="report">Relatório</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Nome do Documento</ion-label>
              <ion-input v-model="newDocument.name" placeholder="Digite um nome"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Descrição</ion-label>
              <ion-textarea
                v-model="newDocument.description"
                placeholder="Digite uma descrição"
                :rows="3"
              ></ion-textarea>
            </ion-item>

            <div class="file-upload-area">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileSelect"
                style="display: none"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
              <ion-button expand="block" @click="selectFile" class="upload-button">
                <ion-icon :icon="documentOutline" slot="start"></ion-icon>
                Selecionar Arquivo
              </ion-button>
              <p v-if="selectedFile" class="selected-file">
                {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
              </p>
            </div>
          </ion-list>

          <ion-button expand="block" @click="uploadDocument" :disabled="!canUpload">
            <ion-icon :icon="cloudUploadOutline" slot="start"></ion-icon>
            Fazer Upload
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Toast de Feedback -->
    <ion-toast
      :is-open="showToast"
      :message="toastMessage"
      :duration="2000"
      :color="toastColor"
      position="top"
      @didDismiss="showToast = false"
    ></ion-toast>

    <!-- Alert de Confirmação -->
    <ion-alert
      :is-open="showDeleteAlert"
      header="Confirmar Exclusão"
      message="Tem certeza que deseja excluir este documento?"
      :buttons="[
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'confirm',
          handler: () => deleteDocument(documentToDelete),
        },
      ]"
      @didDismiss="showDeleteAlert = false"
    ></ion-alert>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton, IonButton, IonIcon,
  IonCard, IonCardContent, IonSearchbar, IonSegment,
  IonSegmentButton, IonModal, IonList, IonItem, IonLabel,
  IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonToast, IonAlert
} from '@ionic/vue';
import {
  addOutline, cloudUploadOutline, documentOutline,
  downloadOutline, shareOutline, trashOutline,
  closeOutline, documentTextOutline, newspaperOutline,
  receiptOutline
} from 'ionicons/icons';

// Estados
const searchQuery = ref('');
const selectedCategory = ref('all');
const isUploadModalOpen = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('success');
const showDeleteAlert = ref(false);
const documentToDelete = ref(null);
const fileInput = ref(null);
const selectedFile = ref(null);

// Novo documento
const newDocument = ref({
  type: '',
  name: '',
  description: '',
});

// Documentos mockados
const documents = ref([
  {
    id: 1,
    name: 'Recibo de Doação - Janeiro 2024',
    type: 'receipt',
    date: '15/01/2024',
    size: 1024576, // 1MB
    url: '#'
  },
  {
    id: 2,
    name: 'Contrato de Doação Regular',
    type: 'contract',
    date: '01/01/2024',
    size: 2048576, // 2MB
    url: '#'
  },
  {
    id: 3,
    name: 'Relatório de Impacto 2023',
    type: 'report',
    date: '31/12/2023',
    size: 5242880, // 5MB
    url: '#'
  },
]);

// Computed Properties
const filteredDocuments = computed(() => {
  let filtered = [...documents.value];
  
  if (searchQuery.value) {
    filtered = filtered.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(doc => 
      doc.type === selectedCategory.value.slice(0, -1)
    );
  }
  
  return filtered;
});

const canUpload = computed(() => {
  return newDocument.value.type && 
         newDocument.value.name && 
         selectedFile.value;
});

// Métodos
const getDocumentIcon = (type) => {
  switch (type) {
    case 'receipt': return receiptOutline;
    case 'contract': return documentTextOutline;
    case 'report': return newspaperOutline;
    default: return documentOutline;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const openUploadModal = () => {
  isUploadModalOpen.value = true;
};

const selectFile = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    if (!newDocument.value.name) {
      newDocument.value.name = file.name.split('.')[0];
    }
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    selectedFile.value = file;
    openUploadModal();
    if (!newDocument.value.name) {
      newDocument.value.name = file.name.split('.')[0];
    }
  }
};

const uploadDocument = async () => {
  try {
    // Aqui você implementaria a lógica real de upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Adiciona o documento à lista (simulação)
    documents.value.unshift({
      id: documents.value.length + 1,
      name: newDocument.value.name,
      type: newDocument.value.type,
      date: new Date().toLocaleDateString('pt-BR'),
      size: selectedFile.value.size,
      url: '#'
    });

    isUploadModalOpen.value = false;
    toastMessage.value = 'Documento enviado com sucesso!';
    toastColor.value = 'success';
    showToast.value = true;

    // Reset form
    newDocument.value = { type: '', name: '', description: '' };
    selectedFile.value = null;
  } catch (error) {
    toastMessage.value = 'Erro ao enviar documento. Tente novamente.';
    toastColor.value = 'danger';
    showToast.value = true;
  }
};

const downloadDocument = (doc) => {
  // Implementar lógica de download
  toastMessage.value = 'Download iniciado';
  toastColor.value = 'success';
  showToast.value = true;
};

const shareDocument = (doc) => {
  // Implementar lógica de compartilhamento
  toastMessage.value = 'Link de compartilhamento copiado';
  toastColor.value = 'success';
  showToast.value = true;
};

const confirmDelete = (doc) => {
  documentToDelete.value = doc;
  showDeleteAlert.value = true;
};

const deleteDocument = (doc) => {
  if (!doc) return;
  
  const index = documents.value.findIndex(d => d.id === doc.id);
  if (index > -1) {
    documents.value.splice(index, 1);
    toastMessage.value = 'Documento excluído com sucesso';
    toastColor.value = 'success';
    showToast.value = true;
  }
};
</script>

<style scoped>
.documents-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.upload-section {
  margin-bottom: 2rem;
}

.upload-area {
  border: 2px dashed var(--ion-color-medium);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: var(--ion-color-primary);
  background: rgba(var(--ion-color-primary-rgb), 0.05);
}

.upload-area ion-icon {
  font-size: 3rem;
  color: var(--ion-color-medium);
}

.upload-area h3 {
  margin: 1rem 0 0.5rem;
  color: var(--ion-color-dark);
}

.upload-area p {
  margin: 0;
  color: var(--ion-color-medium);
}

.filters-section {
  margin-bottom: 2rem;
}

.category-filter {
  margin-top: 1rem;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.document-card {
  margin: 0;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.document-card:hover {
  transform: translateY(-5px);
}

.document-icon {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.document-icon ion-icon {
  font-size: 2rem;
}

.document-icon.receipt { color: var(--ion-color-success); }
.document-icon.contract { color: var(--ion-color-primary); }
.document-icon.report { color: var(--ion-color-warning); }

.document-info {
  flex: 1;
}

.document-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.document-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
}

.document-size {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}

.document-actions {
  display: flex;
  gap: 0.5rem;
}

.upload-form {
  padding: 1rem;
}

.file-upload-area {
  padding: 1rem;
  text-align: center;
}

.upload-button {
  margin: 1rem 0;
}

.selected-file {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--ion-color-medium);
}

@media (max-width: 768px) {
  .documents-grid {
    grid-template-columns: 1fr;
  }
  
  .upload-area {
    padding: 1rem;
  }
}
</style>
