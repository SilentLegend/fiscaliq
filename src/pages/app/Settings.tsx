import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Settings() {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await supabase.from("profiles").select("*").maybeSingle()).data,
  });
  const [form, setForm] = useState<Record<string, unknown>>({});
  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = async () => {
    const { error } = await supabase.from("profiles").update({
      company_name: form.company_name, kvk_number: form.kvk_number,
      vat_number: form.vat_number, address: form.address,
      postal_code: form.postal_code, city: form.city, iban: form.iban,
    }).eq("id", form.id);
    if (error) return toast.error(error.message);
    toast.success("Bedrijfsgegevens opgeslagen");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <div className="label-eyebrow">Account</div>
        <h1 className="font-serif text-3xl mt-2">Instellingen</h1>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-serif text-xl">Bedrijfsgegevens</h2>
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
        <Field label="IBAN"><Input value={form.iban ?? ""} onChange={e => setForm({ ...form, iban: e.target.value })} /></Field>
        <Button onClick={save}>Opslaan</Button>
      </div>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5"><Label>{label}</Label>{children}</div>
);
