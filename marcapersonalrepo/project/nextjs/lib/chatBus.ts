const EVT = 'rr:open-chat';
export const openChat = () => dispatchEvent(new Event(EVT));
export const onOpenChat = (fn: () => void) => {
  addEventListener(EVT, fn);
  return () => removeEventListener(EVT, fn);
};
