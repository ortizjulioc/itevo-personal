import { pdf } from "@react-pdf/renderer";

export async function printPDFDirect(component: JSX.Element, options?: { cleanUpMilliseconds?: number }) {
  const blob = await pdf(component).toBlob();
  const blobUrl = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = blobUrl;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    const cleanup = () => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(blobUrl);
      }
    };

    window.addEventListener("afterprint", cleanup, { once: true });

    setTimeout(cleanup, options?.cleanUpMilliseconds ?? 3000);
  };
}
