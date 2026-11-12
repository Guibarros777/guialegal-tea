/**
 * Copia texto para a área de transferência.
 * Tenta a Clipboard API e, se indisponível/negada (ex.: página sem HTTPS,
 * permissão negada), usa um fallback com textarea + execCommand.
 * Retorna true somente se a cópia realmente funcionou.
 */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // segue para o fallback
  }

  try {
    const el = document.createElement('textarea');
    el.value = texto;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.top = '-1000px';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
