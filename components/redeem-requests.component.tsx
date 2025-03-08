"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { RedeemRequest } from "@/utils/types";
// import { redeemRequestsData } from "@/data/redeem-requests"

export function RedeemRequests() {
  const [requests, setRequests] = useState<RedeemRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  React.useEffect(() => {
    async function fetchRedeemRequests() {
      try {
        const response = await fetch("/api/admin/redeemRequest");

        if (!response.ok) {
          throw new Error("Failed to fetch redeem requests");
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching redeem requests", error);
      }
    }

    fetchRedeemRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      // Call the API to approve the request
      const response = await fetch("/api/admin/redeemRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          status: "approved",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      // Only update the local state if the API call was successful
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id === requestId) {
            return {
              ...req,
              status: "approved",
              processedAt: new Date().toISOString(),
            };
          }
          return req;
        })
      );
    } catch (error) {
      console.error("Failed to approve request:", error);
      alert(
        `Failed to approve request: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleReject = async () => {
    if (selectedRequest) {
      try {
        // Call the API to reject the request
        const response = await fetch("/api/admin/redeemRequest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId: selectedRequest,
            status: "rejected",
            rejectionReason: rejectReason,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        // Only update the local state if the API call was successful
        setRequests((prev) =>
          prev.map((req) => {
            if (req.id === selectedRequest) {
              return {
                ...req,
                status: "rejected",
                processedAt: new Date().toISOString(),
                rejectionReason: rejectReason,
              };
            }
            return req;
          })
        );
        setSelectedRequest(null);
        setRejectReason("");
      } catch (error) {
        console.error("Failed to reject request:", error);
        alert(
          `Failed to reject request: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };

  const openRejectDialog = (requestId: string) => {
    setSelectedRequest(requestId);
    setRejectReason("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="">
        <CardHeader>
          <CardTitle>Redeem Requests</CardTitle>
          <CardDescription>
            Manage user requests to redeem their rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{request.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {request.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>${request.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{request.paymentMethod}</span>
                      <span className="text-xs text-muted-foreground">
                        {request.paymentDetails}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    {request.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => openRejectDialog(request.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                      </div>
                    )}
                    {request.status !== "pending" && (
                      <div className="text-xs text-muted-foreground">
                        {request.processedAt
                          ? `Processed: ${new Date(
                              request.processedAt
                            ).toLocaleDateString()}`
                          : ""}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {requests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No redeem requests found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Redemption Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this redemption request.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for rejection</Label>
              <Textarea
                id="reason"
                placeholder="Please explain why this request is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
