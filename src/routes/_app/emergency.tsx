import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { useLoad } from "@/lib/use-load";
import { listEmergencyContacts,saveEmergencyContact,deleteEmergencyContact } from "@/lib/server/life";
export const Route=createFileRoute("/_app/emergency")({component:Page});
function Page(){const {data,reload}=useLoad(()=>listEmergencyContacts(),[]);const [name,setName]=useState("");const [relationship,setRelationship]=useState("");const [phone,setPhone]=useState("");const [primary,setPrimary]=useState(false);return <div><PageHeader title="Emergency contacts" back="/profile"/><form className="space-y-2" onSubmit={async e=>{e.preventDefault();await saveEmergencyContact({data:{name,relationship,phone,isPrimary:primary}});setName("");setRelationship("");setPhone("");setPrimary(false);reload();}}><Label>Name</Label><Input required value={name} onChange={e=>setName(e.target.value)}/><Label>Relationship</Label><Input value={relationship} onChange={e=>setRelationship(e.target.value)}/><Label>Phone</Label><Input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)}/><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={primary} onChange={e=>setPrimary(e.target.checked)}/> Primary contact</label><Button className="w-full">Add contact</Button></form><div className="mt-4 space-y-2">{data?.map(c=><Card key={c.id}><p className="font-medium">{c.name} {c.isPrimary?"· Primary":""}</p><p className="text-sm text-muted">{c.relationship} · {c.phone}</p><Button className="mt-2" size="sm" variant="outline" onClick={async()=>{await deleteEmergencyContact({data:c.id});reload();}}>Remove</Button></Card>)}</div></div>}
