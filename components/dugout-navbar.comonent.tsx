import { Fragment } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Menu } from "lucide-react";
import Logo from "./Logo.component";
const DugoutNavbar = () => {
  return (
    <Fragment>
      <div className="dugout-navbar sticky top-0 z-50 w-full bg-[#121212] border-b border-border shadow-sm p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="trigger-container md:hidden">
              <SidebarTrigger>
                <Menu className="h-8 w-8 text-white hover:text-yellow-400 transition-colors" />
              </SidebarTrigger>
            </div>
            <Logo isSidebar={true} width={50} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DugoutNavbar;
