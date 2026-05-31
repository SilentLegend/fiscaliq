import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Moon, Bell, Building2, Palette, Phone, Globe, Mail } from "lucide-react";

export default function Settings() {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await supabase.from("profiles").select("*").maybeSingle()).data,
  });
  const [form, setForm] = useState<Record<string, unknown>>({});
  useEffect(() => { if (data) setForm(data); }, [data]);

  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fiscaliq_notifications") ?? "{}"); }
    catch { return {}; }
  });

  const toggleDark = (on: boolean) => {
    document.documentElement.classList.toggle("dark", on);
    localStorage.setItem("fiscaliq_theme", on ? "dark" : "light");
    setDarkMode(on);
  };

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleNotify = (key: string, on: boolean) => {
    const next = { ...notifications, [key]: on };
    setNotifications(next);
    localStorage.setItem("fiscaliq_notifications", JSON.stringify(next));
  };

  const save = async () => {
    const { error } = await supabase.from("profiles").update({
      company_name: form.company_name, kvk_number: form.kvk_number,
      vat_number: form.vat_number, address: form.address,
      postal_code: form.postal_code, city: form.city, iban: form.iban,
      phone: form.phone, website: form.website,
      default_vat_rate: form.default_vat_rate ?? 21,
      payment_terms: form.payment_terms ?? 14,
      invoice_footer: form.invoice_footer,
    }).eq("id", form.id);
    if (error) return toast.error(error.message);
    toast.success("Bedrijfsgegevens opgeslagen");
  };

  return (
    <div className="space-y-10">
      <div>
        <div className="label-eyebrow">Account</div>
        <h1 className="font-serif text-3xl mt-2">Instellingen</h1>
        <p className="text-muted-foreground mt-1">Beheer je voorkeuren en bedrijfsgegevens.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Section icon={Palette} title="Weergave" description="Pas de look & feel van de app aan">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Moon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label>Donker thema</Label>
                <p className="text-sm text-muted-foreground">Schakel tussen licht en donker</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDark} />
          </div>
        </Section>

        <Section icon={Bell} title="Notificaties" description="Kies waar je meldingen van wilt ontvangen">
          <div className="divide-y divide-border -mx-6">
            <NotifyRow label="Nieuwe factuur" description="Melding bij verzonden facturen" checked={notifications.invoice_received ?? false} onToggle={v => toggleNotify("invoice_received", v)} />
            <NotifyRow label="Factuur herinnering" description="Herinnering bij vervallen facturen" checked={notifications.invoice_reminder ?? false} onToggle={v => toggleNotify("invoice_reminder", v)} />
            <NotifyRow label="Bank transacties" description="Melding bij nieuwe transacties" checked={notifications.bank_transaction ?? false} onToggle={v => toggleNotify("bank_transaction", v)} />
            <NotifyRow label="Maandelijks rapport" description="Maandoverzicht omzet & uitgaven" checked={notifications.monthly_report ?? false} onToggle={v => toggleNotify("monthly_report", v)} />
          </div>
        </Section>
      </div>

      <Section icon={Building2} title="Bedrijfsgegevens" description="Deze gegevens worden gebruikt op facturen">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field label="Bedrijfsnaam"><Input value={form.company_name ?? ""} onChange={e => setForm({ ...form, company_name: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="KVK"><Input value={form.kvk_number ?? ""} onChange={e => setForm({ ...form, kvk_number: e.target.value })} /></Field>
              <Field label="BTW-nummer"><Input value={form.vat_number ?? ""} onChange={e => setForm({ ...form, vat_number: e.target.value })} /></Field>
            </div>
            <Field label="Adres"><Input value={form.address ?? ""} onChange={e => setForm({ ...form, address: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Postcode"><Input value={form.postal_code ?? ""} onChange={e => setForm({ ...form, postal_code: e.target.value })} /></Field>
              <Field label="Plaats"><Input value={form.city ?? ""} onChange={e => setForm({ ...form, city: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Telefoon"><Input value={form.phone ?? ""} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
              <Field label="Website"><Input value={form.website ?? ""} onChange={e => setForm({ ...form, website: e.target.value })} /></Field>
            </div>
            <Field label="E-mail"><Input value={form.email ?? ""} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
          </div>
          <div className="space-y-4">
            <Field label="IBAN"><Input value={form.iban ?? ""} onChange={e => setForm({ ...form, iban: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Standaard BTW">
                <Select value={String(form.default_vat_rate ?? 21)} onValueChange={v => setForm({ ...form, default_vat_rate: parseFloat(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="9">9%</SelectItem>
                    <SelectItem value="21">21%</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Betalingscondities (dgn)">
                <Input type="number" min={0} max={90} value={form.payment_terms ?? 14} onChange={e => setForm({ ...form, payment_terms: parseInt(e.target.value) || 14 })} />
              </Field>
            </div>
            <Field label="Factuur voettekst">
              <Textarea rows={3} value={form.invoice_footer ?? ""} onChange={e => setForm({ ...form, invoice_footer: e.target.value })} placeholder="Bijv. betaling binnen 14 dagen, vermeld factuurnummer…" />
            </Field>
            <Button onClick={save}>Opslaan</Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5"><Label>{label}</Label>{children}</div>
);

const NotifyRow = ({ label, description, checked, onToggle }: { label: string; description: string; checked: boolean; onToggle: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-3 px-6">
    <div className="pr-4">
      <Label>{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onToggle} />
  </div>
);

const Section = ({ icon: Icon, title, description, children }: { icon: React.ElementType; title: string; description: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card overflow-hidden">
    <div className="p-6 pb-0">
      <div className="flex items-center gap-3 mb-1">
        <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-lg">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-6 pt-5">{children}</div>
  </div>
);
