import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Organization, OrganizationPayload } from "@/apis/types/organizations";

const ACCOUNT_STATUS_OPTIONS = ["active", "inactive", "suspended", "pending"];
const BILLING_STATUS_OPTIONS = ["current", "past_due", "cancelled", "trial"];

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitLabel: string;
  initialValues?: Organization | null;
  onSubmit: (payload: OrganizationPayload) => void;
  isSubmitting: boolean;
}

const defaultValues: OrganizationPayload = {
  name: "",
  address: "",
  companyContactName: "",
  companyContactPhone: "",
  companyContactEmail: "",
  dotNumber: "",
  mcNumber: "",
  timeZone: "",
  accountStatus: "",
  billingStatus: "",
  maxDriverSeats: undefined,
  telematicsProvider: "",
  samsaraApiToken: "",
};

export function OrganizationFormDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  initialValues,
  onSubmit,
  isSubmitting,
}: OrganizationFormDialogProps) {
  const isEdit = !!initialValues?.id;
  const values = initialValues ?? defaultValues;

  const [accountStatus, setAccountStatus] = useState(values.accountStatus ?? "");
  const [billingStatus, setBillingStatus] = useState(values.billingStatus ?? "");

  useEffect(() => {
    if (!open) return;
    setAccountStatus(values.accountStatus ?? "");
    setBillingStatus(values.billingStatus ?? "");
    const form = document.getElementById("organization-form") as HTMLFormElement | null;
    if (form) form.reset();
  }, [open, values.accountStatus, values.billingStatus]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload: OrganizationPayload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      address: (form.elements.namedItem("address") as HTMLInputElement).value.trim() || undefined,
      companyContactName:
        (form.elements.namedItem("companyContactName") as HTMLInputElement).value.trim() || undefined,
      companyContactPhone:
        (form.elements.namedItem("companyContactPhone") as HTMLInputElement).value.trim() || undefined,
      companyContactEmail:
        (form.elements.namedItem("companyContactEmail") as HTMLInputElement).value.trim() || undefined,
      dotNumber:
        (form.elements.namedItem("dotNumber") as HTMLInputElement).value.trim() || undefined,
      mcNumber:
        (form.elements.namedItem("mcNumber") as HTMLInputElement).value.trim() || undefined,
      timeZone:
        (form.elements.namedItem("timeZone") as HTMLInputElement).value.trim() || undefined,
      accountStatus: accountStatus.trim() || undefined,
      billingStatus: billingStatus.trim() || undefined,
      maxDriverSeats: (() => {
        const v = (form.elements.namedItem("maxDriverSeats") as HTMLInputElement).value;
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : undefined;
      })(),
      telematicsProvider:
        (form.elements.namedItem("telematicsProvider") as HTMLInputElement).value.trim() || undefined,
      samsaraApiToken:
        (form.elements.namedItem("samsaraApiToken") as HTMLInputElement).value.trim() || undefined,
    };
    if (!payload.name) return;
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          id="organization-form"
          onSubmit={handleSubmit}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={values.name}
              placeholder="Organization name"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={values.address}
              placeholder="Street, city, state, zip"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="companyContactName">Contact name</Label>
              <Input
                id="companyContactName"
                name="companyContactName"
                defaultValue={values.companyContactName}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyContactPhone">Contact phone</Label>
              <Input
                id="companyContactPhone"
                name="companyContactPhone"
                type="tel"
                defaultValue={values.companyContactPhone}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="companyContactEmail">Contact email</Label>
            <Input
              id="companyContactEmail"
              name="companyContactEmail"
              type="email"
              defaultValue={values.companyContactEmail}
              placeholder="contact@company.com"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="dotNumber">DOT number</Label>
              <Input
                id="dotNumber"
                name="dotNumber"
                defaultValue={values.dotNumber}
                placeholder="DOT"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mcNumber">MC number</Label>
              <Input
                id="mcNumber"
                name="mcNumber"
                defaultValue={values.mcNumber}
                placeholder="MC"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="timeZone">Time zone</Label>
            <Input
              id="timeZone"
              name="timeZone"
              defaultValue={values.timeZone}
              placeholder="America/New_York"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="accountStatus">Account status</Label>
              <Select value={accountStatus || undefined} onValueChange={setAccountStatus}>
                <SelectTrigger id="accountStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="billingStatus">Billing status</Label>
              <Select value={billingStatus || undefined} onValueChange={setBillingStatus}>
                <SelectTrigger id="billingStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="maxDriverSeats">Max driver seats</Label>
            <Input
              id="maxDriverSeats"
              name="maxDriverSeats"
              type="number"
              min={0}
              defaultValue={values.maxDriverSeats ?? ""}
              placeholder="0"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telematicsProvider">Telematics provider</Label>
            <Input
              id="telematicsProvider"
              name="telematicsProvider"
              defaultValue={values.telematicsProvider}
              placeholder="e.g. Samsara"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="samsaraApiToken">Samsara API token</Label>
            <Input
              id="samsaraApiToken"
              name="samsaraApiToken"
              type="password"
              autoComplete="off"
              defaultValue={values.samsaraApiToken}
              placeholder="Optional"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
