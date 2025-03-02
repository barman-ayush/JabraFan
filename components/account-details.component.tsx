"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Landmark, Wallet } from "lucide-react"

const paymentMethodSchema = z.object({
  cardName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  cardNumber: z.string().min(16, { message: "Card number must be at least 16 digits." }).max(19),
  expiryDate: z.string().min(5, { message: "Expiry date must be in MM/YY format." }).max(5),
  cvv: z.string().min(3, { message: "CVV must be at least 3 digits." }).max(4),
})

const bankAccountSchema = z.object({
  accountName: z.string().min(2, { message: "Account name must be at least 2 characters." }),
  accountNumber: z.string().min(8, { message: "Account number must be at least 8 digits." }),
  routingNumber: z.string().min(9, { message: "Routing number must be 9 digits." }).max(9),
  bankName: z.string().min(2, { message: "Bank name must be at least 2 characters." }),
})

type PaymentMethodValues = z.infer<typeof paymentMethodSchema>
type BankAccountValues = z.infer<typeof bankAccountSchema>

export function AccountDetails() {
  const cardForm = useForm<PaymentMethodValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  })

  const bankForm = useForm<BankAccountValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      bankName: "",
    },
  })

  function onCardSubmit(data: PaymentMethodValues) {
    console.log("Card data:", data)
  }

  function onBankSubmit(data: BankAccountValues) {
    console.log("Bank data:", data)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Add payment methods to fund your account or receive payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="card">
                <CreditCard className="h-4 w-4 mr-2" />
                Credit Card
              </TabsTrigger>
              <TabsTrigger value="bank">
                <Landmark className="h-4 w-4 mr-2" />
                Bank Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card">
              <Form {...cardForm}>
                <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-4">
                  <FormField
                    control={cardForm.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={cardForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={cardForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={cardForm.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Add Card
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="bank">
              <Form {...bankForm}>
                <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-4">
                  <FormField
                    control={bankForm.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bankForm.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Bank of America" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bankForm.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bankForm.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Add Bank Account
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>Your current account balance and recent transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Available Balance</p>
                <p className="text-2xl font-bold">$1,250.00</p>
              </div>
            </div>
            <Button>Add Money</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

