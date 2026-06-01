import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link to="/" className="text-sm text-primary hover:underline">&larr; Terug naar Fiscaliq</Link>
        <h1 className="font-serif text-3xl mt-6">Privacybeleid</h1>
        <p className="text-sm text-muted-foreground mt-1">Laatst bijgewerkt: 1 juni 2026</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/80">
          <p>Fiscaliq (hierna: "wij") hecht veel waarde aan de bescherming van jouw persoonsgegevens. In dit privacybeleid leggen we uit welke gegevens we verzamelen, waarom we dat doen en wat je rechten zijn.</p>
          <h2 className="font-serif text-lg text-foreground">Welke gegevens verzamelen we?</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Accountgegevens: naam, e-mailadres</li>
            <li>Bedrijfsgegevens: KVK-nummer, BTW-nummer, IBAN</li>
            <li>Transactiegegevens: banktransacties die je importeert of via PSD2 koppelt</li>
            <li>Factuur- en klantgegevens die je invoert in de app</li>
          </ul>
          <h2 className="font-serif text-lg text-foreground">Waarom verzamelen we deze gegevens?</h2>
          <p>Om de boekhoudfunctionaliteit te kunnen bieden: facturen maken, BTW berekenen, transacties matchen, en je financiële overzicht te tonen.</p>
          <h2 className="font-serif text-lg text-foreground">Delen met derden</h2>
          <p>Wij delen geen persoonsgegevens met derden, behalve wanneer dit noodzakelijk is voor de dienstverlening (zoals Supabase voor hosting en Enable Banking voor PSD2-bankkoppelingen) of wanneer wij daartoe wettelijk verplicht zijn.</p>
          <h2 className="font-serif text-lg text-foreground">Bewaartermijn</h2>
          <p>Gegevens worden bewaard zolang je een actief account hebt. Na verwijdering van je account worden alle gegevens binnen 30 dagen vernietigd.</p>
          <h2 className="font-serif text-lg text-foreground">Jouw rechten</h2>
          <p>Je hebt recht op inzage, correctie en verwijdering van je gegevens. Neem hiervoor contact op via marvingoosen1@gmail.com.</p>
          <h2 className="font-serif text-lg text-foreground">Contact</h2>
          <p>Voor vragen over dit privacybeleid kun je contact opnemen via marvingoosen1@gmail.com.</p>
        </div>
      </div>
    </div>
  );
}
