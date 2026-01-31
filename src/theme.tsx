import { createTheme } from '@mui/material/styles';
import { arSD, enUS } from '@mui/material/locale';

/**
 * Returns a Material‑UI theme configured for the specified colour mode
 * ("light" or "dark") and direction ("ltr" or "rtl").  The Cairo font is
 * used throughout to mirror the original template.  Locale settings are
 * applied so that components such as date pickers render correctly in the
 * chosen language direction.
 */
export function getTheme(
  mode: 'light' | 'dark',
  direction: 'ltr' | 'rtl',
) {
  const locale = direction === 'rtl' ? arSD : enUS;
  return createTheme(
    {
      direction,
      palette: {
        mode,
      },
      typography: {
        fontFamily: 'Cairo, sans-serif',
      },
    },
    locale,
  );
}