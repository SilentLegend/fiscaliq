import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getClients } from '@/lib/queries/clients.queries';

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const clients = await getClients(user.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Klanten</h1>
        <Link href="/clients/new" className="btn-primary">
          Nieuwe klant
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="card text-center py-12">
          <svg
            className="mx-auto w-12 h-12 text-neutral-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-neutral-700 mb-2">
            Nog geen klanten
          </h2>
          <p className="text-neutral-500 mb-6">
            Voeg je eerste klant toe om facturen te kunnen maken.
          </p>
          <Link href="/clients/new" className="btn-primary">
            Eerste klant toevoegen
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="table-header" scope="col">Naam</th>
                  <th className="table-header hidden sm:table-cell" scope="col">E-mail</th>
                  <th className="table-header hidden md:table-cell" scope="col">Plaats</th>
                  <th className="table-header hidden md:table-cell" scope="col">KVK</th>
                  <th className="table-header" scope="col">
                    <span className="sr-only">Acties</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="table-cell font-medium">{client.name}</td>
                    <td className="table-cell hidden sm:table-cell text-neutral-500">
                      {client.email || '-'}
                    </td>
                    <td className="table-cell hidden md:table-cell text-neutral-500">
                      {client.city || '-'}
                    </td>
                    <td className="table-cell hidden md:table-cell text-neutral-500">
                      {client.kvk_number || '-'}
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        href={`/clients/${client.id}`}
                        className="btn-ghost text-sm"
                      >
                        Bewerken
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
