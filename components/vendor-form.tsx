"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CreateVendorInput } from "@/lib/bids-types";

const FOUND_VIA_OPTIONS = ["Google", "Facebook", "Snapchat", "TikTok", "Reddit", "Quora", "Referral", "Other"];
const SOCIAL_PLATFORMS = ["LinkedIn", "Facebook", "Instagram", "Twitter", "YouTube", "Website"];

interface TradeCategoryOption {
  id: string;
  name: string;
}

interface VendorFormProps {
  initialData?: Partial<CreateVendorInput> & { notes?: string; found_via?: string[]; trade_category_id?: string | null };
  tradeCategories?: TradeCategoryOption[];
  /** If true, hide trade category field (e.g. for simplified add from Bids page) */
  hideTradeCategory?: boolean;
  onSubmit: (data: CreateVendorInput & { notes?: string; found_via?: string[]; trade_category_id?: string | null }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function VendorForm({
  initialData,
  tradeCategories = [],
  hideTradeCategory = false,
  onSubmit,
  onCancel,
  submitLabel = "Add Vendor",
}: VendorFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [companyName, setCompanyName] = useState(initialData?.company_name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [website, setWebsite] = useState(initialData?.website ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [city, setCity] = useState(initialData?.city ?? "");
  const [state, setState] = useState(initialData?.state ?? "");
  const [zipCode, setZipCode] = useState(initialData?.zip_code ?? "");
  const [ratingPlatform, setRatingPlatform] = useState(initialData?.rating_platform ?? "");
  const [ratingScore, setRatingScore] = useState(initialData?.rating_score?.toString() ?? "");
  const [ratingReviews, setRatingReviews] = useState(initialData?.rating_reviews?.toString() ?? "");
  const [notes, setNotes] = useState((initialData as { notes?: string })?.notes ?? "");
  const [socialMedia, setSocialMedia] = useState<{ platform: string; handle: string }[]>(
    initialData?.social_media ?? []
  );
  const [foundVia, setFoundVia] = useState<string[]>(initialData?.found_via ?? []);
  const [tradeCategoryId, setTradeCategoryId] = useState<string>((initialData as { trade_category_id?: string })?.trade_category_id ?? "");
  const [newSocial, setNewSocial] = useState({ platform: "", handle: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFoundVia = (source: string) => {
    setFoundVia((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const addSocialMedia = () => {
    if (newSocial.platform && newSocial.handle.trim()) {
      setSocialMedia((prev) => [...prev, { platform: newSocial.platform, handle: newSocial.handle }]);
      setNewSocial({ platform: "", handle: "" });
    }
  };

  const removeSocialMedia = (index: number) => {
    setSocialMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        company_name: companyName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        zip_code: zipCode.trim() || undefined,
        rating_platform: ratingPlatform.trim() || undefined,
        rating_score: ratingScore ? parseFloat(ratingScore) : undefined,
        rating_reviews: ratingReviews ? parseInt(ratingReviews, 10) : undefined,
        social_media: socialMedia.length > 0 ? socialMedia : undefined,
        notes: notes.trim() || undefined,
        found_via: foundVia.length > 0 ? foundVia : undefined,
      } as CreateVendorInput & { notes?: string; found_via?: string[] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {tradeCategories.length > 0 && !hideTradeCategory && (
        <div>
          <Label htmlFor="trade-category">Type / Trade Category</Label>
          <select
            id="trade-category"
            value={tradeCategoryId}
            onChange={(e) => setTradeCategoryId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a type...</option>
            {tradeCategories.map((tc) => (
              <option key={tc.id} value={tc.id}>
                {tc.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., ABC Construction"
            required
          />
        </div>
        <div>
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g., ABC Construction LLC"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://www.example.com"
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="zip">ZIP Code</Label>
          <Input id="zip" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="rating-platform">Rating Platform</Label>
          <Input
            id="rating-platform"
            value={ratingPlatform}
            onChange={(e) => setRatingPlatform(e.target.value)}
            placeholder="e.g., Google, Yelp"
          />
        </div>
        <div>
          <Label htmlFor="rating-score">Rating Score</Label>
          <Input
            id="rating-score"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={ratingScore}
            onChange={(e) => setRatingScore(e.target.value)}
            placeholder="4.5"
          />
        </div>
        <div>
          <Label htmlFor="rating-reviews">Review Count</Label>
          <Input
            id="rating-reviews"
            type="number"
            min="0"
            value={ratingReviews}
            onChange={(e) => setRatingReviews(e.target.value)}
            placeholder="25"
          />
        </div>
      </div>

      <div>
        <Label>Social Media</Label>
        {socialMedia.length > 0 && (
          <div className="space-y-2 mb-2">
            {socialMedia.map((s, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                <Badge variant="outline">{s.platform}</Badge>
                <span className="text-sm flex-1">{s.handle}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSocialMedia(i)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <select
            value={newSocial.platform}
            onChange={(e) => setNewSocial((p) => ({ ...p, platform: e.target.value }))}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Platform</option>
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <Input
            value={newSocial.handle}
            onChange={(e) => setNewSocial((p) => ({ ...p, handle: e.target.value }))}
            placeholder="Handle or URL"
          />
          <Button type="button" variant="outline" size="sm" onClick={addSocialMedia} disabled={!newSocial.platform || !newSocial.handle.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label>How did you find them?</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {FOUND_VIA_OPTIONS.map((source) => (
            <Button
              key={source}
              type="button"
              variant={foundVia.includes(source) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFoundVia(source)}
            >
              {source}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes about this vendor..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim() || isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
