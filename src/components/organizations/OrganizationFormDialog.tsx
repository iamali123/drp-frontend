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
import type {
  Organization,
  OrganizationPayload,
  OrganizationCreatePayload,
  OrganizationUpdatePayload,
} from "@/apis/types/organizations";

// Backend enums: AccountStatus, BillingStatus, TelematicsProvider
const ACCOUNT_STATUS_OPTIONS = ["Active", "Suspended", "PendingSetup"];
const BILLING_STATUS_OPTIONS = ["Active", "Trial", "OnHold"];
const TELEMATICS_PROVIDER_OPTIONS = ["Samsara"];

type OrganizationFormDialogProps =
  | {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      title: string;
      submitLabel: string;
      initialValues?: Organization | null;
      onSubmit: (payload: OrganizationCreatePayload) => void;
      isSubmitting: boolean;
      mode: "create";
    }
  | {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      title: string;
      submitLabel: string;
      initialValues: Organization;
      onSubmit: (payload: OrganizationUpdatePayload) => void;
      isSubmitting: boolean;
      mode: "edit";
    };

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

export function OrganizationFormDialog(props: OrganizationFormDialogProps) {
  const { open, onOpenChange, title, submitLabel, initialValues, onSubmit, isSubmitting, mode } = props;
  const isEdit = mode === "edit";
  const values = initialValues ?? defaultValues;

  const [accountStatus, setAccountStatus] = useState(values.accountStatus ?? "");
  const [billingStatus, setBillingStatus] = useState(values.billingStatus ?? "");
  const [telematicsProvider, setTelematicsProvider] = useState(values.telematicsProvider ?? "Samsara");

  useEffect(() => {
    if (!open) return;
    setAccountStatus(values.accountStatus ?? "");
    setBillingStatus(values.billingStatus ?? "");
    setTelematicsProvider(values.telematicsProvider ?? "Samsara");
    const form = document.getElementById("organization-form") as HTMLFormElement | null;
    if (form) form.reset();
  }, [open, values.accountStatus, values.billingStatus, values.telematicsProvider]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value?.trim() ?? "";
    const getNum = (name: string) => {
      const v = (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? n : 0;
    };

    if (isEdit && mode === "edit" && initialValues?.id) {
      // Update payload - only specific fields (no name, accountStatus, billingStatus, telematics, token)
      const payload: OrganizationUpdatePayload = {
        id: initialValues.id,
        address: get("address"),
        companyContactName: get("companyContactName"),
        companyContactPhone: get("companyContactPhone"),
        companyContactEmail: get("companyContactEmail"),
        dotNumber: get("dotNumber"),
        mcNumber: get("mcNumber"),
        timeZone: get("timeZone"),
        maxDriverSeats: getNum("maxDriverSeats"),
      };
      (onSubmit as (payload: OrganizationUpdatePayload) => void)(payload);
      return;
    }

    if (mode === "create") {
      const name = get("name");
      const address = get("address");
      const companyContactName = get("companyContactName");
      const companyContactPhone = get("companyContactPhone");
      const companyContactEmail = get("companyContactEmail");
      const dotNumber = get("dotNumber");
      const mcNumber = get("mcNumber");
      const timeZone = get("timeZone");
      const maxDriverSeats = getNum("maxDriverSeats");
      const samsaraApiToken = get("samsaraApiToken");
      // Create payload - all fields required
      const payload: OrganizationCreatePayload = {
        name,
        address,
        companyContactName,
        companyContactPhone,
        companyContactEmail,
        dotNumber,
        mcNumber,
        timeZone,
        accountStatus: accountStatus.trim() || "",
        billingStatus: billingStatus.trim() || "",
        maxDriverSeats,
        telematicsProvider: telematicsProvider.trim() || "Samsara",
        samsaraApiToken,
      };
      if (!name) return;
      (onSubmit as (payload: OrganizationCreatePayload) => void)(payload);
    }
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
          {!isEdit && (
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
          )}
          <div className="grid gap-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              defaultValue={values.address}
              placeholder="Street, city, state, zip"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="companyContactName">Contact name *</Label>
              <Input
                id="companyContactName"
                name="companyContactName"
                defaultValue={values.companyContactName}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="companyContactPhone">Contact phone *</Label>
              <Input
                id="companyContactPhone"
                name="companyContactPhone"
                type="tel"
                defaultValue={values.companyContactPhone}
                placeholder="+1 234 567 8900"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="companyContactEmail">Contact email *</Label>
            <Input
              id="companyContactEmail"
              name="companyContactEmail"
              type="email"
              defaultValue={values.companyContactEmail}
              placeholder="contact@company.com"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="dotNumber">DOT number *</Label>
              <Input
                id="dotNumber"
                name="dotNumber"
                defaultValue={values.dotNumber}
                placeholder="DOT"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mcNumber">MC number *</Label>
              <Input
                id="mcNumber"
                name="mcNumber"
                defaultValue={values.mcNumber}
                placeholder="MC"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="timeZone">Time zone *</Label>
            <Input
              id="timeZone"
              name="timeZone"
              defaultValue={values.timeZone}
              placeholder="America/New_York"
              required
            />
          </div>
          {!isEdit && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="accountStatus">Account status *</Label>
                  <Select value={accountStatus || undefined} onValueChange={setAccountStatus} required>
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
                  <Label htmlFor="billingStatus">Billing status *</Label>
                  <Select value={billingStatus || undefined} onValueChange={setBillingStatus} required>
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
                <Label htmlFor="telematicsProvider">Telematics provider *</Label>
                <Select
                  value={telematicsProvider || undefined}
                  onValueChange={setTelematicsProvider}
                  required
                >
                  <SelectTrigger id="telematicsProvider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {TELEMATICS_PROVIDER_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="samsaraApiToken">Samsara API token *</Label>
                <Input
                  id="samsaraApiToken"
                  name="samsaraApiToken"
                  type="password"
                  autoComplete="off"
                  defaultValue={values.samsaraApiToken}
                  placeholder="Required"
                  required
                />
              </div>
            </>
          )}
          <div className="grid gap-2">
            <Label htmlFor="maxDriverSeats">Max driver seats *</Label>
            <Input
              id="maxDriverSeats"
              name="maxDriverSeats"
              type="number"
              min={0}
              defaultValue={values.maxDriverSeats ?? ""}
              placeholder="0"
              required
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
