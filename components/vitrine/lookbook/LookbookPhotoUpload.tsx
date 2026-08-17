"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadLookbookPhoto } from "@/lib/vitrine-api";
import { readFileAsDataUrl } from "@/lib/files";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const schema = z.object({
  nom: z.string().optional(),
  telephone: z.string().optional(),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function LookbookPhotoUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const { register, handleSubmit, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFileError(null);
    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!selected.type.startsWith("image/")) {
      setFileError("Le fichier doit être une image.");
      return;
    }
    if (selected.size > MAX_SIZE_BYTES) {
      setFileError("La photo est trop lourde (max 5 Mo).");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!file) {
      setFileError("Ajoute d'abord une photo.");
      return;
    }
    setStatus("submitting");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      await uploadLookbookPhoto({
        photo: dataUrl,
        nom: values.nom || undefined,
        telephone: values.telephone || undefined,
        message: values.message || undefined,
      });
      setStatus("done");
      setFile(null);
      setPreview(null);
      reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setStatus("error");
    }
  });

  return (
    <section className="py-24" style={{ backgroundColor: "var(--v-bg)" }}>
      <div className="mx-auto max-w-xl px-5 text-center md:px-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 text-[10px] font-black uppercase tracking-[0.5em]"
          style={{ color: "var(--v-gold)" }}
        >
          Ou envoie-la directement
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6 font-[var(--font-display)] font-black uppercase leading-tight tracking-tighter"
          style={{ fontSize: "clamp(28px,5vw,52px)", color: "var(--v-text)" }}
        >
          Ta photo, ton style
        </motion.h2>
        <p className="mb-8 text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
          Partage la tenue ou l&rsquo;inspiration que tu veux recr&eacute;er, notre &eacute;quipe te
          recontacte avec les pi&egrave;ces disponibles.
        </p>

        {status === "done" ? (
          <div
            className="rounded-2xl border p-8 text-sm font-semibold"
            style={{ borderColor: "var(--v-gold)", color: "var(--v-gold)" }}
          >
            Photo bien re&ccedil;ue ! On te recontacte tr&egrave;s vite.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 text-left">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="lookbook-photo-input"
            />
            <label
              htmlFor="lookbook-photo-input"
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 py-8 text-center transition-colors hover:border-[var(--v-gold)]"
              style={{ borderColor: "var(--v-border)" }}
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Aper&ccedil;u de la photo"
                  width={160}
                  height={160}
                  unoptimized
                  className="h-40 w-40 rounded-xl object-cover"
                />
              ) : (
                <>
                  <span className="text-3xl">📷</span>
                  <span className="text-sm font-bold" style={{ color: "var(--v-text)" }}>
                    Choisir une photo
                  </span>
                  <span className="text-xs" style={{ color: "var(--v-dim)" }}>
                    JPG, PNG &mdash; 5 Mo max
                  </span>
                </>
              )}
            </label>
            {fileError && (
              <p className="text-xs" style={{ color: "var(--v-red)" }}>
                {fileError}
              </p>
            )}

            <input
              {...register("nom")}
              placeholder="Ton nom (optionnel)"
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--v-gold)] placeholder:text-[var(--v-dim)]"
              style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
            />
            <input
              {...register("telephone")}
              type="tel"
              placeholder="Ton num&eacute;ro WhatsApp (optionnel)"
              className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--v-gold)] placeholder:text-[var(--v-dim)]"
              style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
            />
            <textarea
              {...register("message")}
              placeholder="Un mot sur ce que tu cherches (optionnel)"
              rows={3}
              className="w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--v-gold)] placeholder:text-[var(--v-dim)]"
              style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
            />

            {status === "error" && (
              <p className="text-xs" style={{ color: "var(--v-red)" }}>
                Envoi impossible pour le moment. R&eacute;essaie dans un instant.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: "var(--v-gold)", color: "#000" }}
            >
              {status === "submitting" ? "Envoi en cours..." : "Envoyer ma photo"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
