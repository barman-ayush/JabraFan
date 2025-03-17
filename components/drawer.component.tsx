/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import * as React from "react";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { useDrawerContext } from "@/context/DrawerContext";
import { DrawerContentWithParams } from "./DrawerContent.component";


export function DrawerComponent() {
  const { isOpen, setIsOpen } = useDrawerContext();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <Suspense fallback={
          <div className="mx-auto w-full max-w-sm p-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <DrawerContentWithParams />
        </Suspense>
      </DrawerContent>
    </Drawer>
  );
}
