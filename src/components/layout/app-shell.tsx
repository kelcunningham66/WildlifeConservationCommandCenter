"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  Binoculars,
  Camera,
  Leaf,
  Menu,
  PawPrint,
  Radio,
  ShieldAlert,
  Trees,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { conservancy } from "@/data/sectors";
import { threatAlerts } from "@/data/threats";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Operations", icon: Activity },
  { href: "/camera-traps", label: "Camera traps", icon: Camera },
  { href: "/populations", label: "Populations", icon: PawPrint },
  { href: "/threats", label: "Threats", icon: ShieldAlert },
  { href: "/habitat", label: "Habitat", icon: Trees },
  { href: "/species", label: "Endangered species", icon: Binoculars },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-1 py-1">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Leaf className="size-4" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-base tracking-tight">RangeWatch</span>
        <span className="mt-0.5 text-[11px] text-muted-foreground">Wildlife intelligence</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openThreats = threatAlerts.filter((t) => t.status !== "resolved").length;

  return (
    <div className="flex min-h-full flex-1 bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-3 md:flex">
        <Brand />
        <div className="mt-5 flex-1">
          <NavLinks />
        </div>
        <div className="rounded-lg border border-sidebar-border bg-card/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{conservancy.name}</p>
          <p className="mt-1">{conservancy.region}</p>
          <p className="mt-2 flex items-center gap-1.5">
            <Radio className="size-3 text-emerald-500" />
            {conservancy.camerasOnline}/{conservancy.camerasTotal} cameras live
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu />
            </Button>
            <Brand />
          </div>
          <p className="hidden text-sm text-muted-foreground md:block">
            Last field sync{" "}
            <span className="text-foreground">
              {new Date(conservancy.lastSync).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="rounded-full border px-2 py-1 text-muted-foreground">
              {conservancy.rangersDeployed} rangers on shift
            </span>
            <Link
              href="/threats"
              className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-1 text-destructive"
            >
              {openThreats} open alerts
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-3">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Brand />
          <div className="mt-4">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
