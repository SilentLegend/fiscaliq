import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Auth() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(params.get("mode") === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const nav = useNavigate();

  useEffect(() => { if (session) nav("/app", { replace: true }); }, [session, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (error) throw error;
        toast.success("Account aangemaakt — je bent ingelogd");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary-foreground text-primary grid place-items-center font-serif text-lg">F</div>
          <div className="font-serif text-lg">Fiscaliq</div>
        </Link>
        <div>
          <h1 className="font-serif text-4xl leading-tight">Boekhouden zonder chaos.</h1>
          <p className="mt-4 text-primary-foreground/80 max-w-md">Een rustige werkruimte voor je facturen, BTW en bankafschriften.</p>
        </div>
        <div className="text-sm text-primary-foreground/60">© {new Date().getFullYear()} Fiscaliq</div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-serif text-lg">F</div>
            <span className="font-serif text-lg">Fiscaliq</span>
          </Link>
          <h2 className="font-serif text-3xl">{mode === "signup" ? "Maak je account" : "Welkom terug"}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {mode === "signup" ? "14 dagen gratis, geen creditcard nodig." : "Log in om verder te gaan."}
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Bezig…" : mode === "signup" ? "Account aanmaken" : "Inloggen"}
            </Button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">
            {mode === "signup" ? "Al een account?" : "Nog geen account?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="text-primary font-medium hover:underline">
              {mode === "signup" ? "Inloggen" : "Registreren"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
