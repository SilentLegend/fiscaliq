import { useState, useRef, useCallback } from "react";
import { getTemplatePreview, templateLabels, type TemplateName } from "@/lib/invoicePdf";
import { CheckCircle2, Eye, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

const allTemplates: TemplateName[] = ["klassiek", "modern", "minimaal", "compact", "kleurrijk"];

type Props = {
  selected: TemplateName;
  onSelect: (t: TemplateName) => void;
  previewHeight?: number;
};

export default function TemplateSelector({ selected, onSelect, previewHeight = 400 }: Props) {
  const [fullPreview, setFullPreview] = useState<TemplateName | null>(null);
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});
  const previews = useRef<Record<string, string>>({});

  const getPreview = useCallback((t: TemplateName) => {
    if (!previews.current[t]) {
      previews.current[t] = getTemplatePreview(t);
    }
    return previews.current[t];
  }, []);

  const refresh = (t: TemplateName) => {
    previews.current[t] = getTemplatePreview(t);
    const iframe = iframeRefs.current[t];
    if (iframe) {
      const blob = new Blob([previews.current[t]], { type: "text/html" });
      iframe.src = URL.createObjectURL(blob);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        {allTemplates.map(t => {
          const isSelected = selected === t;
          return (
            <div
              key={t}
              className={`rounded-xl border-2 overflow-hidden bg-card transition-all cursor-pointer ${
                isSelected ? "border-primary shadow-md ring-1 ring-primary/20" : "border-border hover:border-primary/40"
              }`}
              onClick={() => onSelect(t)}
            >
              <div className="p-3 border-b border-border flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{templateLabels[t]}</div>
                  {isSelected && (
                    <span className="text-[10px] text-primary font-medium flex items-center gap-0.5">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Geselecteerd
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={e => { e.stopPropagation(); setFullPreview(t); }}
                    className="p-1.5 rounded hover:bg-muted flex-shrink-0"
                    title="Volledig voorbeeld"
                  >
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); refresh(t); }}
                    className="p-1 rounded hover:bg-muted flex-shrink-0"
                    title="Verversen"
                  >
                    <RefreshCw className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="bg-[#f3f4f6]">
                <iframe
                  ref={el => { iframeRefs.current[t] = el; }}
                  srcDoc={getPreview(t)}
                  className="w-full border-0"
                  style={{ height: previewHeight, pointerEvents: "none" }}
                  title={`${templateLabels[t]} preview`}
                />
              </div>
              <div className="p-3 border-t border-border">
                <Button
                  className="w-full h-8 text-xs"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onSelect(t)}
                >
                  {isSelected ? (
                    <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Geselecteerd</>
                  ) : (
                    `Kiezen`
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={fullPreview !== null} onOpenChange={(o) => { if (!o) setFullPreview(null); }}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 flex flex-col [&>button:last-child]:hidden">
          {fullPreview && (
            <>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
                <div>
                  <h2 className="font-serif text-lg">{templateLabels[fullPreview]}</h2>
                  <p className="text-xs text-muted-foreground">Volledig voorbeeld</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={selected === fullPreview ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      onSelect(fullPreview);
                      setFullPreview(null);
                    }}
                  >
                    {selected === fullPreview ? (
                      <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Geselecteerd</>
                    ) : (
                      <>Gebruiken</>
                    )}
                  </Button>
                  <DialogClose asChild>
                    <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </DialogClose>
                </div>
              </div>
              <div className="flex-1 bg-[#f3f4f6] overflow-hidden">
                <iframe
                  srcDoc={getPreview(fullPreview)}
                  className="w-full h-full border-0"
                  title={`${templateLabels[fullPreview]} full preview`}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
