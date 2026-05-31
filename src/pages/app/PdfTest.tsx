import { useState } from "react";
import TemplateSelector from "@/components/TemplateSelector";
import { getTemplatePreview, type TemplateName } from "@/lib/invoicePdf";
import { toast } from "sonner";

export default function PdfTest() {
  const [selected, setSelected] = useState<TemplateName>(
    () => (localStorage.getItem("fiscaliq_invoice_template") as TemplateName) || "klassiek"
  );

  const choose = (t: TemplateName) => {
    setSelected(t);
    localStorage.setItem("fiscaliq_invoice_template", t);
    toast.success(`Template "${t}" geselecteerd`);
  };

  const downloadDummy = async (t: TemplateName) => {
    const prev = localStorage.getItem("fiscaliq_invoice_template");
    localStorage.setItem("fiscaliq_invoice_template", t);
    const html = getTemplatePreview(t);
    const element = document.createElement("div");
    element.innerHTML = html;
    document.body.appendChild(element);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf().set({
        margin: [0, 0, 0, 0],
        filename: `template-${t}-voorbeeld.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(element).save();
    } finally {
      document.body.removeChild(element);
      if (prev) localStorage.setItem("fiscaliq_invoice_template", prev);
      else localStorage.removeItem("fiscaliq_invoice_template");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="label-eyebrow">Testomgeving</div>
        <h1 className="font-serif text-3xl mt-2">PDF Templates</h1>
        <p className="text-muted-foreground mt-1">Bekijk en vergelijk de beschikbare factuurontwerpen.</p>
      </div>

      <TemplateSelector selected={selected} onSelect={choose} previewHeight={420} />

      <div className="stat-card text-center py-6">
        <h2 className="font-serif text-xl mb-2">Kies een template</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Klik op een template om deze te selecteren. Je keuze wordt opgeslagen en
          gebruikt bij het downloaden van facturen. Je kunt dit ook wijzigen in de
          instellingen.
        </p>
      </div>
    </div>
  );
}
