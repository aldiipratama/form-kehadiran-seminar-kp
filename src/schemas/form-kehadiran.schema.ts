import z from "zod";

export const FormKehadiranSchema = z.object({
  nama_lengkap: z
    .string("Nama Lengkap Harus Diisi.")
    .min(5, "Nama Lengkap Minimal 5 Karakter.")
    .max(30, "Nama Lengkap Minimal 30 Karakter."),
  npm: z
    .string("NPM Harus Diisi.")
    .refine((val) => val.length === 9, {
      error: "NPM Harus 9 Karakter, Tidak Kurang dan Tidak Lebih.",
    }),
  kelas: z.enum(["A", "B", "C", "D"], "Kelas Harus Diisi."),
  status_kehadiran: z.enum(
    ["Dosen", "Mahasiswa", "Tamu"],
    "Status Harus Diisi."
  ),
  tanda_kehadiran: z.string("Tanda Konfirmasi Kehadiran Harus Diisi."),
});
