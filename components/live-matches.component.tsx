"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Trophy,
  CheckCircle,
  AlertTriangle,
  Flag,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFlash } from "./Flash.component";

interface Question {
  id: string;
  text: string;
  status: string;
  answer: string | null;
  matchId: string;
}

interface Match {
  id: string;
  team1: string;
  team2: string;
  date: string;
  league: string;
  isCompleted: boolean;
  questions: Question[];
}

export function LiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [confirmEndMatch, setConfirmEndMatch] = useState<Match | null>(null);
  const [isEndingMatch, setIsEndingMatch] = useState<boolean>(false);
  const { flash } = useFlash();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/matches");
      const data = await response.json();
      console.log("[ FETCH_MATCHES ] : " , data);
      
      if (data) {
        setMatches(data || []);
      } else {
        flash("Failed to fetch matches", { variant: "error" });
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      flash("Failed to fetch matches", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndMatch = async (matchId: string) => {
    try {
      setIsEndingMatch(true);
      const response = await fetch(`/api/admin/matches/${matchId}/endmatch`, {
        method: 'GET', // Using GET as per your API design
      });
      
      const data = await response.json();
      
      if (data) {
        flash("Match ended successfully and prizes awarded", { variant: "success" });
        fetchMatches(); // Refresh match list
      } else {
        flash(data.error || "Failed to end match", { variant: "error" });
      }
    } catch (error) {
      console.error("Error ending match:", error);
      flash("Failed to end match", { variant: "error" });
    } finally {
      setIsEndingMatch(false);
      setConfirmEndMatch(null);
    }
  };

  // Filter matches based on status
  const liveMatches = matches.filter(match => {
    const matchDate = new Date(match.date);
    return !match.isCompleted && matchDate <= new Date();
  });

  const completedMatches = matches.filter(match => match.isCompleted);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const renderMatchesTable = (matchList: Match[]) => {
    if (matchList.length === 0) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center text-muted-foreground">
              <AlertTriangle className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
              <p>No matches found</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Match Details</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchList.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{match.league}</div>
                      <div className="text-sm text-muted-foreground">ID: {match.id.substring(0, 10)}...</div>
                      <Badge 
                        variant={match.isCompleted ? "outline" : "default"}
                        className={match.isCompleted ? "bg-muted" : "bg-green-100 text-green-800 hover:bg-green-100"}
                      >
                        {match.isCompleted ? "Completed" : "Live"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium">
                      <span>{match.team1}</span>
                      <span className="text-muted-foreground mx-1">vs</span>
                      <span>{match.team2}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{formatDate(match.date)}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{formatTime(match.date)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {match.questions?.length || 0} Questions
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {match.questions?.filter(q => q.status === "answered").length || 0} answered
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {match.isCompleted ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => window.open(`/matches/${match.id}`, "_blank")}
                      >
                        View Match
                      </Button>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/matches/${match.id}`, "_blank")}
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setConfirmEndMatch(match)}
                        >
                          End Match
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Match Management</h2>
        <Button onClick={fetchMatches} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading matches...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="live">
          <TabsList className="mb-4">
            <TabsTrigger value="live" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Live Matches ({liveMatches.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Completed Matches ({completedMatches.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="live">
            <div className="space-y-4">
              <CardDescription>
                Ongoing matches that can be managed and ended when appropriate.
              </CardDescription>
              {renderMatchesTable(liveMatches)}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="space-y-4">
              <CardDescription>
                Matches that have been completed and prizes awarded.
              </CardDescription>
              {renderMatchesTable(completedMatches)}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Confirmation Dialog for Ending Match */}
      <Dialog open={!!confirmEndMatch} onOpenChange={() => setConfirmEndMatch(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Match</DialogTitle>
            <DialogDescription>
              Are you sure you want to end this match? This will mark the match as complete, 
              calculate final standings, and award prizes to winners. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {confirmEndMatch && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="font-medium">{confirmEndMatch.team1} vs {confirmEndMatch.team2}</p>
              <p className="text-sm text-muted-foreground">{confirmEndMatch.league}</p>
              <div className="flex items-center mt-2">
                <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatDate(confirmEndMatch.date)} at {formatTime(confirmEndMatch.date)}
                </span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmEndMatch(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleEndMatch((confirmEndMatch!).id)}
              disabled={isEndingMatch}
            >
              {isEndingMatch ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Flag className="mr-2 h-4 w-4" />
                  End Match
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}