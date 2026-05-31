import { useState, useRef, useCallback } from "react";
import { getTemplatePreview, templateLabels, downloadInvoicePdf, type TemplateName } from "@/lib/invoicePdf";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const templates: TemplateName[] = ["klassiek", "modern", "minimaal"];

export default function PdfTest() {
  const [selected, setSelected] = useState<TemplateName>(
    () => (localStorage.getItem("fiscaliq_invoice_template") as TemplateName) || "klassiek"
  );
  const iframeRefs = useRef<Record<TemplateName, HTMLIFrameElement | null>>({
    klassiek: null,
    modern: null,
    minimaal: null,
  });

  const previews = useRef<Record<TemplateName, string>>({
    klassiek: getTemplatePreview("klassiek"),
    modern: getTemplatePreview("modern"),
    minimaal: getTemplatePreview("minimaal"),
  });

  const choose = (t: TemplateName) => {
    setSelected(t);
    localStorage.setItem("fiscaliq_invoice_template", t);
    toast.success(`Template "${templateLabels[t]}" geselecteerd`);
  };

  const refreshPreview = useCallback((t: TemplateName) => {
    previews.current[t] = getTemplatePreview(t);
    const iframe = iframeRefs.current[t];
    if (iframe) {
      const blob = new Blob([previews.current[t]], { type: "text/html" });
      iframe.src = URL.createObjectURL(blob);
    }
  }, []);

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
        <p className="text-muted-foreground mt-1">Kies het factuurontwerp dat het beste bij je past.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {templates.map(t => {
          const isSelected = selected === t;
          return (
            <div key={t} className={`rounded-2xl border-2 overflow-hidden bg-card transition-all ${
              isSelected ? "border-primary shadow-lg" : "border-border hover:border-primary/40"
            }`}>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg">{templateLabels[t]}</h3>
                  {isSelected && (
                    <span className="text-xs text-primary font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-3 w-3" /> Geselecteerd
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => refreshPreview(t)} title="Verversen">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadDummy(t)} title="Proefdownload">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="bg-[#f3f4f6]">
                <iframe
                  ref={(el) => { iframeRefs.current[t] = el; }}
                  srcDoc={previews.current[t]}
                  className="w-full border-0"
                  style={{ height: "500px", pointerEvents: "none" }}
                  title={`${templateLabels[t]} template preview`}
                />
              </div>

              <div className="p-4 border-t border-border">
                <Button
                  className="w-full"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => choose(t)}
                >
                  {isSelected ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Geselecteerd</> : `Template kiezen`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stat-card text-center py-8">
        <h2 className="font-serif text-xl mb-2">Hoe het werkt</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Kies een template hierboven. Wanneer je een factuur downloadt als PDF,
          wordt automatisch de geselecteerde template gebruikt. Je kunt dit op elk
          moment wijzigen.
        </p>
      </div>
    </div>
  );
}


