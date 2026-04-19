"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// ─── Types ───────────────────────────────────────────────
type Category =
  | "Electronics" | "Fashion" | "Fitness" | "Home"
  | "Gaming" | "Beauty" | "Books" | "Others";

const CATEGORIES: Category[] = [
  "Electronics", "Fashion", "Fitness", "Home",
  "Gaming", "Beauty", "Books", "Others",
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// ─── Main Component ──────────────────────────────────────
export default function AddProductPage() {
  const router = useRouter();

  // ── Controlled States ──
  const [title, setTitle]                     = useState("");
  const [price, setPrice]                     = useState("");
  const [stock, setStock]                     = useState("");
  const [category, setCategory]               = useState<Category | "">("");
  const [customCategory, setCustomCategory]   = useState("");
  const [description, setDescription]         = useState("");
  const [isWearable, setIsWearable]           = useState(false);
  const [sizes, setSizes]                     = useState<string[]>([]);
  const [replacementDays, setReplacementDays] = useState("");
  const [warranty, setWarranty]               = useState("");
  const [freeDelivery, setFreeDelivery]       = useState(false);
  const [cod, setCod]                         = useState(false);
  const [points, setPoints]                   = useState<string[]>([""]);
  const [loading, setLoading]                 = useState(false);

  // ── 4 Separate Image Preview States ──
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [preview3, setPreview3] = useState<string | null>(null);
  const [preview4, setPreview4] = useState<string | null>(null);

  // ── 4 Separate Backend File States ──
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);
  const [file4, setFile4] = useState<File | null>(null);

  // ── 4 Separate Refs for file inputs ──
  const imgRef1 = useRef<HTMLInputElement>(null);
  const imgRef2 = useRef<HTMLInputElement>(null);
  const imgRef3 = useRef<HTMLInputElement>(null);
  const imgRef4 = useRef<HTMLInputElement>(null);

  // ── Image Handlers ──
  const handleImg1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview1(URL.createObjectURL(f));
    setFile1(f);
    e.target.value = "";
  };

  const handleImg2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview2(URL.createObjectURL(f));
    setFile2(f);
    e.target.value = "";
  };

  const handleImg3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview3(URL.createObjectURL(f));
    setFile3(f);
    e.target.value = "";
  };

  const handleImg4 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview4(URL.createObjectURL(f));
    setFile4(f);
    e.target.value = "";
  };

  // ── Size Handler ──
  const toggleSize = (s: string) =>
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  // ── Point Handlers ──
  const addPoint    = () => setPoints((p) => [...p, ""]);
  const removePoint = (i: number) => setPoints((p) => p.filter((_, idx) => idx !== i));
  const updatePoint = (i: number, val: string) =>
    setPoints((p) => { const n = [...p]; n[i] = val; return n; });

  // ── Reset ──
  const handleReset = () => {
    setTitle(""); setPrice(""); setStock(""); setCategory("");
    setCustomCategory(""); setDescription(""); setIsWearable(false);
    setSizes([]); setReplacementDays(""); setWarranty("");
    setFreeDelivery(false); setCod(false); setPoints([""]);
    setPreview1(null); setPreview2(null); setPreview3(null); setPreview4(null);
    setFile1(null); setFile2(null); setFile3(null); setFile4(null);
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!title.trim()) { alert("Product title is required"); return; }
    if (!price)        { alert("Price is required"); return; }
    if (!category)     { alert("Please select a category"); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category === "Others" ? customCategory : category);
      formData.append("description", description);
      formData.append("isWearable", String(isWearable));
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("replacementDays", replacementDays);
      formData.append("warranty", warranty);
      formData.append("freeDelivery", String(freeDelivery));
      formData.append("cod", String(cod));
      formData.append("points", JSON.stringify(points.filter((p) => p.trim())));
      if (file1) formData.append("image1", file1);
      if (file2) formData.append("image2", file2);
      if (file3) formData.append("image3", file3);
      if (file4) formData.append("image4", file4);

      const res = await axios.post("/api/vendor/addProductVendor", formData);
      console.log(res);
      toast.success("Product added!");
    //   router.push("/vendor");

      console.log("Submit ready", { title, price, stock, category, sizes, points, file1, file2, file3, file4 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── UI ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#030712] text-white px-4 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="self-start flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="mb-2">
          <h1 className="text-xl font-semibold">Add product</h1>
          <p className="text-white/40 text-sm mt-0.5">Fill in the details to list a new product.</p>
        </div>

        {/* ── Basic Info ── */}
        <Section label="Basic info">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Product title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Wireless Earbuds Pro"
                className={inp}
              />
            </Field>
            <Field label="Price (₹)">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min={0}
                className={inp}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Field label="Stock quantity">
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                min={0}
                className={inp}
              />
            </Field>
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={inp}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {category === "Others" && (
            <div className="mt-3">
              <Field label="Custom category">
                <input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter your category"
                  className={inp}
                />
              </Field>
            </div>
          )}

          <div className="mt-3">
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product..."
                rows={3}
                className={`${inp} resize-none`}
              />
            </Field>
          </div>
        </Section>

        {/* ── Wearable ── */}
        <Section label="Wearable & sizing">
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => { setIsWearable((p) => !p); if (isWearable) setSizes([]); }}
          >
            <div className={`relative w-9 h-5 rounded-full border transition-colors duration-200
              ${isWearable ? "bg-blue-600 border-blue-600" : "bg-white/10 border-white/20"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200
                ${isWearable ? "left-4" : "left-0.5"}`} />
            </div>
            <span className="text-sm text-white/70">This is a wearable product</span>
          </div>

          {isWearable && (
            <div className="mt-4">
              <p className="text-xs text-white/40 mb-2">Select available sizes</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`px-4 py-1.5 rounded-xl text-xs border transition-colors
                      ${sizes.includes(s)
                        ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* ── Warranty & Returns ── */}
        <Section label="Warranty & returns">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Replacement days">
              <input
                type="number"
                value={replacementDays}
                onChange={(e) => setReplacementDays(e.target.value)}
                placeholder="e.g. 7"
                min={0}
                className={inp}
              />
            </Field>
            <Field label="Warranty (months)">
              <input
                type="number"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="e.g. 12"
                min={0}
                className={inp}
              />
            </Field>
          </div>
        </Section>

        {/* ── Delivery ── */}
        <Section label="Delivery options">
          <div className="flex gap-6">
            <CheckItem
              label="Free delivery"
              checked={freeDelivery}
              onChange={() => setFreeDelivery((p) => !p)}
            />
            <CheckItem
              label="Cash on delivery"
              checked={cod}
              onChange={() => setCod((p) => !p)}
            />
          </div>
        </Section>

        {/* ── Images ── */}
        <Section label="Product images">
          <div className="grid grid-cols-4 gap-3">

            {/* Image 1 */}
            <div className="relative aspect-square">
              {preview1 ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview1} alt="img-1" className="w-full h-full object-cover rounded-xl border border-white/10" />
                  <button onClick={() => { setPreview1(null); setFile1(null); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
                    <X size={11} className="text-white" />
                  </button>
                </>
              ) : (
                <button onClick={() => imgRef1.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center gap-1 border border-dashed border-white/15 rounded-xl bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06] transition-colors">
                  <Plus size={16} className="text-white/30" />
                  <span className="text-[10px] text-white/30">Image 1</span>
                </button>
              )}
              <input type="file" hidden ref={imgRef1} accept="image/*" onChange={handleImg1} />
            </div>

            {/* Image 2 */}
            <div className="relative aspect-square">
              {preview2 ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview2} alt="img-2" className="w-full h-full object-cover rounded-xl border border-white/10" />
                  <button onClick={() => { setPreview2(null); setFile2(null); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
                    <X size={11} className="text-white" />
                  </button>
                </>
              ) : (
                <button onClick={() => imgRef2.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center gap-1 border border-dashed border-white/15 rounded-xl bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06] transition-colors">
                  <Plus size={16} className="text-white/30" />
                  <span className="text-[10px] text-white/30">Image 2</span>
                </button>
              )}
              <input type="file" hidden ref={imgRef2} accept="image/*" onChange={handleImg2} />
            </div>

            {/* Image 3 */}
            <div className="relative aspect-square">
              {preview3 ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview3} alt="img-3" className="w-full h-full object-cover rounded-xl border border-white/10" />
                  <button onClick={() => { setPreview3(null); setFile3(null); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
                    <X size={11} className="text-white" />
                  </button>
                </>
              ) : (
                <button onClick={() => imgRef3.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center gap-1 border border-dashed border-white/15 rounded-xl bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06] transition-colors">
                  <Plus size={16} className="text-white/30" />
                  <span className="text-[10px] text-white/30">Image 3</span>
                </button>
              )}
              <input type="file" hidden ref={imgRef3} accept="image/*" onChange={handleImg3} />
            </div>

            {/* Image 4 */}
            <div className="relative aspect-square">
              {preview4 ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview4} alt="img-4" className="w-full h-full object-cover rounded-xl border border-white/10" />
                  <button onClick={() => { setPreview4(null); setFile4(null); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
                    <X size={11} className="text-white" />
                  </button>
                </>
              ) : (
                <button onClick={() => imgRef4.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center gap-1 border border-dashed border-white/15 rounded-xl bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06] transition-colors">
                  <Plus size={16} className="text-white/30" />
                  <span className="text-[10px] text-white/30">Image 4</span>
                </button>
              )}
              <input type="file" hidden ref={imgRef4} accept="image/*" onChange={handleImg4} />
            </div>

          </div>
        </Section>

        {/* ── Highlights ── */}
        <Section label="Product highlights">
          <div className="flex flex-col gap-2">
            {points.map((p, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={p}
                  onChange={(e) => updatePoint(i, e.target.value)}
                  placeholder="e.g. Water resistant up to 30m"
                  className={`${inp} flex-1`}
                />
                {points.length > 1 && (
                  <button
                    onClick={() => removePoint(i)}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10 hover:border-red-500/40 hover:text-red-400 transition-colors text-white/30"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addPoint}
            className="mt-3 flex items-center gap-1.5 text-blue-400 text-xs border border-blue-500/20 rounded-lg px-3 py-1.5 hover:bg-blue-500/10 transition-colors"
          >
            <Plus size={12} /> Add point
          </button>
        </Section>

        {/* ── Submit ── */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 hover:bg-white/5 hover:text-white transition-colors text-sm"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add product"}
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Helper Components ───────────────────────────────────

const inp =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white " +
  "placeholder-white/20 outline-none focus:border-white/30 transition-colors";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0f1e] border border-white/10 rounded-2xl p-5">
      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">{label}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-white/40">{label}</label>
      {children}
    </div>
  );
}

function CheckItem({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-blue-500 cursor-pointer"
      />
      <span className="text-sm text-white/70">{label}</span>
    </label>
  );
}
