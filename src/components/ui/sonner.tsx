'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

/** Site-wide Sonner host — used by `toast` imports from `sonner`. */
export function SonnerToaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-center"
      richColors
      closeButton
      dir="auto"
      toastOptions={{
        classNames: {
          toast: 'font-sans text-sm',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          zIndex: 99999,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
