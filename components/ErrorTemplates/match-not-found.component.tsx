import { Fragment } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { ArrowLeft, Link } from "lucide-react";
import { Button } from "../ui/button";

const MatchNotFound = () => {
  return (
    <Fragment>
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Match Not Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-lg text-muted-foreground">
                The match you&apos;re looking for doesn&apos;t exist or has been
                removed.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button asChild variant="outline">
                <Link href="/matches" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to matches
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Fragment>
  );
};
export default MatchNotFound;
