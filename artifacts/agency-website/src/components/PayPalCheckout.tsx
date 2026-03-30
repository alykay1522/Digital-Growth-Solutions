import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

const BASE_URL = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

interface PayPalCheckoutProps {
  amount: string;
  description: string;
  onSuccess?: (orderId: string) => void;
  onError?: (err: unknown) => void;
  className?: string;
}

function Buttons({ amount, description, onSuccess, onError }: PayPalCheckoutProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
        <p className="font-semibold text-secondary">Payment received — thank you!</p>
        <p className="text-sm text-muted-foreground">
          You'll get a confirmation email from PayPal shortly. We'll be in touch within 24 hours to kick things off.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        {errorMsg || "Payment failed. Please try again or contact us directly."}
      </div>
    );
  }

  return (
    <div className="w-full">
      {isPending && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading PayPal…
        </div>
      )}
      <PayPalButtons
        style={{ layout: "vertical", shape: "rect", color: "blue", label: "pay" }}
        createOrder={async () => {
          const res = await fetch(`${BASE_URL}/api/paypal/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, description }),
          });
          const data = await res.json();
          if (!res.ok || data.error) throw new Error(data.error || "Order creation failed");
          return data.id;
        }}
        onApprove={async (data) => {
          const res = await fetch(`${BASE_URL}/api/paypal/capture-order/${data.orderID}`, {
            method: "POST",
          });
          const capture = await res.json();
          if (!res.ok || capture.error) throw new Error(capture.error || "Capture failed");
          setStatus("success");
          onSuccess?.(data.orderID);
        }}
        onError={(err) => {
          setStatus("error");
          setErrorMsg("Something went wrong with PayPal. Please try again.");
          onError?.(err);
        }}
        onCancel={() => {
          // user cancelled — stay on idle, no error message
        }}
      />
    </div>
  );
}

export function PayPalCheckout(props: PayPalCheckoutProps) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/paypal/client-id`)
      .then((r) => r.json())
      .then((d) => {
        if (d.clientId) setClientId(d.clientId);
        else setConfigError(true);
      })
      .catch(() => setConfigError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Initialising payment…
      </div>
    );
  }

  if (configError || !clientId) {
    return (
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        PayPal is not yet connected. Please contact us directly to arrange payment.
      </div>
    );
  }

  return (
    <div className={props.className}>
      <PayPalScriptProvider
        options={{
          clientId,
          currency: "USD",
          intent: "capture",
        }}
      >
        <Buttons {...props} />
      </PayPalScriptProvider>
    </div>
  );
}
