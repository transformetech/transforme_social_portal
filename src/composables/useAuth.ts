import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();
  const isAuthenticated = ref(!!localStorage.getItem('token'));
  const token = ref(localStorage.getItem('token'));

  const form = ref({
    username: '',
    password: ''
  });

  const validation = ref({
    usernameError: '',
    passwordError: ''
  });

  const isLoading = ref(false);
  const showPassword = ref(false);
  const showToast = ref(false);
  const toastMessage = ref('');

  // Função para formatar CPF
  const formatCPF = (cpf: string): string => {
    const cleaned = cpf.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
    if (!match) return cleaned;

    const formatted = !match[2]
      ? match[1]
      : !match[3]
      ? `${match[1]}.${match[2]}`
      : !match[4]
      ? `${match[1]}.${match[2]}.${match[3]}`
      : `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;

    return formatted;
  };

  // Função para validar CPF
  const isValidCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

    return true;
  };

  // Watch para formatar CPF enquanto digita
  watch(() => form.value.username, (newValue) => {
    form.value.username = formatCPF(newValue);
  });

  const validateUsername = () => {
    const cpf = form.value.username.replace(/\D/g, '');
    if (cpf.length === 0) {
      validation.value.usernameError = 'CPF é obrigatório';
    } else if (cpf.length !== 11) {
      validation.value.usernameError = 'CPF deve ter 11 dígitos';
    } else if (!isValidCPF(cpf)) {
      validation.value.usernameError = 'CPF inválido';
    } else {
      validation.value.usernameError = '';
    }
  };

  const validatePassword = () => {
    validation.value.passwordError = form.value.password.length < 6
      ? 'Senha deve ter pelo menos 6 caracteres'
      : '';
  };

  const handleLogin = async () => {
    try {
      isLoading.value = true;

      // Simula uma chamada API com delay de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Credenciais fake para teste (CPF válido para teste: 529.982.247-25)
      const fakeCPF = '52998224725';
      const fakePassword = '123456';

      if (form.value.username.replace(/\D/g, '') === fakeCPF && form.value.password === fakePassword) {
        const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake';
        localStorage.setItem('token', fakeToken);
        token.value = fakeToken;
        isAuthenticated.value = true;

        // Forçar redirecionamento para home
        router.replace('/home');
      } else {
        showToast.value = true;
        toastMessage.value = 'CPF ou senha inválidos';
      }
    } catch (error) {
      console.error('Erro no login:', error);
      showToast.value = true;
      toastMessage.value = 'Erro ao fazer login. Tente novamente.';
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    token.value = null;
    isAuthenticated.value = false;
    router.push('/login');
  };

  return {
    form,
    validation,
    isLoading,
    showPassword,
    isAuthenticated,
    showToast,
    toastMessage,
    validateUsername,
    validatePassword,
    handleLogin,
    logout,
    token
  };
}
