import { createClient } from '@/lib/supabase/server';
import { getInvoiceSettings } from '@/lib/queries/settings.queries';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const settings = await getInvoiceSettings(user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Instellingen</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Standaard factuurinstellingen
          </h2>
          <div className="card max-w-2xl">
            <SettingsForm settings={settings} mode="invoice" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Bedrijfsgegevens
          </h2>
          <div className="card max-w-2xl">
            <p className="text-sm text-neutral-500 mb-4">
              Deze gegevens worden gebruikt op facturen. Vul ze in zodat je facturen
              voldoen aan de Nederlandse factuurvereisten.
            </p>
            <SettingsForm settings={settings} mode="company" />
          </div>
        </section>
      </div>
    </div>
  );
}
