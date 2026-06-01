import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link to="/" className="text-sm text-primary hover:underline">&larr; Terug naar Fiscaliq</Link>
        <h1 className="font-serif text-3xl mt-6">Algemene voorwaarden</h1>
        <p className="text-sm text-muted-foreground mt-1">Laatst bijgewerkt: 1 juni 2026</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/80">
          <h2 className="font-serif text-lg text-foreground">1. Algemeen</h2>
          <p>Door gebruik te maken van Fiscaliq ga je akkoord met deze algemene voorwaarden. Fiscaliq is een persoonlijke boekhoudtool voor ZZP'ers en kleine ondernemers in Nederland.</p>
          <h2 className="font-serif text-lg text-foreground">2. Abonnement</h2>
          <p>Fiscaliq kost €7,99 per maand (excl. BTW). Nieuwe gebruikers krijgen de eerste 2 maanden gratis. Opzeggen kan maandelijks. Na opzegging blijft de toegang tot het einde van de betaalde periode.</p>
          <h2 className="font-serif text-lg text-foreground">3. Verantwoordelijkheid</h2>
          <p>Fiscaliq is een hulpmiddel voor je administratie. Je blijft zelf verantwoordelijk voor de juistheid en volledigheid van je boekhouding en belastingaangifte. Wij aanvaarden geen aansprakelijkheid voor financiële gevolgen van het gebruik van de tool.</p>
          <h2 className="font-serif text-lg text-foreground">4. PSD2 bankkoppeling</h2>
          <p>Via PSD2 kunnen transacties van je bankrekening worden uitgelezen. Dit gebeurt read-only en altijd met jouw expliciete toestemming. We slaan nooit wachtwoorden op. De koppeling verloopt via Enable Banking (Finland), een geregistreerde AISP onder toezicht van de FIN-FSA.</p>
          <h2 className="font-serif text-lg text-foreground">5. Data</h2>
          <p>Al jouw data is privé en wordt niet gedeeld met derden. Je kunt te allen tijde je data exporteren of je account laten verwijderen.</p>
          <h2 className="font-serif text-lg text-foreground">6. Wijzigingen</h2>
          <p>Wij behouden het recht om deze voorwaarden te wijzigen. Bij belangrijke wijzigingen ontvang je hierover bericht.</p>
        </div>
      </div>
    </div>
  );
}
