"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { InsightEditor } from "@/src/components/insights/InsightEditor";
import { createInsightInApi } from "@/src/lib/insights-api";
import { useToast } from "@/src/components/ToastProvider";

export default function CreateInsightPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const handleSaved = async (insightData: any, action: "draft" | "publish") => {
    try {
      const token = localStorage.getItem("atlas_admin_token");
      await createInsightInApi(insightData, token);
      success(action === "publish" ? "Insight published to website." : "Draft saved successfully.");
      router.push("/insights");
    } catch (err: any) {
      error(err.message || "Failed to create insight");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-atlas-textMuted hover:text-atlas-text"
      >
        <ArrowLeft className="size-4" />
        Back to Insights
      </button>

      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
          Insights &gt; Create Insight
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl">Create Insight</h1>
        <p className="mt-1.5 text-sm text-atlas-textMuted">
          Publish a new insight to the LMCS website.
        </p>
      </div>

      <InsightEditor
        mode="create"
        onCancel={() => router.push("/insights")}
        onSaved={handleSaved}
      />
    </div>
  );
}
