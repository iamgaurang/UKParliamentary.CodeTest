export interface ToastMessage {
  message: string;
  title?: string;
  delay?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
}
