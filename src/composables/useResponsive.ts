import { ref, onMounted, onUnmounted } from 'vue';

export function useResponsive() {
  const isMobile = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(false);

  const checkViewport = () => {
    const width = window.innerWidth;
    isMobile.value = width < 768;
    isTablet.value = width >= 768 && width < 992;
    isDesktop.value = width >= 992;
  };

  onMounted(() => {
    checkViewport();
    window.addEventListener('resize', checkViewport);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkViewport);
  });

  return {
    isMobile,
    isTablet,
    isDesktop
  };
}
