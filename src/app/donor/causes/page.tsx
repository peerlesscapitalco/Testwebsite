"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import { formatCurrency, getCategoryLabel } from "@/lib/utils";
import { CAUSE_CATEGORIES } from "@/types";

interface Cause {
  id: string;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  image: string | null;
  organization: { name: string; status: string };
}

function CausesContent() {
  const searchParams = useSearchParams();
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [donateModal, setDonateModal] = useState<Cause | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donating, setDonating] = useState(false);
  const [donateSuccess, setDonateSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    params.set("status", "active");

    fetch(`/api/causes?${params}`)
      .then((res) => res.json())
      .then((data) => setCauses(data.causes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleDonate = async () => {
    if (!donateModal || !donationAmount) return;
    setDonating(true);

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          causeId: donateModal.id,
          amount: parseFloat(donationAmount),
          message: donationMessage || null,
          isAnonymous,
        }),
      });

      if (res.ok) {
        setDonateSuccess(true);
        setCauses((prev) =>
          prev.map((c) =>
            c.id === donateModal.id
              ? { ...c, raisedAmount: c.raisedAmount + parseFloat(donationAmount) }
              : c
          )
        );
      }
    } catch {
      // handle error
    } finally {
      setDonating(false);
    }
  };

  const closeDonateModal = () => {
    setDonateModal(null);
    setDonationAmount("");
    setDonationMessage("");
    setIsAnonymous(false);
    setDonateSuccess(false);
  };

  const PRESET_AMOUNTS = [25, 50, 100, 250, 500, 1000];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Browse Causes</h1>
        <p className="mt-1 text-gray-500">Support verified domestic violence causes</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Causes
        </button>
        {CAUSE_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.value
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : causes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No active causes found</p>
          <p className="text-gray-400 mt-2">Check back soon for new opportunities to help</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {causes.map((cause) => (
            <Card key={cause.id} padding={false}>
              <div className="h-40 bg-gradient-to-br from-primary-100 to-accent-100 rounded-t-xl flex items-center justify-center">
                <span className="text-4xl">
                  {CAUSE_CATEGORIES.find((c) => c.value === cause.category)?.icon || "💜"}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge status={cause.status} />
                  <span className="text-xs text-gray-400">{getCategoryLabel(cause.category)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{cause.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{cause.description}</p>
                <p className="text-xs text-gray-400 mb-3">by {cause.organization.name}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900">{formatCurrency(cause.raisedAmount)}</span>
                    <span className="text-gray-400">of {formatCurrency(cause.goalAmount)}</span>
                  </div>
                  <ProgressBar current={cause.raisedAmount} total={cause.goalAmount} showLabel={false} />
                </div>

                <Button onClick={() => setDonateModal(cause)} className="w-full" size="sm">
                  Donate
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Donate Modal */}
      <Modal isOpen={!!donateModal} onClose={closeDonateModal} title={donateSuccess ? "Thank You!" : "Make a Donation"}>
        {donateSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Donation Successful!</h3>
            <p className="text-gray-500 mb-6">
              Your {formatCurrency(parseFloat(donationAmount))} donation to &quot;{donateModal?.title}&quot; has been processed.
            </p>
            <Button onClick={closeDonateModal} className="w-full">Done</Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500 mb-1">Donating to</p>
              <p className="font-semibold text-gray-900">{donateModal?.title}</p>
              <p className="text-sm text-gray-400">{donateModal?.organization.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDonationAmount(amt.toString())}
                    className={`py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                      donationAmount === amt.toString()
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Or enter custom amount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
              <textarea
                rows={2}
                value={donationMessage}
                onChange={(e) => setDonationMessage(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Leave a message of support"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">Make this donation anonymous</span>
            </label>

            <Button
              onClick={handleDonate}
              isLoading={donating}
              disabled={!donationAmount || parseFloat(donationAmount) <= 0}
              className="w-full"
              size="lg"
            >
              Donate {donationAmount ? formatCurrency(parseFloat(donationAmount)) : ""}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function CausesPage() {
  return (
    <Suspense fallback={<div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-48 mb-6" /></div>}>
      <CausesContent />
    </Suspense>
  );
}
