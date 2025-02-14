import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LImage from "./Image.component";

export function LeaderCard() {
    
  return (
    <Card className="w-[350px]" style={{boxShadow: "rgba(250 ,204  ,21, 0.5) 1.95px 1.95px 2.6px"}}>
      <CardHeader className="text-center">
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row flex-wrap gap-6">
        <LImage
          rank="2"
        classes="mt-4"
        isFirst={false}
        height="80px"
        width="80px"
        src="https://i2.cdn.turner.com/cnnnext/dam/assets/140926165711-john-sutter-profile-image-large-169.jpg"
        />
        <LImage
        rank="1"
        classes="mb-4"
        isFirst={true}
        height="80px"
        width="80px"
        src="https://i2.cdn.turner.com/cnnnext/dam/assets/140926165711-john-sutter-profile-image-large-169.jpg"
        />
        <LImage
        rank="3"
        classes="mt-4"
        isFirst={false}
        height="80px"
        width="80px"
        src="https://i2.cdn.turner.com/cnnnext/dam/assets/140926165711-john-sutter-profile-image-large-169.jpg"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}
