import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { bootstrapAccount, saveProfile } from "@/lib/server/account";
import { CURRENCIES } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export const Route = createFileRoute("/_app/profile")({ component: ProfilePage });
function ProfilePage() {
  const user = useCurrentUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { void bootstrapAccount().then(setProfile); }, []);
  if (!profile) return <div className="skeleton h-64 rounded-[28px]" />;
  return <div>
    <PageHeader title="Profile" subtitle={user?.primaryEmail ?? ""} /><Card className="mb-3"><UserButton /></Card>
    <form className="space-y-3" onSubmit={async (e) => {
      e.preventDefault();
      const next = await saveProfile({ data: { firstName: profile.firstName, lastName: profile.lastName, dateOfBirth: profile.dateOfBirth, country: profile.country, phone: profile.phone, diagnosisNote: profile.diagnosisNote, importantMedicalInfo: profile.importantMedicalInfo, currency: profile.currency, theme: profile.theme, localEmergencyNumber: profile.localEmergencyNumber, photoUrl: profile.photoUrl } });
      setProfile(next); setSaved(true);
    }}>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>First name</Label><Input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} /></div>
        <div><Label>Last name</Label><Input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} /></div>
      </div>
      <div><Label>Date of birth</Label><Input type="date" value={profile.dateOfBirth ?? ""} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })} /></div>
      <div><Label>Country</Label><Input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} /></div>
      <div><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
      <div><Label>Preferred currency</Label><Select value={profile.currency} onChange={(e) => setProfile({ ...profile, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</Select></div>
      <div><Label>Local emergency number (optional)</Label><Input value={profile.localEmergencyNumber} onChange={(e) => setProfile({ ...profile, localEmergencyNumber: e.target.value })} placeholder="If blank, we suggest a country default" /></div>
      <div><Label>Important medical information you want nearby</Label><Textarea value={profile.importantMedicalInfo} onChange={(e) => setProfile({ ...profile, importantMedicalInfo: e.target.value })} placeholder="In your words — allergies, devices, what you want a helper to know. This is not a medical record we interpret." /></div>
      <div><Label>Notes about your diagnosis (optional, your words)</Label><Textarea value={profile.diagnosisNote} onChange={(e) => setProfile({ ...profile, diagnosisNote: e.target.value })} /></div>
      <Button type="submit" className="w-full">{saved ? "Saved" : "Save profile"}</Button>
    </form>
    <div className="mt-4 grid gap-2 pb-4">
      <Link to="/settings" className="rounded-[18px] bg-surface px-4 py-3 text-sm font-medium dark:bg-white/5">Settings, privacy, and notifications</Link>
      <Link to="/emergency" className="rounded-[18px] bg-surface px-4 py-3 text-sm font-medium dark:bg-white/5">Emergency contacts</Link>
      {profile.isAdmin ? <Link to="/admin" className="rounded-[18px] bg-teal-soft px-4 py-3 text-sm font-medium text-teal-deep">Administration</Link> : null}
    </div>
  </div>;
}
