const EVT = 'rr:open-chat';
export const openChat = () => dispatchEvent(new Event(EVT));
export const onOpenChat = (fn: () => void) => {
  addEventListener(EVT, fn);
  return () => removeEventListener(EVT, fn);
};

/** El menú a pantalla completa avisa para que la burbuja del chat se aparte. */
const MENU = 'rr:menu';
export const setMenuOpen = (open: boolean) =>
  dispatchEvent(new CustomEvent(MENU, { detail: open }));
export const onMenuToggle = (fn: (open: boolean) => void) => {
  const h = (e: Event) => fn((e as CustomEvent<boolean>).detail);
  addEventListener(MENU, h);
  return () => removeEventListener(MENU, h);
};
