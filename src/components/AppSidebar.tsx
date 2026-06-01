import { LayoutDashboard, FileText, Users, Receipt, Calculator, Landmark, Settings, LogOut, Map } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, end: true },
  { title: "Facturen", url: "/app/facturen", icon: FileText },
  { title: "Klanten", url: "/app/klanten", icon: Users },
  { title: "Bonnetjes", url: "/app/bonnetjes", icon: Receipt },
  { title: "BTW", url: "/app/btw", icon: Calculator },
  { title: "Bank", url: "/app/bank", icon: Landmark },
  { title: "Roadmap", url: "/app/roadmap", icon: Map },
];

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const loc = useLocation();

  const close = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-5">
        <NavLink to="/app" onClick={close} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-serif text-lg">F</div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-serif text-lg">Fiscaliq</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">werkruimte</div>
            </div>
          )}
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="label-eyebrow">Navigatie</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => {
                const active = it.end ? loc.pathname === it.url : loc.pathname.startsWith(it.url);
                return (
                  <SidebarMenuItem key={it.url}>
                    <SidebarMenuButton asChild className={active ? "bg-primary-soft text-primary font-medium" : ""}>
                      <NavLink to={it.url} end={it.end} onClick={close}>
                        <it.icon className="h-4 w-4" />
                        {!collapsed && <span>{it.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 space-y-1">
        <SidebarMenuButton asChild>
          <NavLink to="/app/instellingen" onClick={close} className={loc.pathname.startsWith("/app/instellingen") ? "bg-primary-soft text-primary" : ""}>
            <Settings className="h-4 w-4" />
            {!collapsed && <span>Instellingen</span>}
          </NavLink>
        </SidebarMenuButton>
        {!collapsed && user && (
          <div className="px-2 pt-2 text-xs text-muted-foreground truncate">{user.email}</div>
        )}
        <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Uitloggen"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
