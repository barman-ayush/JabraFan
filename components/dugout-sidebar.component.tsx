import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Fragment } from "react";
import { dugoutNavigators, navigators } from "@/utils/navigators";
import { NavigatorItemProps } from "@/utils/types";
import Logo from "./Logo.component";

const Navigators = {
  Dugout: dugoutNavigators,
  Navigation: navigators,
};

export function DugoutSidebar() {
  return (
    <Sidebar className="pt-0 md:pt-16">
      <SidebarContent>
        <SidebarHeader className="flex justify-center md:hidden">
          <Logo isSidebar={true} />
        </SidebarHeader>
        {Object.entries(Navigators).map(
          ([key, value], keyValuePairIndex: number) => (
            <Fragment key={keyValuePairIndex}>
              <SidebarGroup>
                <SidebarGroupLabel>{key}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {value.map((item: NavigatorItemProps, index: number) => (
                      <SidebarMenuItem key={`${keyValuePairIndex}${index}`}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </Fragment>
          )
        )}
      </SidebarContent>
    </Sidebar>
  );
}
