/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useUserContext } from "@/context/UserContext"
import { useFlash } from "./Flash.component"

const MinimumWithdrawalAmount = 5;


export function UserProfile() {
  const { userData , setUserData } = useUserContext()
  const router = useRouter()
  const { flash } = useFlash()
  
  const [upiId, setUpiId] = useState(userData?.upiId || "")
  const [redeemAmount, setRedeemAmount] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [showRedeemForm, setShowRedeemForm] = useState(false)
  
  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true)
      
      // Check if UPI ID has changed
      if (upiId === userData?.upiId) {
        flash("No changes detected.", {variant: "warning"})
        setIsUpdating(false)
        return
      }
      
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upiId,
          userId : userData?.id
        }),
      })
      const userParsedData : any = await response.json();
      if (response.ok) {
        setUserData(userParsedData.data);
        flash("UPI ID updated successfully!", {variant: "success"})
        router.refresh()
      } else {
        const error = await response.json()
        flash(error.message || "Failed to update UPI ID", {variant: "error"})
      }
    } catch (error) {
      flash("An error occurred while updating UPI ID", {variant: "error"})
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }
  
  const handleChangePhoto = async (e : any) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const formData = new FormData()
    formData.append("photo", file)
    
    try {
      const response = await fetch("/api/user/update-photo", {
        method: "POST",
        body: formData,
      })
      
      if (response.ok) {
        flash("Profile photo updated successfully!", {variant: "success"})
        router.refresh()
      } else {
        const error = await response.json()
        flash(error.message || "Failed to update photo", {variant: "error"})
      }
    } catch (error) {
      flash("An error occurred while updating photo", {variant: "error"})
      console.error(error)
    }
  }
  
  const handleRedeemRequest = async () => {
    try {
      setIsRedeeming(true)
      
      // Check if UPI ID is available
      if (!userData?.upiId) {
        flash("Please add your UPI ID before requesting redemption", {variant: "error"})
        setIsRedeeming(false)
        return
      }
      
      // Validate amount
      if (!redeemAmount || parseInt(redeemAmount) <= 0) {
        flash("Please enter a valid amount", {variant: "error"})
        setIsRedeeming(false)
        return
      }
      
      const amount = parseInt(redeemAmount)
      
      // Check if amount is at least 500
      if (amount < MinimumWithdrawalAmount) {
        flash(`Minimum withdrawal amount is ₹${MinimumWithdrawalAmount}`, {variant: "error"})
        setIsRedeeming(false)
        return
      }
      
      // Check if user has sufficient balance
      if (amount > userData!.winnings) {
        flash("Insufficient balance", {variant: "error"})
        setIsRedeeming(false)
        return
      }
      
      const response = await fetch("/api/user/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.id,
          amount: amount,
          paymentMethod: "UPI",
          paymentDetails: userData?.upiId
        }),
      })
      
      if (response.ok) {
        flash("Redemption request submitted successfully!", {variant: "success"})
        setShowRedeemForm(false)
        setRedeemAmount("")
        router.refresh()
      } else {
        const error = await response.json()
        flash(error.message || error.error || "Failed to submit redemption request", {variant: "error"})
      }
    } catch (error) {
      flash("An error occurred while submitting redemption request", {variant: "error"})
      console.error(error)
    } finally {
      setIsRedeeming(false)
    }
  }
  
  return (
    <div className="space-y-8">
      {/* Profile Photo Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100">
                {userData?.src ? (
                  <Image
                    src={userData.src}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-4xl font-bold text-gray-400">
                      {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
              <Label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white cursor-pointer"
              >
                <Camera className="h-5 w-5" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleChangePhoto}
                />
              </Label>
            </div>
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h2 className="text-xl font-semibold">{userData?.name}</h2>
              <p className="text-gray-500">{userData?.phone}</p>
              <div className="mt-2">
                <div className="text-sm font-medium">Credits: <span className="font-bold">{userData?.credits || 0}</span></div>
                <div className="text-sm font-medium">Earnings: <span className="font-bold">₹{userData?.winnings || 0}</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Account Balance Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Your Balance</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <div className="text-3xl font-bold">₹{userData?.winnings || 0}</div>
              <p className="text-sm text-gray-500 mt-1">Available for redemption</p>
            </div>
            <Button 
              onClick={() => setShowRedeemForm(!showRedeemForm)} 
              className="mt-4 sm:mt-0"
            >
              Redeem Cash
            </Button>
          </div>
          
          {showRedeemForm && (
            <div className="mt-6 border rounded-lg p-4">
              <h4 className="font-medium mb-3">Redeem Amount</h4>
              {!userData?.upiId && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                  Please add your UPI ID before requesting redemption
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(e.target.value)}
                  className="max-w-xs"
                />
                <Button 
                  onClick={handleRedeemRequest} 
                  disabled={isRedeeming || !userData?.upiId}
                >
                  {isRedeeming ? "Processing..." : "Submit"}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Minimum redemption amount is ₹{MinimumWithdrawalAmount}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* UPI ID Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Payment Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="upi">UPI ID</Label>
              <Input 
                id="upi" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@bankname"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Required for redemption requests</p>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleUpdateProfile}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update UPI ID"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}